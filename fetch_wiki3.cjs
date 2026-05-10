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
  const urls = await fetchCategory('Lakes_of_Maryland');
  console.log(urls.slice(0, 5));
}

run();
