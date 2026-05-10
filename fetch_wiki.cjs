const fs = require('fs');

async function fetchImages() {
  const query = "Maryland river|Maryland creek|Maryland stream|Maryland lake";
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=135&prop=imageinfo&iiprop=url`;

  console.log('Fetching', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    const pages = data.query.pages;
    let urls = [];
    for (const key in pages) {
      if (pages[key].imageinfo && pages[key].imageinfo[0]) {
        urls.push(pages[key].imageinfo[0].url);
      }
    }
    
    // Filter to be images
    urls = urls.filter(u => u.toLowerCase().match(/\.(jpg|jpeg|png)$/));
    
    console.log(`Found ${urls.length} images`);
    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
    
  } catch (e) {
    console.error(e);
  }
}
fetchImages();
