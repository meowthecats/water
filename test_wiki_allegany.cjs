const https = require('https');
const options = {
  hostname: 'en.wikipedia.org',
  path: '/w/api.php?action=query&list=categorymembers&cmtitle=Category:Lakes_of_Allegany_County,_Maryland&cmlimit=500&format=json',
  headers: {
    'User-Agent': 'CoolBot/1.0 (https://example.com/)'
  }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
