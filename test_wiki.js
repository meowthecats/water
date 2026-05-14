import fs from 'fs';

async function getMarylandWaterImages() {
  const q = "Maryland river";
  let searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url`;
  let res = await fetch(searchUrl, { headers: { 'User-Agent': 'MarylandApp/2.0' } });
  let data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

getMarylandWaterImages();
