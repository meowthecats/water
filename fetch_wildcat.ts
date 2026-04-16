import https from 'https';
const options = {
  hostname: 'api.flickr.com',
  path: '/services/rest/?method=flickr.photos.search&api_key=c3050d39a5bb308d9921bef0e15c437d&text=Wildcat+Branch+stream+Maryland&format=json&nojsoncallback=1',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.photos && json.photos.photo.length > 0) {
        const p = json.photos.photo[0];
        console.log(`https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}_b.jpg`);
      } else {
        console.log("No photos found");
      }
    } catch (e) {
      console.log(e);
    }
  });
});
