const fs = require('fs');

async function fetchCategory(category) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:${encodeURIComponent(category)}&gcmnamespace=6&gcmlimit=50&prop=imageinfo&iiprop=url`;
  const res = await fetch(url);
  const data = await res.json();
  let urls = [];
  if (data.query && data.query.pages) {
    const pages = data.query.pages;
    for (const key in pages) {
      if (pages[key].imageinfo && pages[key].imageinfo[0]) {
        urls.push(pages[key].imageinfo[0].url);
      }
    }
  }
  return urls;
}

async function run() {
  const categories = [
    'Rivers_of_Maryland',
    'Rivers_of_Montgomery_County,_Maryland',
    'Rivers_of_Frederick_County,_Maryland',
    'Rivers_of_Baltimore',
    'Lakes_of_Maryland',
    'Lakes_of_Montgomery_County,_Maryland',
    'Creeks_of_Maryland'
  ];
  let allUrls = [];
  for (const cat of categories) {
    console.log('Fetching cat:', cat);
    const urls = await fetchCategory(cat);
    console.log(`Got ${urls.length} urls`);
    allUrls.push(...urls);
  }
  allUrls = allUrls.filter(u => u.toLowerCase().match(/\.(jpg|jpeg|png)$/));
  allUrls = [...new Set(allUrls)]; // unique
  console.log('Total unique:', allUrls.length);
  fs.writeFileSync('urls.json', JSON.stringify(allUrls, null, 2));
}

run();
