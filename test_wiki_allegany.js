const https = require('https');
https.get('https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Rivers_of_Allegany_County,_Maryland&cmlimit=50&format=json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data).query.categorymembers.map(c => c.title)));
});
