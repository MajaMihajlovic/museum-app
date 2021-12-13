import parseOmekaApi from "../util/parser";
import { GET } from "./methods";

export const processFeed = async (results, page) => {
  let records = [];
  for (let r of results) {
    if (r != undefined) {
      let id = r["o:id"].toString();
      let name = r["dcterms:title"] ? r["dcterms:title"][0]["@value"] : null;
      let collectionName = r["rs:collectionName"]
        ? r["rs:collectionName"][0]["@value"]
        : null;
      let description = r["dcterms:description"]
        ? r["dcterms:description"][0]["@value"]
        : null;
      if (
        id &&
        collectionName &&
        name &&
        description &&
        !records.find((e) => e.id == id)
      )
        records.push({
          id,
          name,
          description,
          collectionName,
          media: r["o:media"][0] ? await fetchMedia(r["o:media"]) : [],
        });
    }
  }

  const processed = {
    page,
    records,
  };
  return processed;
};

export const fetchFeed = async (url = null, page = 1, search, id = null) => {
  console.log("fetchFreed:"+url+page+search+id)
  let fullUrl = url ? url : `items?page=${page}&per_page=10`;
  if (search) {
    let query = encodeURIComponent(search);
    fullUrl = id ?  `items?search=&[property]=${id}&[type]=eq&[text]=${query}` :`items?search=${query}`;
  console.log(fullUrl)
  }
  const results = await GET(fullUrl);
  return await processFeed(results, page);
};

export const processRecord = (record) => {
  const properties = parseOmekaApi(record);
  const processed = {
    ...record,
    properties,
  };
  return processed;
};

export const fetchRecord = async (id) => {
  const results = await GET(`items/${id}`);
  return processRecord(results);
};

export const loadCollectionItems = async (id) => {
  const results = await GET("items?item_set_id=" + id);
  let response = await processFeed(results, null);
  return response;
};

export const fetchCollections = async (url = null) => {
  const results = await GET(url ? url : `item_sets`);
  return {
    records: results.map((r) => {
      let description = r["dcterms:description"]
        ? r["dcterms:description"][0]["@value"]
        : null;
      return {
        id: r["o:id"].toString(),
        name: r["dcterms:title"][0]["@value"],
        description,
      };
    }),
  };
};


// TODO: fetch single and all media
const fetchMedia = async (media) => {
  let response = [];
  for (let e of media) {
    let singleMedia = await GET(e["@id"]);
    response.push({
      record: singleMedia,
      thumbnailUrl: singleMedia["o:thumbnail_urls"]?.medium,
      type: singleMedia["o:media_type"],
    });
  }
  return response;
};
