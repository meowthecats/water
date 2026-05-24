export const dorchesterBodiesOfWater = [
  {
    id: "choptank_river",
    type: "River",
    name: "Choptank River",
    description:
      "The largest river on the Delmarva Peninsula, forming the northern boundary of Dorchester County. Known for its historical significance and vital oyster, crab, and striped bass fisheries.",
    image: "/Choptank River.jpg",
    color: "from-teal-400/20 to-blue-800/40",
    accent: "text-teal-400",
    coordinates: [38.654, -76.072] as [number, number],
    details: {
      history:
        "Played a prominent role in the Underground Railroad; Harriet Tubman was born near its banks.",
      ecology:
        "A crucial nursery for the Chesapeake Bay's striped bass population.",
    },
    stats: {
      length: "71 miles",
      basin: "1,004 sq miles",
    },
  },
  {
    id: "nanticoke_river",
    type: "River",
    name: "Nanticoke River",
    description:
      "Forming the eastern border of the county, the Nanticoke is a wildly scenic river that winds through extensive tidal wetlands and historic Native American lands.",
    image: "/Nanticoke River.jpg",
    color: "from-blue-400/20 to-indigo-800/40",
    accent: "text-blue-400",
    coordinates: [38.351, -75.922] as [number, number],
    details: {
      history:
        "Named after the historic Nanticoke Indian Tribe. Captain John Smith explored it in 1608.",
      ecology:
        "Home to the largest concentration of bald eagles in the northeastern United States.",
    },
    stats: {
      length: "64.3 miles",
    },
  },
  {
    id: "blackwater_river",
    type: "River",
    name: "Blackwater River",
    description:
      "A slow-moving, dark-water tidal river flowing through the heart of the world-renowned Blackwater National Wildlife Refuge.",
    image: "/Blackwater River.jpg",
    color: "from-emerald-400/20 to-teal-800/40",
    accent: "text-emerald-400",
    coordinates: [38.411, -76.042] as [number, number],
    details: {
      history:
        "Long used for trapping and hunting, it is now an internationally recognized wetland habitat.",
      ecology:
        "Abundant with waterfowl, osprey, egrets, and the endangered Delmarva fox squirrel.",
    },
    stats: {
      length: "10 miles",
    },
  },
  {
    id: "little_choptank_river",
    type: "River",
    name: "Little Choptank River",
    description:
      "A large, wide tidal estuary lying just south of the main Choptank River mouth. It is deeply embayed and surrounded by intricate tidal marshes.",
    image: "/Little Choptank River.jpg",
    color: "from-cyan-400/20 to-blue-800/40",
    accent: "text-cyan-400",
    coordinates: [38.514, -76.241] as [number, number],
    details: {
      history:
        "Bordered by historic manors and estates that date back to colonial tobacco farming days.",
      ecology: "Rich with oyster beds and blue crab shedding grounds.",
    },
  },
  {
    id: "honga_river",
    type: "River",
    name: "Honga River",
    description:
      "A long, wide tidal strait separating the mainland of Dorchester County from the Hooper Islands chain.",
    image: "/Honga River.jfif",
    color: "from-indigo-400/20 to-blue-800/40",
    accent: "text-indigo-400",
    coordinates: [38.283, -76.155] as [number, number],
    details: {
      history:
        "Famous for its traditional watermen communities who harvest the Chesapeake’s bounty.",
      ecology:
        "Contains extensive submerged aquatic vegetation (SAV) vital to juvenile crabs and fish.",
    },
    stats: {
      length: "14 miles",
    },
  },
  {
    id: "transquaking_river",
    type: "River",
    name: "Transquaking River",
    description:
      "A quiet, winding river that meanders through dense woodlands and sprawling marshes before emptying into Fishing Bay.",
    image: "/Transquaking River.jpg",
    color: "from-lime-400/20 to-green-800/40",
    accent: "text-lime-400",
    coordinates: [38.384, -75.981] as [number, number],
    details: {
      ecology:
        "Supports a diverse range of freshwater and brackish aquatic species.",
    },
  },
  {
    id: "chicamacomico_river",
    type: "River",
    name: "Chicamacomico River",
    description:
      "Flowing parallel to the Transquaking, this predominantly tidal river offers some of Maryland's most remote and pristine kayaking experiences.",
    image: "/Chicamacomico River.jfif",
    color: "from-emerald-400/20 to-green-800/40",
    accent: "text-emerald-400",
    coordinates: [38.371, -76.012] as [number, number],
  },
  {
    id: "fishing_bay",
    type: "Bay",
    name: "Fishing Bay",
    description:
      "A wide, shallow embayment located at the southern tip of the county, heavily utilized by crabbers and sport fishers.",
    image: "/Fishing Bay.jpg",
    color: "from-cyan-400/20 to-sky-800/40",
    accent: "text-cyan-400",
    coordinates: [38.256, -75.992] as [number, number],
    details: {
      ecology:
        "Fishing Bay Wildlife Management Area is a massive expanse of tidal marsh that borders the bay.",
    },
  },
  {
    id: "cambridge_creek",
    type: "Creek",
    name: "Cambridge Creek",
    description:
      "A bustling, historic tidal creek cutting directly into the heart of downtown Cambridge. A natural harbor for wooden skipjacks and modern boaters alike.",
    image: "/Cambridge Creek.jfif",
    color: "from-blue-400/20 to-indigo-800/40",
    accent: "text-blue-400",
    coordinates: [38.572, -76.074] as [number, number],
    details: {
      history:
        "Was once lined with massive oyster and tomato packing houses during Cambridge's industrial golden age.",
    },
  },
  {
    id: "church_creek",
    type: "Creek",
    name: "Church Creek",
    description:
      "A tidal creek extending from the Little Choptank River, sharing its name with the nearby historic town.",
    image: "/Church Creek.jfif",
    color: "from-teal-400/20 to-blue-800/40",
    accent: "text-teal-400",
    coordinates: [38.521, -76.158] as [number, number],
  },
  {
    id: "slaughter_creek",
    type: "Creek",
    name: "Slaughter Creek",
    description:
      "Connecting the Little Choptank River and the open bay, surrounded by large swaths of marshland and traditional marinas.",
    image: "/Slaughter Creek.jpg",
    color: "from-sky-400/20 to-blue-800/40",
    accent: "text-sky-400",
    coordinates: [38.483, -76.255] as [number, number],
    details: {
      history:
        "Site of historic skirmishes and steeped in local waterman lore.",
    },
  },
  {
    id: "marshyhope_creek",
    type: "Creek",
    name: "Marshyhope Creek",
    description:
      "A major tributary of the Nanticoke River. The Dorchester portion features serene, undeveloped shorelines supporting significant shad and herring spawning.",
    image: "/Marshyhope Creek.jpg",
    color: "from-green-400/20 to-emerald-800/40",
    accent: "text-green-400",
    coordinates: [38.641, -75.802] as [number, number],
  },
  {
    id: "warwick_river",
    type: "River",
    name: "Warwick River",
    description:
      "A short but significant tidal tributary of the Choptank near the town of Secretary, historically utilized for shipping lumber and produce.",
    image: "/Warwick River.jpg",
    color: "from-teal-400/20 to-green-800/40",
    accent: "text-teal-400",
    coordinates: [38.609, -75.945] as [number, number],
  },
  {
    id: "secretary_creek",
    type: "Creek",
    name: "Secretary Creek",
    description:
      "Adjacent to the historic town of Secretary, a quiet waterway leading into the Warwick River.",
    image: "/Secretary Creek.jpg",
    color: "from-indigo-400/20 to-blue-800/40",
    accent: "text-indigo-400",
    coordinates: [38.618, -75.952] as [number, number],
  },
  {
    id: "cabin_creek",
    type: "Creek",
    name: "Cabin Creek",
    description:
      "A winding tidal creek off the Choptank River, known for peaceful anchorages and wooded shorelines.",
    image: "/Cabin Creek.jpg",
    color: "from-green-400/20 to-teal-800/40",
    accent: "text-green-400",
    coordinates: [38.601, -75.922] as [number, number],
  },
  {
    id: "hudson_creek",
    type: "Creek",
    name: "Hudson Creek",
    description:
      "A creek located off the Little Choptank, notable for the scenic and secluded historical community of Hudson located at its headwaters.",
    image: "/Hudson Creek.jpg",
    color: "from-cyan-400/20 to-sky-800/40",
    accent: "text-cyan-400",
    coordinates: [38.562, -76.223] as [number, number],
  },
  {
    id: "brooks_creek",
    type: "Creek",
    name: "Brooks Creek",
    description:
      "A smaller tributary feeding into the Little Choptank River ecosystem, featuring excellent marsh habitats.",
    image: "/Brooks Creek.jpg",
    color: "from-sky-400/20 to-blue-800/40",
    accent: "text-sky-400",
    coordinates: [38.541, -76.23] as [number, number],
  },
  {
    id: "brannock_bay",
    type: "Bay",
    name: "Brannock Bay",
    description:
      "A wide, shallow embayment along the western shore of Dorchester County, facing the open Chesapeake.",
    image: "/Brannock Bay.jpg",
    color: "from-blue-400/20 to-cyan-800/40",
    accent: "text-blue-400",
    coordinates: [38.561, -76.311] as [number, number],
  },
  {
    id: "world_end_creek",
    type: "Creek",
    name: "World End Creek",
    description:
      "An aptly named remote creek located in the isolated southern marsh regions of the county.",
    image: "/World End Creek.jpg",
    color: "from-emerald-400/20 to-green-800/40",
    accent: "text-emerald-400",
    coordinates: [38.232, -76.012] as [number, number],
  },
  {
    id: "great_marsh_creek",
    type: "Creek",
    name: "Great Marsh Creek",
    description:
      "Flows through vast stretches of cordgrass marshland, offering pristine habitat for migratory birds.",
    image: "/Great Marsh Creek.jpg",
    color: "from-teal-400/20 to-emerald-800/40",
    accent: "text-teal-400",
    coordinates: [38.575, -76.082] as [number, number],
  },
  {
    id: "madison_bay",
    type: "Bay",
    name: "Madison Bay",
    description:
      "A body of water situated off the Little Choptank River, adjacent to the historical village of Madison.",
    image: "/Madison Bay.jpg",
    color: "from-blue-400/20 to-indigo-800/40",
    accent: "text-blue-400",
    coordinates: [38.511, -76.223] as [number, number],
  },
  {
    id: "savannah_lake",
    type: "Lake",
    name: "Savannah Lake",
    description:
      "One of the few named natural lakes in Dorchester, surrounded by extremely remote wetlands.",
    image: "/Savannah Lake.jpg",
    color: "from-indigo-400/20 to-blue-800/40",
    accent: "text-indigo-400",
    coordinates: [38.351, -76.091] as [number, number],
  },
  {
    id: "higgins_millpond",
    type: "Lake",
    name: "Higgins Millpond",
    description:
      "A historic millpond located near Higgins, creating a tranquil freshwater haven off the main tidal rivers.",
    image: "/Higgins Millpond.jpg",
    color: "from-emerald-400/20 to-teal-800/40",
    accent: "text-emerald-400",
    coordinates: [38.412, -75.981] as [number, number],
  },
  {
    id: "tedious_creek",
    type: "Creek",
    name: "Tedious Creek",
    description:
      "Located in the remote southern part of the county, historically a place that early mariners found 'tedious' to navigate due to shallow waters and winding channels.",
    image: "/Tedious Creek.jpg",
    color: "from-sky-400/20 to-cyan-800/40",
    accent: "text-sky-400",
    coordinates: [38.261, -76.052] as [number, number],
  },
  {
    id: "beckwith_creek",
    type: "Creek",
    name: "Beckwith Creek",
    description:
      "A peaceful branch off the Little Choptank River, favored by naturalists and local crabbers for its serene environment.",
    image: "/Beckwith Creek.jpg",
    color: "from-blue-400/20 to-cyan-800/40",
    accent: "text-blue-400",
    coordinates: [38.531, -76.192] as [number, number],
  },
  {
    id: "harrison_creek",
    type: "Creek",
    name: "Harrison Creek",
    description:
      "A tiny waterway feeding into the complex web of marshes in the Lower Shore of Dorchester.",
    image: "/Harrison Creek.jpg",
    color: "from-teal-400/20 to-green-800/40",
    accent: "text-teal-400",
    coordinates: [38.401, -76.002] as [number, number],
  },
  {
    id: "wrights_branch",
    type: "Branch",
    name: "Wrights Branch",
    description:
      "A stream that flows into the Nanticoke, known for its pristine water quality and beautiful surrounding woodlands.",
    image: "/Wrights Branch.jpg",
    color: "from-emerald-400/20 to-lime-800/40",
    accent: "text-emerald-400",
    coordinates: [38.601, -75.821] as [number, number],
  },
  {
    id: "gary_creek",
    type: "Creek",
    name: "Gary Creek",
    description:
      "A remote waterway with marsh habitats frequently visited by kayakers and nature photographers looking for blue herons.",
    image: "/Gary Creek.jpg",
    color: "from-cyan-400/20 to-sky-800/40",
    accent: "text-cyan-400",
    coordinates: [38.512, -76.281] as [number, number],
  },
  {
    id: "hurst_creek",
    type: "Creek",
    name: "Hurst Creek",
    description:
      "Extending from the Choptank, characterized by wide water views and beautiful sunsets.",
    image: "/Hurst Creek.jpg",
    color: "from-blue-400/20 to-indigo-800/40",
    accent: "text-blue-400",
    coordinates: [38.611, -76.001] as [number, number],
  },
  {
    id: "jenkins_creek",
    type: "Creek",
    name: "Jenkins Creek",
    description:
      "A secluded estuary favored for its calm, shallow waters and extensive Spartina grasses.",
    image: "/Jenkins Creek.jpg",
    color: "from-indigo-400/20 to-blue-800/40",
    accent: "text-indigo-400",
    coordinates: [38.581, -76.059] as [number, number],
  },
  {
    id: "chapel_creek",
    type: "Creek",
    name: "Chapel Creek",
    description:
      "A scenic cove providing safe harbor during storms, rich with historic local lore.",
    image: "/Chapel Creek.jpg",
    color: "from-cyan-400/20 to-blue-800/40",
    accent: "text-cyan-400",
    coordinates: [38.621, -76.042] as [number, number],
  },
  {
    id: "duns_cove",
    type: "Bay",
    name: "Duns Cove",
    description:
      "A deep and sheltered cove off the main river systems, historically a strategic anchorage for trading vessels.",
    image: "/Duns Cove.jpg",
    color: "from-blue-400/20 to-sky-800/40",
    accent: "text-blue-400",
    coordinates: [38.653, -76.321] as [number, number],
  },
  {
    id: "tar_bay",
    type: "Bay",
    name: "Tar Bay",
    description:
      "Located adjacent to Hooper's Island, the open waters of Tar Bay are known for strong afternoon breezes and exceptional crabbing.",
    image: "/Tar Bay.jpg",
    color: "from-indigo-400/20 to-blue-800/40",
    accent: "text-indigo-400",
    coordinates: [38.301, -76.211] as [number, number],
  },
  {
    id: "bloodsworth_island_strait",
    type: "Bay",
    name: "Hooper Strait",
    description:
      "The major water passage separating Hooper Island from Bloodsworth Island, providing critical navigational access through the Chesapeake.",
    image: "/Hooper Strait.jpg",
    color: "from-blue-400/20 to-cyan-800/40",
    accent: "text-blue-400",
    coordinates: [38.221, -76.101] as [number, number],
  },
  {
    id: "oyster_creek",
    type: "Creek",
    name: "Oyster Creek",
    description:
      "True to its name, this marsh-lined tidal creek has historically been a prime location for tonging Chesapeake Bay oysters.",
    image: "/Oyster Creek.jpg",
    color: "from-cyan-400/20 to-sky-800/40",
    accent: "text-cyan-400",
    coordinates: [38.561, -76.141] as [number, number],
  },
  {
    id: "st_john_creek",
    type: "Creek",
    name: "St. John Creek",
    description:
      "A lesser-known, pristine estuary that feeds out into the Little Choptank River system.",
    image: "/St. John Creek.jpg",
    color: "from-green-400/20 to-teal-800/40",
    accent: "text-green-400",
    coordinates: [38.502, -76.212] as [number, number],
  },
];
