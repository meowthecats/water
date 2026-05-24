const fs = require('fs');
const https = require('https');

async function fetchWikiImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url`;
  
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'CoolBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.query && parsed.query.pages) {
            for (const key in parsed.query.pages) {
              const img = parsed.query.pages[key].imageinfo?.[0]?.url;
              if (img && img.match(/\.(jpg|jpeg|png)$/i)) {
                return resolve(img);
              }
            }
          }
        } catch(e) {}
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const rivers = [
    "North Branch Potomac River",
    "Potomac River",
    "Savage River",
    "Wills Creek Maryland",
    "Braddock Run",
    "Jennings Run",
    "Evitts Creek",
    "Town Creek Maryland",
    "Fifteenmile Creek Maryland",
    "Sideling Hill Creek",
    "Georges Creek Maryland",
    "Laurel Run Allegany",
    "Lake Habeeb",
    "Flintstone Creek",
    "Deep Run Maryland"
  ];
  const results = {};
  for (const r of rivers) {
    const url = await fetchWikiImage(r);
    results[r] = url;
    console.log(r, url);
  }
}
main();
