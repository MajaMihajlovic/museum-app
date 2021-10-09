import parseOmekaApi from "../util/parser";
import { GET } from "./methods";

export const processFeed = async (results, page) => {
  let records = [];
  for (let r of results) {
    if (r != undefined) {
      let id = r["o:id"].toString();
      let name = r["dcterms:title"][0]["@value"];
      let description = r["dcterms:description"]
        ? r["dcterms:description"][0]["@value"]
        : null;
      if (id && name && description)
        records.push({
          id,
          name,
          description,
          media: r["o:media"][0]
            ? await fetchMedia(r["o:media"][0]["@id"])
            : null,
        });
    }
  }
  const processed = {
    page,
    records,
  };
  return processed;
};

export const fetchFeed = async (url = null, page = 1, search) => {
  let fullUrl = url ? url : `items?page=${page}&per_page=20`;
  if (search) {
    console.log(search)
    let query = encodeURIComponent(search);
    fullUrl = `items?search=${query}`;
    
  }
  console.log(fullUrl)
  const results = await GET(fullUrl);
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
      id: r["o:id"].toString(),
      name: r["dcterms:title"][0]["@value"],
    })),
  };
};

const fetchMedia = async (url) => {
  const response = await GET(url);
  return {
    record: response,
    thumbnailUrl: response["o:thumbnail_urls"]?.medium,
  };
};
