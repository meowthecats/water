const fs = require('fs');

async function fetchCategory(category) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:${encodeURIComponent(category)}&gcmnamespace=6&gcmlimit=500&prop=imageinfo&iiprop=url`;
  const res = await fetch(url);
  const data = await res.json();
  let urls = [];
  if (data.query && data.query.pages) {
    const pages = data.query.pages;
    for (const key in pages) {
      if (pages[key].imageinfo && pages[key].imageinfo[0]) {
        let u = pages[key].imageinfo[0].url;
        // remove query string
        u = u.split('?')[0];
        urls.push(u);
      }
    }
  }
  return urls;
}

async function run() {
  const categories = [
    'Bodies_of_water_of_Maryland',
    'Lakes_of_Maryland',
    'Rivers_of_Maryland',
    'Tributaries_of_the_Potomac_River_in_Maryland',
    'Tidal_Potomac_River_in_Maryland',
    'Patapsco_River',
    'Monocacy_River',
    'Tributaries_of_the_Chesapeake_Bay_in_Maryland',
    'Water_in_Maryland'
  ];
  let allUrls = [];
  for (const cat of categories) {
    console.log('Fetching', cat);
    const urls = await fetchCategory(cat);
    allUrls.push(...urls);
  }
  
  allUrls = allUrls.filter(u => u.match(/\.(jpg|jpeg|png)$/i));
  allUrls = [...new Set(allUrls)]; // unique
  
  console.log('Total unique images:', allUrls.length);
  fs.writeFileSync('urls.json', JSON.stringify(allUrls, null, 2));
}

run();
