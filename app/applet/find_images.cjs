async function search(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.query && data.query.pages) {
    for (const key in data.query.pages) {
      if (data.query.pages[key].imageinfo) {
        console.log(query, data.query.pages[key].imageinfo[0].url);
      }
    }
  } else {
    console.log(query, 'No results');
  }
}
search('Gunners Lake Germantown');
search('Wildcat Branch Germantown');
search('Wildcat stream maryland');
