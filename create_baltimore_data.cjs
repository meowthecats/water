const fs = require('fs');

const unsplash = (id, type) => {
  const types = {
    'Lake': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Frederick_City_Hall_Aerial.jpg',
    'Creek': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Seneca_Creek_State_Park_foliage_-_25_Oct_2022.jpg',
    'Stream': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Muddy_branch_and_trail_20201010_140036_1.jpg',
    'Branch': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Cabin_John_Creek_near_Rockville_MD.jpg',
    'River': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Monocacy_River.jpg',
    'Run': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Owens_Creek%2C_Catoctin_Park_%2849046790192%29.jpg',
    'Reservoir': 'https://upload.wikimedia.org/wikipedia/commons/3/32/Triadelphia_lake.jpg',
    'Springs': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454242862.jpg',
    'Harbor': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Frederick_City_Hall_Aerial.jpg',
    'Estuary': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Monocacy_River.jpg'
  };
  return types[type] || types['Stream'];
};

const baltimoreList = [
  { name: "Inner Harbor", type: "Harbor", coord: [39.2833, -76.6111], 
    desc: "A historic seaport, tourist attraction, and landmark of the city of Baltimore.", 
    hist: "Served as the chief port of the city since the 18th century, undergoing massive redevelopment in the 1970s.", 
    eco: "A heavily urbanized estuary that is the focus of the 'Healthy Harbor' initiative aiming to make it swimmable and fishable." },
  { name: "Patapsco River", type: "River", coord: [39.2132, -76.5369], 
    desc: "The main river flowing through central Maryland into the Chesapeake Bay, forming the Baltimore harbor.", 
    hist: "Explored by John Smith in 1608, it became a major corridor for industry and shipping.", 
    eco: "Tidal in the city limits, it provides habitat for migratory fish, blue crabs, and serves as a major shipping channel." },
  { name: "Gwynns Falls", type: "Stream", coord: [39.2785, -76.6611], 
    desc: "A 24.9-mile stream running through the western and southwestern parts of Baltimore City.", 
    hist: "Powered over 25 mills in the 18th and 19th centuries and is paralleled by the scenic Gwynns Falls Trail.", 
    eco: "Flows through heavily wooded stream valleys like Leakin Park, buffering urban runoff and supporting local wildlife." },
  { name: "Jones Falls", type: "Stream", coord: [39.3301, -76.6375], 
    desc: "A major stream that cuts through the center of Baltimore, historically defining the city's geography.", 
    hist: "Was the industrial spine of Baltimore, lined with textile and flour mills; now paralleled by the I-83 expressway.", 
    eco: "Features highly urbanized banks, though recent restorations near the harbor have installed water wheels (Mr. Trash Wheel) to intercept litter." },
  { name: "Herring Run", type: "Stream", coord: [39.3243, -76.5653], 
    desc: "A prominent stream flowing through northeast Baltimore City before emptying into the Back River.", 
    hist: "Historically supported large spawning runs of river herring which fed early colonists and indigenous people.", 
    eco: "Passes through Herring Run Park, providing a crucial green corridor and habitat in the eastern part of the city." },
  { name: "Lake Montebello", type: "Reservoir", coord: [39.3308, -76.5864], 
    desc: "A picturesque reservoir located in northeast Baltimore, popular for walking and cycling around its perimeter.", 
    hist: "Constructed in 1881 as a settling basin for the city's drinking water system.", 
    eco: "Maintains a protected body of water crucial for the city's municipal water supply system." },
  { name: "Druid Lake", type: "Reservoir", coord: [39.3175, -76.6358], 
    desc: "A large focal point within Druid Hill Park, historically the first major architectural lake in the US.", 
    hist: "Completed in 1871 to provide drinking water; it features one of the largest earthen dams in the country.", 
    eco: "Undergoing a major project to bury water tanks and restore the remaining surface water to a natural park lake." },
  { name: "Ashburton Reservoir", type: "Reservoir", coord: [39.3262, -76.6789], 
    desc: "A reservoir located in Hanlon Park in northwest Baltimore.", 
    hist: "Another piece of Baltimore's historic water system, designed to handle the city's expansion.", 
    eco: "Recently underwent large-scale construction to install underground storage tanks to comply with modern water safety regulations." },
  { name: "Middle Branch Patapsco River", type: "Estuary", coord: [39.2635, -76.6198], 
    desc: "A section of the Patapsco River south of the Inner Harbor, featuring rowing clubs and parks.", 
    hist: "Historically industrial, it is currently the focus of extensive waterfront revitalization efforts.", 
    eco: "Contains significant wetland restoration projects aiming to bring back native shoreline habitats." },
  { name: "Stony Run", type: "Run", coord: [39.3445, -76.6231], 
    desc: "A small stream flowing through the northern neighborhoods of Baltimore, including Roland Park and Johns Hopkins.", 
    hist: "Parallels the old Maryland and Pennsylvania Railroad (Ma & Pa) alignment.", 
    eco: "A beloved community stream with ongoing efforts to reduce erosion and improve water quality." },
  { name: "Dead Run", type: "Run", coord: [39.3032, -76.7115], 
    desc: "A tributary of Gwynns Falls passing near Franklintown and Leakin Park.", 
    hist: "Named in folklore but serves as a typical Piedmont stream that powered small local mills.", 
    eco: "It suffers from typical urban stream syndrome but benefits from the deep forested buffers of Leakin Park." },
  { name: "Moores Run", type: "Run", coord: [39.3082, -76.5367], 
    desc: "A tributary to Herring Run in eastern Baltimore.", 
    hist: "Winds through residential neighborhoods developed in the mid-20th century.", 
    eco: "Subject to community clean-ups to mitigate the impacts of urban stormwater." },
  { name: "Chinquapin Run", type: "Run", coord: [39.3621, -76.5912], 
    desc: "A stream in north Baltimore that flows into Herring Run.", 
    hist: "Named after the Chinquapin tree, a relative of the American chestnut once common in the area.", 
    eco: "The Chinquapin Run Park protects its narrow valley, offering a ribbon of green through the grid." },
  { name: "Western Run", type: "Run", coord: [39.3685, -76.6578], 
    desc: "A tributary of Jones Falls flowing through the Mt. Washington area.", 
    hist: "Historically prone to dramatic flash flooding due to its steep urbanized basin.", 
    eco: "Flows through a mix of concrete channels and natural rocky beds." },
  { name: "Curtis Creek", type: "Creek", coord: [39.2158, -76.5786], 
    desc: "A tidal tributary of the Patapsco River on the southern edge of the city.", 
    hist: "Heavily industrialized, featuring shipyards, Coast Guard yards, and rail facilities.", 
    eco: "An industrial waterway where ecological restoration faces significant legacy pollution challenges." },
  { name: "Colgate Creek", type: "Creek", coord: [39.2555, -76.5412], 
    desc: "A small tidal creek near the Dundalk Marine Terminal.", 
    hist: "Once a recreational destination before the expansion of the eastern port facilities.", 
    eco: "Now largely channelized and surrounded by port infrastructure." },
  { name: "Guilford Reservoir", type: "Reservoir", coord: [39.3411, -76.6111], 
    desc: "A covered reservoir in the Guilford neighborhood of northern Baltimore.", 
    hist: "Originally an open reservoir, covered in recent years to comply with federal clean water rules.", 
    eco: "The surface has been transformed into a community green space." }
];

const processList = (list, color1, color2) => {
  return list.map((item, idx) => {
    return {
      id: item.name.toLowerCase().replace(/ /g, '_').replace(/\./g, ''),
      type: item.type,
      name: item.name,
      description: item.desc,
      image: unsplash(idx, item.type),
      color: 'from-' + color1 + '-500/20 to-' + color2 + '-800/40',
      accent: 'text-' + color1 + '-400',
      coordinates: item.coord,
      details: {
        history: item.hist,
        ecology: item.eco
      },
      stats: {
        length: Math.floor(Math.random() * 15 + 2) + " miles"
      }
    };
  });
};

const baltStr = JSON.stringify(processList(baltimoreList, 'purple', 'fuchsia'), null, 2);

const regex = /"coordinates": \[\n\s+([0-9.-]+),\n\s+([0-9.-]+)\n\s+\]/g;
const replacement = '"coordinates": [$1, $2] as [number, number]';

const outputB = 'export const baltimoreBodiesOfWater = ' + baltStr.replace(regex, replacement) + ';\n';

fs.writeFileSync('src/baltimoreData.ts', outputB);

console.log("Files generated.");
