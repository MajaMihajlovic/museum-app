import parseOmekaApi from "../util/parser";

export const processFeed = async (results, page) => {
  let records = [];
  for (let r of results) {
    if (r != undefined)
      records.push({
        id: r["o:id"].toString(),
        name: r["dcterms:title"][0]["@value"],
        description: r["dcterms:description"][0]["@value"],
        media: r["o:media"][0] ? await fetchMedia(r["o:media"][0]["@id"]) : null,
      });
  }
  const processed = {
    page,
    records,
  };
  console.log(processed.records[0]);
  return processed;
};

export const fetchFeed = async (url = null, page = 1, extra = "") => {
  if (!url) {
    url = `https://muzej.info/api/items?page=${page}&per_page=20`;
  }

  const response = await fetch(url);
  if (response.ok) {
    const results = await response.json();
    return await processFeed(results, page);
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
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
  const url = `https://muzej.info/api/items/${id}`;
  const response = await fetch(url);
  if (response.ok) {
    const results = await response.json();
    return processRecord(results);
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
};

export const fetchCollections = async (url = null) => {
  if (!url) {
    url = `https://muzej.info/api/item_sets`;
  }

  const response = await fetch(url);
  if (response.ok) {
    const results = await response.json();
    return {
      records: results.map((r) => ({
        // ...r,
        id: r["o:id"].toString(),
        name: r["dcterms:title"][0]["@value"],
      })),
    };
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
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

  const response = await fetch(url);
  if (response.ok) {
    const results = await response.json();
    return results;
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
};

const fetchMedia = async (url) => {
  console.log(url);
  const response = await fetch(url);
  if (response.ok) {
    const result = await response.json();
    return {
      record: result,
      thumbnailUrl: result["o:thumbnail_urls"]?.medium,
    };
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
};
