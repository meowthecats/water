import fs from 'fs';

async function fetchImage(riverName) {
  const query = `${riverName} Maryland`;
  const options = {
    headers: {
      'User-Agent': 'MarylandRiversBot/1.0 (contact@example.com)'
    }
  };
  
  let url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&piprop=original&titles=${encodeURIComponent(query)}&redirects=1`;

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const key in pages) {
        if (pages[key].original && pages[key].original.source) {
          return pages[key].original.source;
        }
      }
    }
  } catch (e) {
  }

  // fallback to commons
  const query2 = `${riverName} Dorchester County Maryland`;
  url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query2)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url`;
  
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const key in pages) {
        if (pages[key].imageinfo && pages[key].imageinfo[0]) {
          return pages[key].imageinfo[0].url;
        }
      }
    }
  } catch (e) {
  }
  
  // third fallback
  url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(riverName + " Maryland")}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url`;
  
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const key in pages) {
        if (pages[key].imageinfo && pages[key].imageinfo[0] && !pages[key].imageinfo[0].url.includes('.svg') && !pages[key].imageinfo[0].url.includes('.pdf')) {
          return pages[key].imageinfo[0].url;
        }
      }
    }
  } catch (e) {
  }
  
  return null;
}

const waterways = [
  "Transquaking River",
  "Chicamacomico River",
  "Fishing Bay",
  "Cabin Creek",
  "Warwick River",
  "Marshyhope Creek",
  "Cambridge Creek",
  "Church Creek",
  "Slaughter Creek",
  "Harrison Creek",
  "World End Creek",
  "Great Marsh Creek",
  "Hudson Creek",
  "Brooks Creek",
  "Savannah Lake",
  "Higgins Millpond"
];

async function run() {
  for (const w of waterways) {
    console.log(`Fetching image for ${w}...`);
    const imgUrl = await fetchImage(w);
    if (imgUrl) {
      console.log(`Found: ${imgUrl}`);
      try {
        const res = await fetch(imgUrl, { headers: { 'User-Agent': 'MarylandRiversBot/1.0' }});
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(`public/${w}.jpg`, Buffer.from(buffer));
        console.log(`Saved public/${w}.jpg`);
      } catch (e) {
        console.log('Failed to fetch image data for ' + w);
      }
    } else {
      console.log(`Not found: ${w}`);
    }
    // sleep
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
