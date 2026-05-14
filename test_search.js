import fs from 'fs';

async function test() {
  const name = "Potomac River";
  let commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&format=json`;
  let res3 = await fetch(commonsUrl, { headers: { 'User-Agent': 'MarylandApp/v2.0' } });
  let data3 = await res3.json();
  console.log(JSON.stringify(data3, null, 2));
}
test();
