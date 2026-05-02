import fs from 'fs';

const detailsMap = {
  "lake_linganore": {
    "history": "The community was originally conceived in 1968 by brothers J. William and Louie Brosius. They dammed Linganore Creek to form the lake, which filled by 1972. The 210-acre lake was the centerpiece of a planned residential development consisting of several villages.",
    "ecology": "The reservoir's ecosystem is carefully managed by the community association to combat challenges like siltation and algae blooms. It supports varied fish populations including largemouth bass, channel catfish, bluegill, and black crappie, alongside native amphibians and turtles."
  },
  "cunningham_falls_lake": {
    "history": "Constructed in the 1950s by the Civilian Conservation Corps (CCC) and later expanded, it became the centerpiece of Cunningham Falls State Park. It was designed to provide recreational water access in the Catoctin Mountains where natural lakes are virtually non-existent.",
    "ecology": "Known for its clean, cool mountain water fed by Hunting Creek. The lake is regularly stocked with rainbow and golden trout, and also supports native populations of bluegill, crappie, and largemouth bass, while its surrounding forests provide habitat for black bears and wild turkeys."
  },
  "monocacy_river": {
    "history": "Serving as a vital transit and trade route for Native Americans for millennia, it became a strategic line in the Civil War. The 1864 Battle of Monocacy ('The Battle That Saved Washington') was fought along its banks, where Union forces delayed Confederate General Jubal Early's advance on the capital.",
    "ecology": "As Maryland's largest Potomac tributary, it flows through a mix of agricultural and forested lands. While it faces challenges from agricultural runoff, conservation efforts have preserved significant riparian buffers, providing critical habitat for smallmouth bass and serving as a major flyway for herons and bald eagles."
  },
  "catoctin_creek": {
    "history": "The creek valley was settled heavily in the 1700s by German and English farmers. It powered numerous historic grist mills in the Middletown Valley and was crossed by early national turnpikes. During the Civil War, both Union and Confederate troops frequently camped along its banks before the Battle of South Mountain.",
    "ecology": "Characterized by a rocky bottom, the creek transitions from cold mountain headwaters to warmer lowland flows. Its upper reaches in the Catoctin Mountains are one of the few places in the county that support naturally reproducing populations of native brook trout."
  },
  "culler_lake": {
    "history": "Originally constructed in Baker Park in the 1920s using a pre-existing agricultural pond. In the 1930s, it was improved via New Deal programs. In 1939, it was officially named after Lloyd C. Culler, a longtime, prominent mayor of Frederick who championed the creation of the surrounding park.",
    "ecology": "As a highly managed urban stormwater basin, the lake recently underwent significant dredging and ecological restoration to improve water quality. The addition of floating wetlands and riparian vegetation has enhanced its ability to filter urban runoff and support ducks, geese, and turtles."
  },
  "carroll_creek": {
    "history": "Historically a flood-prone creek running through Frederick's industrial heart, it caused catastrophic damage during a major flood in 1976. This disaster prompted the city to engineer a massive flood control project in the 1980s, placing much of the water underground and creating the beautiful surface linear park seen today.",
    "ecology": "Due to its highly engineered, urban environment, it does not support a traditional wild ecosystem. However, it incorporates heavily managed aquatic plant life—renowned for its blooming water lilies and lotus plants in the summer—that provide an aesthetic urban oasis and habitat for small fish and amphibians."
  },
  "frank_bentz_pond": {
    "history": "A man-made impoundment managed by the Maryland Department of Natural Resources, created to provide easily accessible fishing opportunities. It is named in honor of Frank Bentz, a former official with the Maryland Game and Inland Fish Commission who championed public fishing access in the state.",
    "ecology": "This small, mostly shallow pond relies heavily on artificial stocking. It provides a warm-water habitat featuring largemouth bass and bluegill, and receives regular stocking of rainbow trout in the spring and fall to support youth and recreational angling."
  },
  "potomac_river": {
    "history": "A river of immense historical significance which formed a natural boundary between the Union and Confederacy during the Civil War. Beside it runs the Chesapeake and Ohio (C&O) Canal, constructed in the 1800s to transport coal and goods, transforming towns like Point of Rocks and Brunswick into bustling trade hubs.",
    "ecology": "Its wide, rocky channels near Frederick County are renowned for producing some of the best smallmouth bass and walleye fishing in the state. It acts as a major ecological corridor connecting the Piedmont to the Chesapeake Bay, hosting massive migrations of waterfowl and spawning fish."
  },
  "owens_creek": {
    "history": "Lined with historic landmarks, including the remains of early Appalachian sawmills and the Roddy Road Covered Bridge, one of the three remaining covered bridges in Frederick County. The creek provided essential power and water for the region's earliest settlers in the 1700s.",
    "ecology": "The creek's cold, fast-moving, and highly oxygenated waters cascade over rocks and fallen timber. This pristine mountain environment is vital for sensitive aquatic species, particularly native brook trout, and serves as a drinking source for woodland mammals like deer and foxes."
  },
  "linganore_creek": {
    "history": "Named for a local Native American chief, the creek was an essential water source for early colonial settlements. In the 18th and 19th centuries, its strong flow was harnessed by numerous grist mills and sawmills, processing grain and timber from the surrounding fertile piedmont farmlands.",
    "ecology": "While heavily forested in its upper sections, it flows through significant agricultural areas, meaning its ecosystem requires protection from nutrient runoff. It is home to diverse macroinvertebrates, which form the base of the food web for seasonal trout and native panfish."
  },
  "fishing_creek": {
    "history": "Essential to the development of the region, it has served as the municipal water supply for the City of Frederick for over a century via the Fishing Creek Reservoir. The surrounding watershed in the Catoctin Mountains was protected early on to ensure the city had a pristine, reliable water source.",
    "ecology": "Rated as one of Maryland's premier catch-and-release fly fishing destinations, its densely forested canopy keeps the waters cold year-round. This allows for a robust, naturally reproducing population of wild brook and brown trout hidden within its plunge pools and rocky runs."
  },
  "double_pipe_creek": {
    "history": "Formed where Big Pipe Creek and Little Pipe Creek meet, it served as a major crossing point. In 1852, a historically significant covered bridge was erected over its waters, though it unfortunately washed away in the 1970s. It was considered a key strategic crossing during the Gettysburg campaign.",
    "ecology": "A slow-moving, meandering stream that cuts cleanly through piedmont farmland. The muddy and sandy substrate provides an ideal habitat for bottom-feeders such as carp, channel catfish, and various sunfish, eventually emptying these nutrients into the Monocacy River."
  },
  "tuscarora_creek": {
    "history": "Taking its name from the Tuscarora Native American tribe who migrated through the region in the early 1700s. The creek valley became an important agricultural corridor and the site of several historic farmsteads.",
    "ecology": "The creek exhibits classic Piedmont stream characteristics with a mix of riffles, runs, and pools. Though surrounded by increasing suburban development, preserved riparian buffers help stabilize its banks, supporting minnows, darters, and occasional smallmouth bass."
  },
  "ballenger_creek": {
    "history": "Originally a quiet agricultural stream, it became the namesake for one of Frederick's most rapidly expanding suburban corridors in the late 20th and early 21st centuries. Efforts over the past two decades have focused on mitigating the impacts of this rapid suburbanization.",
    "ecology": "Due to heavy urbanization, the creek experiences flashy flows from stormwater runoff. Restorative plantings and constructed wetland areas along the Ballenger Creek Trail aim to re-establish a natural floodplain, slowly improving the habitat for resilient fish and amphibian species."
  },
  "bennett_creek": {
    "history": "Played a role in local commerce, where small mills utilized its waters before it fed into the Monocacy River. During the Civil War, infantry from both sides passed near or across its span as armies maneuvered across the Frederick Valley.",
    "ecology": "Winding through open agricultural valleys, it gathers significant nutrient runoff, though efforts by local farmers to install vegetated buffers have improved clarity. The slow current favors warm-water species such as sunfish, chubs, and small bass."
  },
  "tom_s_creek": {
    "history": "Located in the historic northern plains near Emmitsburg, it flows close to the National Shrine of Saint Elizabeth Ann Seton and Mount St. Mary's University. It has irrigated the surrounding fertile valleys since the earliest days of Maryland's colonization.",
    "ecology": "The creek transitions from rocky mountain headwaters near the Pennsylvania line to gently sloping agricultural land. This gradient allows it to support both cold-water species in its upper tributaries and typical warm-water species in its lower, slower sections."
  },
  "israel_creek": {
    "history": "Originating north of Walkersville, it was named by early 18th-century settlers. The creek valley was highly valued for its rich, limestone-based soil, leading to the rapid establishment of prominent estates and a thriving agricultural community that helped feed the region.",
    "ecology": "Like many streams in the Monocacy basin, it is a limestone-influenced, alkaline creek. These waters tend to be highly productive, supporting dense populations of aquatic insects which in turn feed diverse communities of minnows, sunfish, and riparian bird species."
  },
  "glade_creek": {
    "history": "Closely tied to the history of Walkersville, the 'Glade Valley' was widely known in the 19th century as some of the most beautiful and productive farmland in Maryland. The creek powered small local mills essential for processing the valley's grain.",
    "ecology": "A small, low-gradient stream that meanders quietly through town parks and farm fields. Its muddy banks and marshy edges provide ideal habitat for a variety of frogs, snapping turtles, and migrating waterfowl that utilize its shallow waters."
  },
  "bush_creek": {
    "history": "Instrumental to the routing of the original Baltimore & Ohio (B&O) Railroad in the 1830s. Engineers utilized the relatively gentle grade of the Bush Creek valley to lay tracks from Mount Airy down towards Frederick and the Monocacy River, opening Western Maryland to rail trade.",
    "ecology": "The creek often flows through heavily shaded ravines and mature forests before opening up near its mouth. This provides a varied habitat that cools the water, supporting surprisingly diverse aquatic life and acting as a corridor for woodland wildlife."
  },
  "little_pipe_creek": {
    "history": "A historically important boundary and transit corridor. During the lead-up to the Battle of Gettysburg in 1863, Union General George Meade established his 'Pipe Creek Line' along this waterway as a fallback defensive position in case his army was forced to retreat.",
    "ecology": "Flowing mostly through agricultural lands, it carries sediment and nutrients downstream. Local conservation organizations actively work along its banks to plant trees and stabilize the soils, slowly improving the habitat for native bottom-dwelling fish and aquatic invertebrates."
  },
  "big_pipe_creek": {
    "history": "Along with Little Pipe Creek, it formed a natural defensive barrier utilized in Civil War military planning. It was also an industrial hub for 19th and early 20th-century commerce, boasting mills and being crossed by the historic Western Maryland Railway.",
    "ecology": "A wider, more substantial stream than its sister creek, it supports a robust warm-water fishery. The deep pools and undercut banks provide excellent cover for rock bass, redbreast sunfish, and occasional smallmouth bass avoiding the heavier currents of the Monocacy."
  }
};

let fileData = fs.readFileSync('src/frederickData.ts', 'utf8');

for (const id in detailsMap) {
  const details = detailsMap[id];
  const regex = new RegExp(`(\\"id\\"\\s*:\\s*\\"${id}\\"[\\\\s\\\\S]*?\\"details\\"\\s*:\\s*\\{\\s*\\"history\\"\\s*:\\s*\\")[^\\"]*(\\",\\s*\\"ecology\\"\\s*:\\s*\\")[^\\"]*(\\"\\s*\\})`);
  fileData = fileData.replace(regex, `$1${details.history}$2${details.ecology}$3`);
}

fs.writeFileSync('src/frederickData.ts', fileData, 'utf8');
console.log('Update complete.');
