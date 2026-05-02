import https from 'https';

function getWikiImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1200`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const Object = globalThis.Object; // just to be safe
        const pages = JSON.parse(data).query.pages;
        const pageId = Object.keys(pages)[0];
        console.log(title, ':', pages[pageId].thumbnail?.source || 'No image');
      } catch(e) {
        console.log(title, 'Error', e);
      }
    });
  });
}

getWikiImage("Lake Linganore");
getWikiImage("Cunningham Falls State Park");
getWikiImage("Monocacy River");
getWikiImage("Catoctin Creek (Maryland)");
getWikiImage("Baker Park (Frederick, Maryland)");
getWikiImage("Carroll Creek (Maryland)");
getWikiImage("Thurmont, Maryland");
