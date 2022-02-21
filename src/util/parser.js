import translations from "./translations";

const parseOmekaApi = (response) => {
  var properties = [];

  for (const [key, value] of Object.entries(response)) {
    if (key.startsWith("rs:")) {
      let label = value[0]["property_label"];
      let title = translations[label];
      properties.push({
        title,
        value: value[0]["@value"],
        id: value[0]["property_id"],
      });
    }
  }
  return properties;
};
export default parseOmekaApi;
