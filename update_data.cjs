const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const bodiesOfWater = \[([\s\S]*?)\];\n\nexport default function App\(\) \{/;
const match = content.match(regex);

if (match) {
  let p = match[0];
  
  // A bit hacky to eval it, but since it's TS we need to remove 'as [number, number]'
  let evalableStr = match[1].replace(/as \[number, number\]/g, '');
  let arr;
  eval(`arr = [${evalableStr}]`);

  const enhancements = {
    'wildcat_branch': { 
      history: 'Historically served as a minor milling stream in the 1800s.',
      ecology: 'Supports a diverse benthic macroinvertebrate community, indicating good water quality.'
    },
    'river': { // Seneca Creek
      history: 'Home to the historic Seneca Mill built in the 1780s and Seneca Sandstone quarry.',
      ecology: 'Vital corridor for migratory birds and supports over 50 species of fish.'
    },
    'lake': { // Little Seneca Lake
      history: 'Created in the 1980s by damming Little Seneca Creek as an emergency regional water supply.',
      ecology: 'Provides crucial habitat for waterfowl and submerged aquatic vegetation.'
    },
    'gunner_lake': {
      history: 'Constructed to manage stormwater in the developing Germantown area in the late 20th century.',
      ecology: 'Serves as an urban oasis for turtles, herons, and resident mallards.'
    },
    'great_seneca_stream': {
      history: 'Long used by early settlers for transportation and agriculture adjacent to its banks.',
      ecology: 'Functions as a primary drainage basin protecting downstream water health.'
    },
    'bucklodge_branch': {
      history: 'Named after early local hunting lodges present in the 19th century.',
      ecology: 'Features pristine shaded pools that act as a nursery for small native fish.'
    },
    'long_draught_creek': {
      history: 'Legend says the creek often ran dry during historic 18th-century droughts, hence the name.',
      ecology: 'Acts as a critical feeder stream to Clopper Lake, maintaining its water levels.'
    },
    'kentlands_lakes': {
      history: 'Developed in the 1990s as part of the pioneering neo-traditional Kentlands community plan.',
      ecology: 'Engineered to provide natural stormwater filtration while hosting local fish and waterfowl.'
    },
    'clopper_lake': {
      history: 'Built in 1975 for recreation, named after the prominent Clopper family who owned the land.',
      ecology: 'Stocked annually with trout and supports a healthy population of largemouth bass.'
    },
    'lake_churchill': {
      history: 'Integrated into the Churchill Village master plan in the early 1980s.',
      ecology: 'Maintains local hydrologic balance and provides resting grounds for migratory birds.'
    },
    'potomac_river': {
      history: 'A deeply historic waterway integral to the founding of Washington D.C. and early US trade.',
      ecology: 'A massive ecosystem supporting bald eagles, striped bass, and diverse tidal wetlands.'
    },
    'inspiration_lake': {
      history: 'Designed as a central aesthetic and functional feature of the Kentlands community in 1988.',
      ecology: 'Provides a managed aquatic ecosystem that reduces urban runoff.'
    },
    'rio_washingtonian_lake': {
      history: 'Excavated as part of the Washingtonian Center development to combine retail and recreation.',
      ecology: 'An urban aquatic environment that has adapted to support ornamental fish and local waterfowl.'
    },
    'lake_needwood': {
      history: 'Constructed in 1965 by damming Rock Creek to control flooding.',
      ecology: 'A lush habitat for beavers, herons, and serves as an important watershed filter.'
    },
    'north_creek_lake_park': {
      history: 'Established to provide green space during the expansive development of Montgomery Village.',
      ecology: 'A calm residential wetland area supporting local amphibian and insect life.'
    },
    'lake_whetstone': {
      history: 'The first lake built in Montgomery Village (1967) as a cornerstone of the planned community.',
      ecology: 'Features a balanced man-made aquatic ecosystem with shoreline vegetation.'
    },
    'lake_bernard_frank': {
      history: 'Named after a renowned wilderness conservationist and early advocate for environmental protection.',
      ecology: 'Maintained as an undeveloped, naturalized reservoir to preserve native ecosystems.'
    },
    'lake_nirvana': {
      history: 'A remnant of mid-century suburban landscape architecture favoring small neighborhood water features.',
      ecology: 'Acts as a localized catchment basin, supporting turtles and frogs.'
    },
    'maple_lake': {
      history: 'Created by the residents of Washington Grove in the 1930s for community swimming and recreation.',
      ecology: 'A spring-fed lake maintaining a delicate balance of woodland aquatic flora.'
    },
    'rock_creek_regional_park': {
      history: 'Established in the mid-1900s to protect the upper Rock Creek watershed from rapid suburbanization.',
      ecology: 'Preserves contiguous mature forests and critical riparian buffers.'
    },
    'triadelphia_reservoir': {
      history: 'Formed in 1943 by the Brighton Dam on the Patuxent River to secure regional water supplies.',
      ecology: 'Supports deep-water fish species and acts as an overwintering site for bald eagles.'
    },
    'great_seneca_stream_valley_park': {
      history: 'Secured incrementally over decades to create a continuous greenway across the county.',
      ecology: 'A vital wildlife corridor allowing movement of deer, foxes, and woodland birds.'
    },
    'cabin_branch_stream_valley_park': {
      history: 'Preserved as part of the Clarksburg master plan to offset dense upstream development.',
      ecology: 'Features vernal pools essential for amphibian breeding in the spring.'
    },
    'patuxent_river': {
      history: 'Historically navigated by Native Americans and early colonists for trade and travel.',
      ecology: 'One of the most diverse riverine ecosystems in Maryland, emptying into the Chesapeake Bay.'
    },
    'hawlings_river_stream_valley': {
      history: 'Once powered small gristmills in the 18th and 19th centuries before the land returned to forest.',
      ecology: 'Known for high-gradient, rocky streambeds that support unique riffle-dwelling aquatic insects.'
    },
    'muddy_branch': {
      history: 'Its surrounding forests were extensively logged in the 1800s before modern park conservation efforts.',
      ecology: 'Now features a restoring riparian zone crucial for mitigating suburban runoff.'
    },
    'ingram_creek': {
      history: 'A localized creek named mapped during the early agricultural phase of Gaithersburg.',
      ecology: 'A small but resilient habitat for local minnow species and aquatic vegetation.'
    },
    'seneca_creek_aqueduct': {
      history: 'Built in 1832 of red Seneca sandstone, it is the first masonry aqueduct on the C&O Canal.',
      ecology: 'While historic, its surrounding pools offer tranquil habitats for aquatic life.'
    },
    'foxkit_creek': {
      history: 'Got its local name from the fox dens occasionally spotted along its banks by early residents.',
      ecology: 'Serves as a small urban stream mitigating flash floods through its greenway.'
    },
    'monocacy_aqueduct': {
      history: 'Completed in 1833, it survived an attempt by Confederate forces to destroy it during the Civil War.',
      ecology: 'Spans the Monocacy River, a major tributary that is vital to the region\'s aquatic health.'
    },
    'chevy_chase_lake': {
      history: 'Originally an amusement park and man-made lake built in 1892, accessed by an early streetcar line.',
      ecology: 'Today, the restored Coquelin Run valley supports urban wildlife and native plantings.'
    },
    'stone_lake': {
      history: 'Historically a deep rock quarry that was abandoned and subsequently flooded by natural springs.',
      ecology: 'Because of its rocky basin, the water is exceptionally clear and hosts an introduced aquatic ecosystem.'
    },
    'little_falls_branch': {
      history: 'Powered local mills and factories before Bethesda grew into a dense urban center.',
      ecology: 'Currently a focus of intense community-led stream restoration and pollution reduction.'
    },
    'capital_crescent_bench': {
      history: 'Located along the former Georgetown Branch rail line, which operated from 1910 to 1985.',
      ecology: 'Provides a vantage point to observe the recovering riparian ecology of the branch.'
    },
    'willett_branch': {
      history: 'Once channelized with concrete in the 1960s to control flooding in industrial Bethesda.',
      ecology: 'Now the subject of a major effort to remove the concrete and restore its natural meandering flow.'
    },
    'tilden_woods_stream_valley_park': {
      history: 'Set aside during the post-WWII housing boom to preserve natural drainage for the new neighborhoods.',
      ecology: 'A classic suburban stream valley that supports deer, foxes, and diverse fungi.'
    },
    'soapstone_valley_park': {
      history: 'Valued by the indigenous Nacotchtank people and later preserved as part of the Rock Creek park system.',
      ecology: 'Contains old-growth trees and significant erosion-control mechanisms protecting Rock Creek.'
    },
    'watts_branch_stream_valley_park': {
      history: 'Preserved by the Maryland-National Capital Park and Planning Commission starting in the 1950s.',
      ecology: 'An expansive forested buffer that heavily filters water before it enters the Potomac River.'
    },
    'little_falls_stream_valley_park': {
      history: 'Established to protect the Little Falls watershed as the surrounding areas rapidly urbanized.',
      ecology: 'Features beautiful cascading fall line streams with oxygen-rich waters for aquatic life.'
    },
    'northwest_branch_anacostia_river': {
      history: 'Historical mills, like the Adelphi Mill, harnessed its power in the 18th and 19th centuries.',
      ecology: 'Home to a popular gorge section where rocky terrain creates unique microhabitats.'
    },
    'sligo_creek': {
      history: 'Once hosted early waterworks for the Washington region and was among the first areas protected by M-NCPPC.',
      ecology: 'Subject of one of the longest-running and most successful urban stream restoration projects.'
    },
    'co_canal_montgomery': {
      history: 'Operated from 1831 to 1924, transporting coal, lumber, and agricultural products down to Georgetown.',
      ecology: 'The canal bed and towpath now act as a lush, continuous wetland corridor for wildlife.'
    },
    'little_bennett_creek': {
      history: 'The surrounding park holds remnants of old farming communities and historic one-room schoolhouses.',
      ecology: 'Known for excellent water quality that supports sensitive macroinvertebrates.'
    },
    'tenmile_creek': {
      history: 'Historically rural, it recently became the center of a major conservation victory limiting nearby development.',
      ecology: 'Considered a reference stream, possessing some of the highest quality water in the county.'
    },
    'paint_branch': {
      history: 'Named for the distinctive colored clay along its banks, utilized by early inhabitants.',
      ecology: 'Famous for sustaining a naturally reproducing population of brown trout due to its cold, clean water.'
    },
    'cabin_john_creek': {
      history: 'Passed under the Cabin John Aqueduct (Union Arch Bridge), which was the longest single-span masonry arch globally when built.',
      ecology: 'Its forested gorge protects old-growth trees and offers refuge to migratory bird species.'
    },
    'rock_creek': {
      history: 'First established as a park by Act of Congress in 1890, making it one of the oldest federal parks.',
      ecology: 'The green spine of the region, crucial for regulating temperature, air quality, and urban wildlife.'
    },
    'broad_run': {
      history: 'Maintained its pristine state due to the establishment of the Montgomery County Agricultural Reserve in 1980.',
      ecology: 'Surrounded by pastoral lands, it has a healthy riparian buffer that mitigates agricultural runoff.'
    }
  };

  arr = arr.map(item => {
    const adds = enhancements[item.id] || { history: 'A notable historic body of water in the region.', ecology: 'Supports a variety of local flora and fauna.' };
    return {
      ...item,
      details: adds
    }
  });

  let newStr = JSON.stringify(arr, null, 2);
  
  // Re-add " as [number, number]" to the coordinates
  newStr = newStr.replace(/"coordinates": \[\n\s+([0-9.-]+),\n\s+([0-9.-]+)\n\s+\]/g, '"coordinates": [$1, $2] as [number, number]');

  let finalContent = content.replace(match[0], `const bodiesOfWater = ${newStr};\n\nexport default function App() {`);
  
  fs.writeFileSync('src/App.tsx', finalContent);
  console.log('Successfully updated bodiesOfWater with details');
} else {
  console.log('Could not match bodiesOfWater array');
}
