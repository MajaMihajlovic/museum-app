export const processFeed = (results) => {
  const processed = {
    info: {
      next: results,
    },
    records: results.map((r) => ({
      ...r,
      id: r["o:id"].toString(),
      name: r["dcterms:title"][0]["@value"],
      description: r["dcterms:description"][0]["@value"],
    })),
  };
  return processed;
};

export const fetchFeed = async (
  url = null,
  extra = ""
) => {
  if (!url) {
    url = `https://muzej.info/api/items`;
    extra;
  }

  const response = await fetch(url);
  if (response.ok) {
    const results = await response.json();
    return processFeed(results);
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
};

export const processRecordImages = (images) =>
  images.map((image) => image.baseimageurl);
export const processRecordPeople = (people) =>
  people
    ? people.map((person) => ({
        name: person.name,
        role: person.role,
        personid: person.personid,
      }))
    : null;

export const processRecord = (results) => {
  const record = results.records[0];
  const processed = {
    ...record,
    images: record.images ? processRecordImages(record.images) : [],
    people: record.people ? processRecordPeople(record.people) : [],
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

export const fetchPersonRecords = async (personid) => {
  return fetchFeed(null, "totalpageviews", "desc", `&person=${personid}`);
};

export const fetchPerson = async (id) => {
  const url =
    `https://api.harvardartmuseums.org/person?apikey=${API_KEY}` +
    `&q=personid:${id}` +
    `&fields=${fields}`;
  const response = await fetch(url);
  if (response.ok) {
    const results = await response.json();
    return results;
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
};

export const processList = (results, target) => {
  if (target === "person" || target === "object") {
    const field = target === "person" ? "displayname" : "title";
    const id = target === "person" ? "id" : "objectnumber";
    return {
      records: results.map((r) => ({
        id: r[id],
        objectcount: r.objectcount || null,
        name: r.name,
      })),
    };
  } else {
    return results;
  }
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
      case "person":
        sort = "displayname";
        fields = "id,objectcount,displayname";
        break;
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
    return processList(results, target);
  }
  const errMessage = await response.text();
  throw new Error(errMessage);
};
