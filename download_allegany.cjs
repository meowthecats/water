const fs = require('fs');
const https = require('https');

const urls = {
  "North Branch Potomac River": "https://upload.wikimedia.org/wikipedia/commons/b/bf/North_Fork_South_Branch_Potomac_River.jpg",
  "Potomac River": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Potomac_River_South_Branch_Depot_WV_2007_05_07_03.jpg",
  "Savage River": "https://upload.wikimedia.org/wikipedia/commons/7/71/Savage_River_%28Maryland%29_from_Allegany_Bridge.jpg",
  "Wills Creek": "https://upload.wikimedia.org/wikipedia/commons/3/38/Wills_Creek_Cumberland.jpg",
  "Evitts Creek": "https://upload.wikimedia.org/wikipedia/commons/3/3b/2016-06-25_08_01_58_View_north_along_Maryland_State_Route_639_%28Messick_Road%29_just_north_of_Maryland_State_Route_51_%28Industrial_Boulevard%29_in_Evitts_Creek%2C_Allegany_County%2C_Maryland.jpg",
  "Town Creek": "https://upload.wikimedia.org/wikipedia/commons/2/27/C%26O_Canal_-_Town_Creek_Aqueduct.jpg",
  "Fifteenmile Creek": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Allegany_County_%281900%29_%2814775100734%29.jpg",
  "Sideling Hill Creek": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Sideling_Hill_Creek_tributary_in_SGL_49.jpg"
};

for (const [name, url] of Object.entries(urls)) {
  const dest = '/app/applet/public/' + name + '.jpg';
  const file = fs.createWriteStream(dest);
  https.get(url, { headers: { 'User-Agent': 'CoolBot/1.0' } }, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded ' + name);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error('Error downloading ' + name + ':', err);
  });
}
