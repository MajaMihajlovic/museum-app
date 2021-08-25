const parseOmekaApi = (response) => {
  var properties = [];
  for (const [key, value] of Object.entries(response)) {
    if (key.startsWith("rs:")) {
      properties.push({title:value[0]["property_label"],value: value[0]["@value"]});
    }
  }
  return properties;
};
export default parseOmekaApi;
