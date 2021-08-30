import parseOmekaApi from "../util/parser";
import { GET } from "./methods";

export const processFeed = async (results, page) => {
  let records = [];
  for (let r of results) {
    if (r != undefined)
      records.push({
        id: r["o:id"].toString(),
        name: r["dcterms:title"][0]["@value"],
        description: r["dcterms:description"][0]["@value"],
        media: r["o:media"][0]
          ? await fetchMedia(r["o:media"][0]["@id"])
          : null,
      });
  }
  const processed = {
    page,
    records,
  };
  console.log(records)
  return processed;
};

export const fetchFeed = async (url = null, page = 1, extra = "") => {
  const results = await GET(url ? url : `items?page=${page}&per_page=20`);
  return await processFeed(results, page);
};

export const processRecordImages = (images) =>
  images.map((image) => image.baseimageurl);

export const processRecord = (record) => {
  const properties = parseOmekaApi(record);
  const processed = {
    ...record,
    images: record.images ? processRecordImages(record) : [],
    properties,
  };
  return processed;
};

export const fetchRecord = async (id) => {
  const results = await GET(`items/${id}`);
  return processRecord(results);
};

export const fetchCollections = async (url = null) => {
  const results = await GET(url ? url : `item_sets`);
  return {
    records: results.map((r) => ({
      // ...r,
      id: r["o:id"].toString(),
      name: r["dcterms:title"][0]["@value"],
    })),
  };
};

export const fetchListOf = async (
  url = null,
  target,
  desc = true,
  search = null
) => {
  if (!url) {
    let fields;
    let sort = "name";
    let extra = "";
    const sortorder = desc ? "desc" : "asc";

    switch (target) {
      case "object":
        sort = "title";
        fields = "objectnumber,title";
        extra = "&hasimage=1";
        break;
      case "gallery":
        fields = "id,name,objectcount,theme";
        break;
      case "century":
        sort = "temporalorder";
        fields = "id,name,objectcount,temporalorder";
        break;
      default:
        fields = "id,name,objectcount";
        break;
    }

    if (search) {
      if (target == "object") extra += `&title=${search}`;
      else extra += `&q=${sort}:${search}`;
    }

    url =
      `https://api.harvardartmuseums.org/` +
      `${target}?` +
      `apikey=${API_KEY}` +
      `&fields=${fields}` +
      `&sortorder=${sortorder}` +
      `&size=100` +
      extra;

    if (!search) {
      url += `&sort=${sort}`;
    }
  }

  return await GET(url);
};

const fetchMedia = async (url) => {
  const response = await GET(url);
  return {
    record: response,
    thumbnailUrl: response["o:thumbnail_urls"]?.medium,
  };
};
