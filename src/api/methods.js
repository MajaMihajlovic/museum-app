let apiBaseUrl = "https://muzej.info/api/";

const defaultOptions = {
  credentials: "same-origin",
};

function urlEncode(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
}

export function resolveAPIUrl(path, query) {
  let qs = "";
  if (typeof query == "object" && query) qs = "?" + urlEncode(query);
  console.log(apiBaseUrl + path + qs);
  return apiBaseUrl + path + qs;
}

export async function checkOk(r) {
  if (r.status >= 400) {
    let data = null;
    try {
      data = await r.json();
    } catch (e) {
      console.log(e);
    }

    if (data)
      if (data.errorCode) {
        // Handle specific errors here
      } else if (data.error) {
        throw new Error(data.error);
      }

    let errorMsg = r.headers.get("error");
    if (errorMsg) throw new Error(errorMsg);
  }

  return r;
}

export async function doFetch(path, opt = {}, hints = {}) {
  let options = {
    method: "GET",
    ...opt,
    headers: {
      ...opt.headers,
    },
  };

  try {
    let url = path.includes("http")
      ? path
      : resolveAPIUrl(path, opt && opt.query);
    let response = await fetch(url, options);
    response = checkOk(response);
    if (hints.checkResponse) hints.checkResponse(response);
    return response;
  } catch (e) {
    if (!e.response) {
      e.message = "Check connection.";
    }
    throw e;
  }
}

export function GET(url, hints) {
  return doFetch(
    url,
    {
      ...defaultOptions,
      headers: {
        Accept: "application/json",
      },
    },
    hints
  ).then((x) => x.json());
}

export function PATCH(url, data, hints) {
  return doFetch(
    url,
    {
      ...defaultOptions,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2),
    },
    hints
  ).then((x) => x.json());
}

export function POST(url, data, hints) {
  return doFetch(
    url,
    {
      ...defaultOptions,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data, null, 2),
    },
    hints
  ).then((x) => x.json());
}

export function PUT(url, data, hints) {
  return doFetch(
    url,
    {
      ...defaultOptions,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data, null, 2),
    },
    hints
  ).then((x) => x.json());
}

export function DELETE(url, hints) {
  return doFetch(
    url,
    {
      ...defaultOptions,
      method: "DELETE",
      headers: {},
    },
    hints
  ).then((x) => x.json());
}
