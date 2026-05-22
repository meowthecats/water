import fs from 'fs';

async function fetchImage(riverName) {
  const query = `${riverName} Maryland`;
  let url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&piprop=original&titles=${encodeURIComponent(query)}&redirects=1`;

  try {
    const res = await fetch(url);
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
    console.error(e);
  }

  // fallback to commons
  const query2 = `${riverName} Dorchester County Maryland`;
  url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query2)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url`;
  
  try {
    const res = await fetch(url);
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
    console.error(e);
  }
  
  // third fallback
  url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(riverName + " Maryland")}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url`;
  
  try {
    const res = await fetch(url);
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
    console.error(e);
  }
  
  return null;
}

const waterways = [
  "Choptank River",
  "Nanticoke River",
  "Blackwater River",
  "Little Choptank River",
  "Honga River",
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
  let images = {};
  for (const w of waterways) {
    console.log(`Fetching image for ${w}...`);
    const imgUrl = await fetchImage(w);
    if (imgUrl) {
      console.log(`Found: ${imgUrl}`);
      try {
        const res = await fetch(imgUrl);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(`public/${w}.jpg`, Buffer.from(buffer));
        console.log(`Saved public/${w}.jpg`);
        images[w] = imgUrl;
      } catch (e) {
        console.log('Failed to fetch image data for ' + w, e);
      }
    } else {
      console.log(`Not found: ${w}`);
    }
  }
  fs.writeFileSync('dorchester_images.json', JSON.stringify(images, null, 2));
}

run();
