const https = require('https');
const fs = require('fs');

const query = `
SELECT ?item ?itemLabel ?pic ?coords WHERE {
  ?item wdt:P31/wdt:P279* wd:Q4022 . # watercourse
  ?item wdt:P131* wd:Q484252 . # located in Allegany County, MD
  OPTIONAL { ?item wdt:P18 ?pic }
  OPTIONAL { ?item wdt:P625 ?coords }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;
const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query);

const options = {
  headers: {
    'User-Agent': 'MyApp/1.0 (contact@example.com)',
    'Accept': 'application/json'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed.results.bindings, null, 2));
    } catch(e) {
      console.error("Error parsing", e, data);
    }
  });
});
