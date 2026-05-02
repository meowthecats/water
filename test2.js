import https from 'https';

const searchCommons = (query) => {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&utf8=&format=json&srlimit=1`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const results = JSON.parse(data).query.search;
        if (results.length > 0) {
          const title = results[0].title;
          const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
          https.get(imageInfoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
              try {
                const pages = JSON.parse(data2).query.pages;
                const pageId = Object.keys(pages)[0];
                console.log(query, ':', pages[pageId].imageinfo[0].url);
              } catch (e) {
                console.log(query, 'Error getting info');
              }
            });
          });
        } else {
          console.log(query, ': No image found');
        }
      } catch(e) {
        console.log(query, 'Error parsing');
      }
    });
  });
};

searchCommons('Fishing Creek Maryland');
searchCommons('Bennett Creek Maryland');
searchCommons('Bush Creek Maryland');
searchCommons('Tuscarora Creek Maryland');
searchCommons('Ballenger Creek Maryland');
searchCommons('Israel Creek Maryland');
searchCommons('Glade Creek Maryland');
searchCommons('Rainbow Lake Emmitsburg');
searchCommons('Middletown Maryland Creek');
searchCommons('Point of Rocks Potomac');
searchCommons('Brunswick Maryland Potomac');
searchCommons('Thurmont Maryland creek');
searchCommons('High Run creek maryland');
searchCommons('Little Catoctin Creek');
searchCommons('Rock Creek Frederick Maryland');
searchCommons('Big Pipe Creek');
searchCommons('Middletown Springs Maryland');

