/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, X, ArrowRight, ArrowDownAZ, ArrowUpZA, ArrowUpDown, Map as MapIcon, Image as ImageIcon, Twitter, Facebook, Link as LinkIcon, Info, Home } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { frederickBodiesOfWater } from './frederickData';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const bodiesOfWater = [
  {
    "id": "wildcat_branch",
    "type": "Stream",
    "name": "Wildcat Branch",
    "description": "A scenic stream flowing through Germantown, Maryland. It is a tributary of Great Seneca Creek and runs through the Wildcat Branch Stream Valley Park, providing a natural habitat for local wildlife.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Muddy_Branch_and_C_and_O_Canal.jpg",
    "color": "from-emerald-500/20 to-green-700/20",
    "accent": "text-emerald-400",
    "stats": {
      "location": "Germantown, MD",
      "basin": "Great Seneca",
      "type": "Tributary"
    },
    "coordinates": [39.2037, -77.2283] as [number, number],
    "details": {
      "history": "Historically served as a minor milling stream in the 1800s.",
      "ecology": "Supports a diverse benthic macroinvertebrate community, indicating good water quality."
    }
  },
  {
    "id": "river",
    "type": "Creek",
    "name": "Seneca Creek",
    "description": "A 27.4-mile-long free-flowing tributary of the Potomac River located in Montgomery County, Maryland. It flows through Seneca Creek State Park in Germantown, offering scenic views, historic mill ruins, and extensive hiking trails.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Seneca_Creek_2.jpg",
    "color": "from-emerald-500/20 to-teal-700/20",
    "accent": "text-emerald-400",
    "stats": {
      "length": "27.4 miles",
      "basin": "129 sq mi",
      "location": "Germantown, MD"
    },
    "coordinates": [39.12, -77.34] as [number, number],
    "details": {
      "history": "Home to the historic Seneca Mill built in the 1780s and Seneca Sandstone quarry.",
      "ecology": "Vital corridor for migratory birds and supports over 50 species of fish."
    }
  },
  {
    "id": "lake",
    "type": "Lake",
    "name": "Little Seneca Lake",
    "description": "A 505-acre reservoir located in Black Hill Regional Park in Germantown, Maryland. It was constructed to provide an emergency water supply for the Washington, D.C. metropolitan area and offers excellent recreational boating and fishing.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Little_Seneca_Lake_MD.jpg",
    "color": "from-blue-400/20 to-indigo-600/20",
    "accent": "text-blue-400",
    "stats": {
      "area": "505 acres",
      "depth": "68 ft",
      "location": "Germantown, MD"
    },
    "coordinates": [39.1914, -77.2911] as [number, number],
    "details": {
      "history": "Created in the 1980s by damming Little Seneca Creek as an emergency regional water supply.",
      "ecology": "Provides crucial habitat for waterfowl and submerged aquatic vegetation."
    }
  },
  {
    "id": "gunner_lake",
    "type": "Lake",
    "name": "Gunner Lake",
    "description": "A scenic man-made lake located in Germantown, Maryland. Surrounded by a paved walking trail, it is a popular local spot for jogging, fishing, and observing waterfowl and wildlife.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Gunners_Lake_Park_sign_Germantown_MD_2021-08-21_10-47-24_1.jpg",
    "color": "from-teal-400/20 to-emerald-600/20",
    "accent": "text-teal-400",
    "stats": {
      "area": "~14 acres",
      "trail": "1.5 miles",
      "location": "Germantown, MD"
    },
    "coordinates": [39.1601, -77.265] as [number, number],
    "details": {
      "history": "Constructed to manage stormwater in the developing Germantown area in the late 20th century.",
      "ecology": "Serves as an urban oasis for turtles, herons, and resident mallards."
    }
  },
  {
    "id": "great_seneca_stream",
    "type": "Stream",
    "name": "Great Seneca Stream",
    "description": "A major stream in Montgomery County, Maryland, flowing through Germantown. It forms the backbone of Seneca Creek State Park and eventually empties into the Potomac River.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Seneca_Creek_State_Park_foliage_-_25_Oct_2022.jpg",
    "color": "from-green-500/20 to-emerald-900/20",
    "accent": "text-green-400",
    "stats": {
      "location": "Germantown, MD",
      "basin": "Potomac River",
      "length": "21.4 miles"
    },
    "coordinates": [39.15, -77.3] as [number, number],
    "details": {
      "history": "Long used by early settlers for transportation and agriculture adjacent to its banks.",
      "ecology": "Functions as a primary drainage basin protecting downstream water health."
    }
  },
  {
    "id": "bucklodge_branch",
    "type": "Stream",
    "name": "Bucklodge Branch",
    "description": "A scenic tributary of Little Seneca Creek located in Germantown, Maryland. It flows through the Bucklodge Conservation Park, providing important habitat and contributing to the local watershed.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Little_Seneca_Creek_Montgomery_County_Maryland.jpg",
    "color": "from-lime-500/20 to-green-800/40",
    "accent": "text-lime-400",
    "stats": {
      "location": "Germantown, MD",
      "basin": "Little Seneca Creek",
      "type": "Tributary"
    },
    "coordinates": [39.18, -77.32] as [number, number],
    "details": {
      "history": "Named after early local hunting lodges present in the 19th century.",
      "ecology": "Features pristine shaded pools that act as a nursery for small native fish."
    }
  },
  {
    "id": "long_draught_creek",
    "type": "Creek",
    "name": "Long Draught Creek",
    "description": "A picturesque stream in Germantown, Maryland, that acts as a tributary to Great Seneca Creek. It flows prominently into Clopper Lake within Seneca Creek State Park, offering a serene environment for local wildlife and park visitors.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454242862.jpg",
    "color": "from-emerald-600/20 to-teal-900/40",
    "accent": "text-emerald-400",
    "stats": {
      "location": "Germantown, MD",
      "basin": "Great Seneca",
      "flows_into": "Clopper Lake"
    },
    "coordinates": [39.14, -77.23] as [number, number],
    "details": {
      "history": "Legend says the creek often ran dry during historic 18th-century droughts, hence the name.",
      "ecology": "Acts as a critical feeder stream to Clopper Lake, maintaining its water levels."
    }
  },
  {
    "id": "kentlands_lakes",
    "type": "Lakes",
    "name": "Kentlands Lakes",
    "description": "A series of scenic, interconnected lakes in the Kentlands neighborhood of Gaithersburg, Maryland. They provide a beautiful backdrop for walking trails, community events, and local wildlife.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/e/e4/KentlandsCauseway.jpg",
    "color": "from-cyan-500/20 to-blue-900/40",
    "accent": "text-cyan-400",
    "stats": {
      "location": "Gaithersburg, MD",
      "type": "Community Lakes",
      "features": "Walking Paths"
    },
    "coordinates": [39.123, -77.238] as [number, number],
    "details": {
      "history": "Developed in the 1990s as part of the pioneering neo-traditional Kentlands community plan.",
      "ecology": "Engineered to provide natural stormwater filtration while hosting local fish and waterfowl."
    }
  },
  {
    "id": "clopper_lake",
    "type": "Lake",
    "name": "Clopper Lake",
    "description": "A beautiful 90-acre man-made lake situated in Seneca Creek State Park in Gaithersburg, Maryland. It is surrounded by forests and trails, offering excellent opportunities for boating, fishing, and picnicking.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Clopper_Mill_ruins_Germantown_MD_2024-02-03_10-15-15.jpg",
    "color": "from-blue-500/20 to-cyan-900/40",
    "accent": "text-blue-400",
    "stats": {
      "area": "90 acres",
      "location": "Gaithersburg, MD",
      "park": "Seneca Creek State Park"
    },
    "coordinates": [39.145, -77.252] as [number, number],
    "details": {
      "history": "Built in 1975 for recreation, named after the prominent Clopper family who owned the land.",
      "ecology": "Stocked annually with trout and supports a healthy population of largemouth bass."
    }
  },
  {
    "id": "lake_churchill",
    "type": "Lake",
    "name": "Lake Churchill",
    "description": "A picturesque man-made lake located in the Churchill Village community of Germantown, Maryland. It features a paved walking path, scenic views, and is a peaceful spot for residents and wildlife.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/42/Christman_Park_pond_Gaithersburg_MD_20210508_120600_1.jpg",
    "color": "from-indigo-500/20 to-blue-900/40",
    "accent": "text-indigo-400",
    "stats": {
      "location": "Germantown, MD",
      "trail": "1.2 miles",
      "type": "Community Lake"
    },
    "coordinates": [39.185, -77.258] as [number, number],
    "details": {
      "history": "Integrated into the Churchill Village master plan in the early 1980s.",
      "ecology": "Maintains local hydrologic balance and provides resting grounds for migratory birds."
    }
  },
  {
    "id": "potomac_river",
    "type": "River",
    "name": "Potomac River",
    "description": "A major river flowing into the Chesapeake Bay, forming the border between Maryland and Virginia. It is known for its historic significance, scenic beauty like Great Falls, and diverse recreational opportunities.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Great_Falls_of_the_Potomac_River_-_NPS.jpg",
    "color": "from-blue-600/20 to-teal-900/40",
    "accent": "text-blue-400",
    "stats": {
      "length": "405 miles",
      "basin": "14,670 sq mi",
      "location": "Maryland"
    },
    "coordinates": [38.995, -77.245] as [number, number],
    "details": {
      "history": "A deeply historic waterway integral to the founding of Washington D.C. and early US trade.",
      "ecology": "A massive ecosystem supporting bald eagles, striped bass, and diverse tidal wetlands."
    }
  },
  {
    "id": "inspiration_lake",
    "type": "Lake",
    "name": "Inspiration Lake",
    "description": "A beautiful community lake situated in the Kentlands neighborhood of Gaithersburg, Maryland. It offers a serene environment with walking paths, scenic views, and is a popular spot for local residents to relax and enjoy nature.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Lake_Needwood%2C_Maryland.jpg",
    "color": "from-emerald-500/20 to-teal-900/40",
    "accent": "text-emerald-400",
    "stats": {
      "location": "Gaithersburg, MD",
      "type": "Community Lake",
      "features": "Walking Paths"
    },
    "coordinates": [39.125, -77.24] as [number, number],
    "details": {
      "history": "Designed as a central aesthetic and functional feature of the Kentlands community in 1988.",
      "ecology": "Provides a managed aquatic ecosystem that reduces urban runoff."
    }
  },
  {
    "id": "rio_washingtonian_lake",
    "type": "Lake",
    "name": "Rio Washingtonian Center Lake",
    "description": "A vibrant man-made lake located at the heart of the Rio Washingtonian Center in Gaithersburg, Maryland. It features a scenic boardwalk, paddleboats, and is surrounded by a bustling shopping and dining district.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/5/58/RIO_Washingtonian_Center_03.jpg",
    "color": "from-blue-500/20 to-cyan-800/40",
    "accent": "text-blue-400",
    "stats": {
      "location": "Gaithersburg, MD",
      "features": "Boardwalk, Paddleboats",
      "type": "Man-made Lake"
    },
    "coordinates": [39.117, -77.198] as [number, number],
    "details": {
      "history": "Excavated as part of the Washingtonian Center development to combine retail and recreation.",
      "ecology": "An urban aquatic environment that has adapted to support ornamental fish and local waterfowl."
    }
  },
  {
    "id": "lake_needwood",
    "type": "Lake",
    "name": "Lake Needwood",
    "description": "A 75-acre man-made reservoir situated in Rock Creek Regional Park near Gaithersburg/Derwood, Maryland. It is a popular destination offering a scenic natural surface trail, boating rentals, and sweeping sunset views.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Lake_needwood_from_dam_rockville_md_20200621_133125_1.jpg",
    "color": "from-teal-500/20 to-emerald-800/40",
    "accent": "text-teal-400",
    "stats": {
      "area": "75 acres",
      "location": "Derwood, MD",
      "park": "Rock Creek Regional"
    },
    "coordinates": [39.117, -77.124] as [number, number],
    "details": {
      "history": "Constructed in 1965 by damming Rock Creek to control flooding.",
      "ecology": "A lush habitat for beavers, herons, and serves as an important watershed filter."
    }
  },
  {
    "id": "north_creek_lake_park",
    "type": "Lake",
    "name": "North Creek Lake Park",
    "description": "A peaceful park setup featuring a small lake. The park offers walking paths around the water, picnic areas, and serves as an inspiring aesthetic water feature akin to local Inspiration Lake attractions.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/83/Montgomery_Village%2C_MD%2C_USA_-_panoramio.jpg",
    "color": "from-sky-500/20 to-blue-800/40",
    "accent": "text-sky-400",
    "stats": {
      "location": "Montgomery Village, MD",
      "type": "Park Lake",
      "features": "Paved Paths"
    },
    "coordinates": [39.183, -77.2025] as [number, number],
    "details": {
      "history": "Established to provide green space during the expansive development of Montgomery Village.",
      "ecology": "A calm residential wetland area supporting local amphibian and insect life."
    }
  },
  {
    "id": "lake_whetstone",
    "type": "Lake",
    "name": "Lake Whetstone",
    "description": "A scenic man-made lake serving as a central feature of Montgomery Village, Maryland. It offers boating, fishing, and a paved walking trail right in the heart of the community.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/79/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455033204.jpg",
    "color": "from-blue-500/20 to-indigo-800/40",
    "accent": "text-blue-400",
    "stats": {
      "location": "Montgomery Village, MD",
      "type": "Community Lake",
      "boating": "Yes"
    },
    "coordinates": [39.167, -77.203] as [number, number],
    "details": {
      "history": "The first lake built in Montgomery Village (1967) as a cornerstone of the planned community.",
      "ecology": "Features a balanced man-made aquatic ecosystem with shoreline vegetation."
    }
  },
  {
    "id": "lake_bernard_frank",
    "type": "Lake",
    "name": "Lake Bernard Frank",
    "description": "A serene 54-acre reservoir nestled quietly within the sprawling Rock Creek Regional Park near Derwood, Maryland. It is isolated from significant paved developments, providing a pristine habitat for hikers and naturalists.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/1/19/Lake_Bernard_Frank_view_from_Dam.jpg",
    "color": "from-emerald-500/20 to-green-900/40",
    "accent": "text-emerald-400",
    "stats": {
      "area": "54 acres",
      "location": "Derwood, MD",
      "park": "Rock Creek Regional"
    },
    "coordinates": [39.124, -77.106] as [number, number],
    "details": {
      "history": "Named after a renowned wilderness conservationist and early advocate for environmental protection.",
      "ecology": "Maintained as an undeveloped, naturalized reservoir to preserve native ecosystems."
    }
  },
  {
    "id": "lake_nirvana",
    "type": "Lake",
    "name": "Lake Nirvana",
    "description": "A quaint, quiet community lake tucked away within Gaithersburg, Maryland. Though modest in size, it serves as a peaceful water feature for the surrounding local neighborhoods.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455030829.jpg",
    "color": "from-teal-400/20 to-cyan-800/40",
    "accent": "text-teal-400",
    "stats": {
      "location": "Gaithersburg, MD",
      "type": "Pond",
      "environment": "Suburban"
    },
    "coordinates": [39.12, -77.22] as [number, number],
    "details": {
      "history": "A remnant of mid-century suburban landscape architecture favoring small neighborhood water features.",
      "ecology": "Acts as a localized catchment basin, supporting turtles and frogs."
    }
  },
  {
    "id": "maple_lake",
    "type": "Lake",
    "name": "Maple Lake",
    "description": "A historic small lake nestled inside the tranquil town of Washington Grove, Maryland. Heavily wooded and scenic, it has long been a private gem for the town's residents.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454764321.jpg",
    "color": "from-orange-500/20 to-amber-900/40",
    "accent": "text-orange-400",
    "stats": {
      "location": "Washington Grove, MD",
      "type": "Woodland Lake",
      "historic_town": "Yes"
    },
    "coordinates": [39.141, -77.17] as [number, number],
    "details": {
      "history": "Created by the residents of Washington Grove in the 1930s for community swimming and recreation.",
      "ecology": "A spring-fed lake maintaining a delicate balance of woodland aquatic flora."
    }
  },
  {
    "id": "rock_creek_regional_park",
    "type": "Park",
    "name": "Rock Creek Regional Park",
    "description": "A massive 1,800-acre park stretching across Gaithersburg, Derwood, and Rockville. It encompasses both Lake Needwood and Lake Bernard Frank, providing dense forests, an extensive trail network, and boating.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Lake_Needwood_Rock_Creek_Regional_Park_13.jpg",
    "color": "from-green-600/20 to-emerald-900/40",
    "accent": "text-green-400",
    "stats": {
      "area": "1,800 acres",
      "location": "Montgomery County, MD",
      "trails": "Extensive"
    },
    "coordinates": [39.12, -77.115] as [number, number],
    "details": {
      "history": "Established in the mid-1900s to protect the upper Rock Creek watershed from rapid suburbanization.",
      "ecology": "Preserves contiguous mature forests and critical riparian buffers."
    }
  },
  {
    "id": "triadelphia_reservoir",
    "type": "Reservoir",
    "name": "Triadelphia Lake Recreation",
    "description": "A beautiful 800-acre reservoir created by the Brighton Dam on the Patuxent River. It offers recreational boating, fishing, and scenic picnic areas just outside Gaithersburg, Maryland.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/3/32/Triadelphia_lake.jpg",
    "color": "from-blue-500/20 to-sky-800/40",
    "accent": "text-blue-400",
    "stats": {
      "area": "800 acres",
      "location": "Montgomery/Howard County",
      "recreation": "Fishing, Boating"
    },
    "coordinates": [39.191, -77.005] as [number, number],
    "details": {
      "history": "Formed in 1943 by the Brighton Dam on the Patuxent River to secure regional water supplies.",
      "ecology": "Supports deep-water fish species and acts as an overwintering site for bald eagles."
    }
  },
  {
    "id": "great_seneca_stream_valley_park",
    "type": "Park & Stream",
    "name": "Great Seneca Stream Valley Park",
    "description": "A sprawling linear park tracing the main branch of Great Seneca Creek. The park preserves vital stream habitats and features miles of natural surface trails following the flowing water.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454240472.jpg",
    "color": "from-teal-500/20 to-green-800/40",
    "accent": "text-teal-400",
    "stats": {
      "location": "Montgomery County, MD",
      "features": "Stream, Trails",
      "ecosystem": "Riparian"
    },
    "coordinates": [39.155, -77.295] as [number, number],
    "details": {
      "history": "Secured incrementally over decades to create a continuous greenway across the county.",
      "ecology": "A vital wildlife corridor allowing movement of deer, foxes, and woodland birds."
    }
  },
  {
    "id": "cabin_branch_stream_valley_park",
    "type": "Park & Stream",
    "name": "Cabin Branch Stream Valley Park",
    "description": "A dedicated conservation park built to protect the Cabin Branch tributary before it joins the larger Seneca Creek watershed. Thickly forested and secluded, it safeguards a sparkling stream.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/95/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455216490.jpg",
    "color": "from-emerald-500/20 to-lime-800/40",
    "accent": "text-emerald-400",
    "stats": {
      "location": "Clarksburg, MD",
      "tributary": "Seneca Creek",
      "type": "Valley Park"
    },
    "coordinates": [39.22, -77.28] as [number, number],
    "details": {
      "history": "Preserved as part of the Clarksburg master plan to offset dense upstream development.",
      "ecology": "Features vernal pools essential for amphibian breeding in the spring."
    }
  },
  {
    "id": "patuxent_river",
    "type": "River",
    "name": "Patuxent River",
    "description": "The longest river entirely within Maryland, passing closely to Montgomery County's borders. It serves as a vital drinking water source via its reservoirs and flows through stunning wooded landscapes.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Patuxent_River_at_Jefferson_Patterson_Park_MD1.jpg",
    "color": "from-indigo-500/20 to-blue-900/40",
    "accent": "text-indigo-400",
    "stats": {
      "length": "115 miles",
      "basin": "932 sq mi",
      "location": "Maryland"
    },
    "coordinates": [39.1915, -77.006] as [number, number],
    "details": {
      "history": "Historically navigated by Native Americans and early colonists for trade and travel.",
      "ecology": "One of the most diverse riverine ecosystems in Maryland, emptying into the Chesapeake Bay."
    }
  },
  {
    "id": "hawlings_river_stream_valley",
    "type": "Stream Valley",
    "name": "Hawlings River Stream Valley",
    "description": "A beautiful stream valley winding through Montgomery County, featuring the rocky, cascading Hawlings River. It offers lush forested banks and peaceful spots to observe the rushing water.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Little_Waterfall_on_the_Hawlings_River_%2849081090797%29.jpg",
    "color": "from-cyan-500/20 to-teal-800/40",
    "accent": "text-cyan-400",
    "stats": {
      "location": "Montgomery County, MD",
      "tributary": "Patuxent River"
    },
    "coordinates": [39.195, -77.015] as [number, number],
    "details": {
      "history": "Once powered small gristmills in the 18th and 19th centuries before the land returned to forest.",
      "ecology": "Known for high-gradient, rocky streambeds that support unique riffle-dwelling aquatic insects."
    }
  },
  {
    "id": "muddy_branch",
    "type": "Stream",
    "name": "Muddy Branch",
    "description": "A major tributary of the Potomac River that runs through Gaithersburg. Muddy Branch features diverse aquatic habitats and is flanked by an extensive stream valley park network.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/94/Muddy_branch_morris_park_gaithersburg_md_20201107_094800_1.jpg",
    "color": "from-amber-600/20 to-orange-900/40",
    "accent": "text-amber-500",
    "stats": {
      "location": "Gaithersburg, MD",
      "destination": "Potomac River",
      "type": "Tributary"
    },
    "coordinates": [39.112, -77.235] as [number, number],
    "details": {
      "history": "Its surrounding forests were extensively logged in the 1800s before modern park conservation efforts.",
      "ecology": "Now features a restoring riparian zone crucial for mitigating suburban runoff."
    }
  },
  {
    "id": "ingram_creek",
    "type": "Creek",
    "name": "Ingram Creek",
    "description": "A small, lively creek located in the Gaithersburg and Montgomery County area. It trickles through suburban neighborhoods and wooded patches, providing a vital micro-habitat for local amphibians.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455289708.jpg",
    "color": "from-emerald-400/20 to-lime-800/40",
    "accent": "text-emerald-300",
    "stats": {
      "location": "Gaithersburg, MD",
      "type": "Local Creek"
    },
    "coordinates": [39.15, -77.2] as [number, number],
    "details": {
      "history": "A localized creek named mapped during the early agricultural phase of Gaithersburg.",
      "ecology": "A small but resilient habitat for local minnow species and aquatic vegetation."
    }
  },
  {
    "id": "seneca_creek_aqueduct",
    "type": "Aqueduct",
    "name": "Seneca Creek Aqueduct",
    "description": "A historic sandstone aqueduct where the Chesapeake and Ohio Canal crosses Seneca Creek. The structure allows one body of water to flow directly over another, showcasing 19th-century engineering.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Seneca_Creek_as_seen_from_the_Seneca_Aqueduct.jpg",
    "color": "from-stone-500/20 to-blue-800/40",
    "accent": "text-stone-400",
    "stats": {
      "location": "Montgomery County, MD",
      "built": "1832",
      "type": "Navigable Aqueduct"
    },
    "coordinates": [39.068, -77.339] as [number, number],
    "details": {
      "history": "Built in 1832 of red Seneca sandstone, it is the first masonry aqueduct on the C&O Canal.",
      "ecology": "While historic, its surrounding pools offer tranquil habitats for aquatic life."
    }
  },
  {
    "id": "foxkit_creek",
    "type": "Creek",
    "name": "Foxkit Creek",
    "description": "A meandering stream in Gaithersburg, Maryland. Known to locals winding through neighborhood greenways, Foxkit Creek features gentle riffles and is surrounded by dense suburban tree canopy.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Muddy_branch_and_trail_20201010_140036_1.jpg",
    "color": "from-orange-500/20 to-red-800/40",
    "accent": "text-orange-400",
    "stats": {
      "location": "Gaithersburg, MD",
      "environment": "Neighborhood Greenway"
    },
    "coordinates": [39.145, -77.225] as [number, number],
    "details": {
      "history": "Got its local name from the fox dens occasionally spotted along its banks by early residents.",
      "ecology": "Serves as a small urban stream mitigating flash floods through its greenway."
    }
  },
  {
    "id": "monocacy_aqueduct",
    "type": "Aqueduct",
    "name": "Monocacy Aqueduct",
    "description": "The largest aqueduct on the Chesapeake and Ohio Canal, spanning the Monocacy River right near the Montgomery County border. This magnificent 19th-century stone structure channels water elegantly across the river below.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Monocacy_Aqueduct%2C_C%26O_Canal%2C_MD.jpg",
    "color": "from-slate-500/20 to-blue-800/40",
    "accent": "text-slate-400",
    "stats": {
      "location": "Dickerson, MD",
      "length": "516 feet",
      "built": "1833"
    },
    "coordinates": [39.223, -77.447] as [number, number],
    "details": {
      "history": "Completed in 1833, it survived an attempt by Confederate forces to destroy it during the Civil War.",
      "ecology": "Spans the Monocacy River, a major tributary that is vital to the region's aquatic health."
    }
  },
  {
    "id": "chevy_chase_lake",
    "type": "Historic Lake / Stream",
    "name": "Chevy Chase Lake",
    "description": "Historically a popular man-made lake and trolley destination in Chevy Chase, Maryland. While the original lake was drained, the pristine waters of Coquelin Run still flow through the valley today as a beautiful stream memory.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/2/26/Coquelin_Run.jpg",
    "color": "from-sky-400/20 to-cyan-800/40",
    "accent": "text-sky-400",
    "stats": {
      "location": "Chevy Chase, MD",
      "stream": "Coquelin Run",
      "type": "Historic Site"
    },
    "coordinates": [38.995, -77.075] as [number, number],
    "details": {
      "history": "Originally an amusement park and man-made lake built in 1892, accessed by an early streetcar line.",
      "ecology": "Today, the restored Coquelin Run valley supports urban wildlife and native plantings."
    }
  },
  {
    "id": "stone_lake",
    "type": "Quarry Lake",
    "name": "Stone Lake",
    "description": "A strikingly clear and deep lake formed within a historic rock quarry near the Montgomery County footprint. The sheer stone cliffs slope directly into vividly colored, refreshing waters.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Quarry_Lake_Maryland_July_2022.jpg",
    "color": "from-blue-600/20 to-indigo-900/40",
    "accent": "text-blue-500",
    "stats": {
      "location": "Montgomery Area, MD",
      "type": "Repurposed Quarry",
      "clarity": "High"
    },
    "coordinates": [39.13, -76.84] as [number, number],
    "details": {
      "history": "Historically a deep rock quarry that was abandoned and subsequently flooded by natural springs.",
      "ecology": "Because of its rocky basin, the water is exceptionally clear and hosts an introduced aquatic ecosystem."
    }
  },
  {
    "id": "little_falls_branch",
    "type": "Branch",
    "name": "Little Falls Branch",
    "description": "A prominent urban stream (branch) flowing directly through Bethesda and Chevy Chase, Maryland before emptying into the Potomac. Closely paralleled by the popular Capital Crescent Trail.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/93/Little_Falls_Branch%2C_Bethesda_MD_2022a.jpg",
    "color": "from-emerald-500/20 to-teal-800/40",
    "accent": "text-emerald-400",
    "stats": {
      "location": "Bethesda/Chevy Chase, MD",
      "type": "Urban Stream",
      "trail": "Capital Crescent"
    },
    "coordinates": [38.966, -77.1] as [number, number],
    "details": {
      "history": "Powered local mills and factories before Bethesda grew into a dense urban center.",
      "ecology": "Currently a focus of intense community-led stream restoration and pollution reduction."
    }
  },
  {
    "id": "capital_crescent_bench",
    "type": "Scenic Waterside Bench",
    "name": "The Trail Bench",
    "description": "A peaceful resting bench located along the waters of the Capital Crescent Trail in the Bethesda/Chevy Chase area. A perfect tranquil spot to listen to the rushing stream waters of Little Falls Branch.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/97/Little_Falls_Branch%2C_Bethesda_MD_2022b.jpg",
    "color": "from-amber-600/20 to-stone-800/40",
    "accent": "text-amber-500",
    "stats": {
      "location": "Bethesda/Chevy Chase, MD",
      "type": "Rest Area",
      "views": "Streams & Trails"
    },
    "coordinates": [38.96, -77.105] as [number, number],
    "details": {
      "history": "Located along the former Georgetown Branch rail line, which operated from 1910 to 1985.",
      "ecology": "Provides a vantage point to observe the recovering riparian ecology of the branch."
    }
  },
  {
    "id": "willett_branch",
    "type": "Branch",
    "name": "Willett Branch",
    "description": "A tributary of Little Falls Branch, Willett Branch flows through the heart of Bethesda, Maryland. It notably passes close to the Norwood Local Park and is subject to local restoration and community park efforts.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/3/3c/2019-06-12_12_57_23_View_north_along_Little_Falls_Parkway_just_north_of_Maryland_State_Route_190_%28River_Road%29_in_Somerset%2C_Montgomery_County%2C_Maryland.jpg",
    "color": "from-blue-500/20 to-teal-800/40",
    "accent": "text-blue-400",
    "stats": {
      "location": "Bethesda, MD",
      "type": "Urban Tributary",
      "flows_into": "Little Falls Branch"
    },
    "coordinates": [38.9702, -77.0917] as [number, number],
    "details": {
      "history": "Once channelized with concrete in the 1960s to control flooding in industrial Bethesda.",
      "ecology": "Now the subject of a major effort to remove the concrete and restore its natural meandering flow."
    }
  },
  {
    "id": "tilden_woods_stream_valley_park",
    "type": "Park",
    "name": "Tilden Woods Stream Valley Park",
    "description": "A beautiful stream valley park located in Rockville/Bethesda, Maryland, featuring scenic woodland trails, a gentle stream valley, and neighborhood community spaces, popular for local hiking and nature observation.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/46/Tilden_Wood_-_geograph.org.uk_-_6590571.jpg",
    "color": "from-green-500/20 to-teal-800/40",
    "accent": "text-green-400",
    "stats": {
      "location": "Rockville, MD",
      "type": "Stream Valley",
      "features": "Trails, Woodland"
    },
    "coordinates": [39.0435, -77.1444] as [number, number],
    "details": {
      "history": "Set aside during the post-WWII housing boom to preserve natural drainage for the new neighborhoods.",
      "ecology": "A classic suburban stream valley that supports deer, foxes, and diverse fungi."
    }
  },
  {
    "id": "soapstone_valley_park",
    "type": "Park",
    "name": "Soapstone Valley Park",
    "description": "A heavily wooded park in Washington, DC, that forms a tributary valley extending into Rock Creek Park. It offers rugged trails tracing the Soapstone Creek amid an urban canopy.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/5/53/SoapstoneValleyDC-November.JPG",
    "color": "from-stone-500/20 to-green-900/40",
    "accent": "text-stone-400",
    "stats": {
      "location": "Washington, DC",
      "type": "Stream Valley",
      "features": "Wooded Trails"
    },
    "coordinates": [38.948, -77.062] as [number, number],
    "details": {
      "history": "Valued by the indigenous Nacotchtank people and later preserved as part of the Rock Creek park system.",
      "ecology": "Contains old-growth trees and significant erosion-control mechanisms protecting Rock Creek."
    }
  },
  {
    "id": "watts_branch_stream_valley_park",
    "type": "Park",
    "name": "Watts Branch Stream Valley Park",
    "description": "A verdant park protecting the Watts Branch tributary located in Montgomery County. It provides expansive greenways, meandering trails, and natural stream conservation right up to the Potomac River.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Watts_Branch_Park.jpg",
    "color": "from-lime-500/20 to-green-800/40",
    "accent": "text-lime-400",
    "stats": {
      "location": "Potomac/Rockville, MD",
      "type": "Stream Valley",
      "basin": "Watts Branch"
    },
    "coordinates": [39.076, -77.193] as [number, number],
    "details": {
      "history": "Preserved by the Maryland-National Capital Park and Planning Commission starting in the 1950s.",
      "ecology": "An expansive forested buffer that heavily filters water before it enters the Potomac River."
    }
  },
  {
    "id": "little_falls_stream_valley_park",
    "type": "Park",
    "name": "Little Falls Stream Valley Park",
    "description": "A lush natural area in Bethesda, Maryland, following the course of Little Falls Branch. It runs parallel to the deeply popular Capital Crescent Trail and features cascading waters amidst quiet suburban neighborhoods.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/93/Little_Falls_Branch%2C_Bethesda_MD_2022a.jpg",
    "color": "from-cyan-500/20 to-blue-800/40",
    "accent": "text-cyan-400",
    "stats": {
      "location": "Bethesda, MD",
      "type": "Stream Valley",
      "trails": "Capital Crescent"
    },
    "coordinates": [38.966, -77.1] as [number, number],
    "details": {
      "history": "Established to protect the Little Falls watershed as the surrounding areas rapidly urbanized.",
      "ecology": "Features beautiful cascading fall line streams with oxygen-rich waters for aquatic life."
    }
  },
  {
    "id": "northwest_branch_anacostia_river",
    "type": "River",
    "name": "Northwest Branch Anacostia River",
    "description": "A major tributary of the Anacostia River, featuring a prominent scenic trail system. The river courses through picturesque, rocky gorge sections and provides extensive recreational greenway access.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/83/Anacostia_Trail_NW_Branch_crossing_2021.jpg",
    "color": "from-blue-500/20 to-indigo-800/40",
    "accent": "text-blue-400",
    "stats": {
      "location": "Montgomery County, MD",
      "type": "Tributary River",
      "basin": "Anacostia"
    },
    "coordinates": [39.02, -77.016] as [number, number],
    "details": {
      "history": "Historical mills, like the Adelphi Mill, harnessed its power in the 18th and 19th centuries.",
      "ecology": "Home to a popular gorge section where rocky terrain creates unique microhabitats."
    }
  },
  {
    "id": "sligo_creek",
    "type": "Creek",
    "name": "Sligo Creek",
    "description": "A free-flowing tributary of the Northwest Branch of the Anacostia River. The surrounding Sligo Creek Stream Valley Park offers heavily used, paved hiker-biker trails connecting communities like Silver Spring and Takoma Park.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Sligo_creek_trail_bridge_20200913_133931_1.jpg",
    "color": "from-teal-500/20 to-emerald-800/40",
    "accent": "text-teal-400",
    "stats": {
      "location": "Silver Spring, MD",
      "type": "Urban Creek",
      "trails": "Sligo Creek Trail"
    },
    "coordinates": [38.991, -77.018] as [number, number],
    "details": {
      "history": "Once hosted early waterworks for the Washington region and was among the first areas protected by M-NCPPC.",
      "ecology": "Subject of one of the longest-running and most successful urban stream restoration projects."
    }
  },
  {
    "id": "co_canal_montgomery",
    "type": "Canal",
    "name": "C&O Canal",
    "description": "The historic Chesapeake and Ohio Canal stretches along the Potomac River in Montgomery County. It features numerous historic locks, aqueducts, and the beloved unpaved towpath used heavily by cyclists and hikers.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/44/SenecaAqueduct.JPG",
    "color": "from-stone-500/20 to-amber-900/40",
    "accent": "text-stone-400",
    "stats": {
      "location": "Montgomery County, MD",
      "type": "Historic Canal",
      "features": "Towpath, Locks"
    },
    "coordinates": [39.068, -77.34] as [number, number],
    "details": {
      "history": "Operated from 1831 to 1924, transporting coal, lumber, and agricultural products down to Georgetown.",
      "ecology": "The canal bed and towpath now act as a lush, continuous wetland corridor for wildlife."
    }
  },
  {
    "id": "little_bennett_creek",
    "type": "Creek",
    "name": "Little Bennett Creek",
    "description": "A tributary of the Monocacy River flowing gently through Little Bennett Regional Park, known for beautiful forested trails and excellent local nature immersion.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Hiking_the_Whitetail_Trail_in_Little_Bennett_Regional_Park_%2827832343467%29.jpg",
    "color": "from-green-500/20 to-emerald-800/40",
    "accent": "text-green-400",
    "stats": {
      "location": "Clarksburg, MD",
      "type": "Creek",
      "features": "Woodland Trails"
    },
    "coordinates": [39.261, -77.337] as [number, number],
    "details": {
      "history": "The surrounding park holds remnants of old farming communities and historic one-room schoolhouses.",
      "ecology": "Known for excellent water quality that supports sensitive macroinvertebrates."
    }
  },
  {
    "id": "tenmile_creek",
    "type": "Creek",
    "name": "Ten Mile Creek",
    "description": "A vital reference stream serving as the main tributary to Little Seneca Lake, flowing near Clarksburg. It boasts some of the cleanest water quality in the region.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Ten_Mile_Creek_2015a.jpg",
    "color": "from-blue-500/20 to-sky-800/40",
    "accent": "text-blue-400",
    "stats": {
      "location": "Clarksburg, MD",
      "type": "Tributary Creek",
      "water_quality": "High"
    },
    "coordinates": [39.215, -77.309] as [number, number],
    "details": {
      "history": "Historically rural, it recently became the center of a major conservation victory limiting nearby development.",
      "ecology": "Considered a reference stream, possessing some of the highest quality water in the county."
    }
  },
  {
    "id": "paint_branch",
    "type": "Stream",
    "name": "Paint Branch",
    "description": "A major tributary of the Anacostia River flowing southeastwards through Montgomery County. The Paint Branch Stream Valley Park preserves its lush riparian zone for hikers.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/73/Paint_branch_montgomery_county_md_20201024_095736_1.jpg",
    "color": "from-amber-600/20 to-stone-800/40",
    "accent": "text-amber-500",
    "stats": {
      "location": "White Oak, MD",
      "type": "Stream Valley",
      "trails": "Paint Branch Trail"
    },
    "coordinates": [39.055, -76.993] as [number, number],
    "details": {
      "history": "Named for the distinctive colored clay along its banks, utilized by early inhabitants.",
      "ecology": "Famous for sustaining a naturally reproducing population of brown trout due to its cold, clean water."
    }
  },
  {
    "id": "cabin_john_creek",
    "type": "Creek",
    "name": "Cabin John Creek",
    "description": "A significant tributary of the Potomac River that runs through a deeply forested stream valley park, offering long uninterrupted walking and hiking routes through the suburban canopy.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Cabin_John_Creek_near_Rockville_MD.jpg",
    "color": "from-teal-500/20 to-green-800/40",
    "accent": "text-teal-400",
    "stats": {
      "location": "Bethesda/Potomac, MD",
      "type": "Tributary Creek",
      "trails": "Cabin John Trail"
    },
    "coordinates": [39.006, -77.147] as [number, number],
    "details": {
      "history": "Passed under the Cabin John Aqueduct (Union Arch Bridge), which was the longest single-span masonry arch globally when built.",
      "ecology": "Its forested gorge protects old-growth trees and offers refuge to migratory bird species."
    }
  },
  {
    "id": "rock_creek",
    "type": "River",
    "name": "Rock Creek",
    "description": "Perhaps the most well-known tributary stream in the region, carving its way from northern Montgomery County all the way down into the heart of Washington D.C.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Rock_Creek_Trail_1st_crossing_2021a.jpg",
    "color": "from-cyan-500/20 to-blue-800/40",
    "accent": "text-cyan-400",
    "stats": {
      "location": "Rockville/Bethesda, MD",
      "type": "Major Stream",
      "trails": "Rock Creek Trail"
    },
    "coordinates": [39.083, -77.116] as [number, number],
    "details": {
      "history": "First established as a park by Act of Congress in 1890, making it one of the oldest federal parks.",
      "ecology": "The green spine of the region, crucial for regulating temperature, air quality, and urban wildlife."
    }
  },
  {
    "id": "broad_run",
    "type": "Stream",
    "name": "Broad Run",
    "description": "A scenic tributary running through Montgomery County’s Agricultural Reserve, finally meeting the Potomac River and passing under the historic C&O Canal aqueduct.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Broad_Run_MD1.jpg",
    "color": "from-lime-500/20 to-emerald-800/40",
    "accent": "text-lime-400",
    "stats": {
      "location": "Poolesville, MD",
      "type": "Rural Stream",
      "features": "Agricultural Reserve"
    },
    "coordinates": [39.117, -77.458] as [number, number],
    "details": {
      "history": "Maintained its pristine state due to the establishment of the Montgomery County Agricultural Reserve in 1980.",
      "ecology": "Surrounded by pastoral lands, it has a healthy riparian buffer that mitigates agricultural runoff."
    }
  }
];

function LazyImage({ src, alt, layoutId, imgClassName, containerClassName, ...props }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-800 ${containerClassName || ''}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 bg-slate-800"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/20 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        {...props}
        ref={imgRef}
        {...(layoutId ? { layoutId } : {})}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName || ''}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function Gallery({ title, items }: { title: string, items: typeof bodiesOfWater }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const [viewMode, setViewMode] = useState<'photo' | 'map'>('photo');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [weatherData, setWeatherData] = useState<{
    temperature: number;
    windspeed: number;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (selectedId) {
      setViewMode('photo');
      setLastSelectedId(selectedId);
      // Small delay to ensure the modal is rendered before focusing
      setTimeout(() => closeBtnRef.current?.focus(), 100);
    } else if (lastSelectedId) {
      // Focus back to the card when modal closes
      setTimeout(() => itemsRef.current[lastSelectedId]?.focus(), 100);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, lastSelectedId]);

  const selectedItem = items.find(item => item.id === selectedId);
  const relatedItems = selectedItem 
    ? items.filter(item => item.id !== selectedItem.id && item.type === selectedItem.type).slice(0, 3) 
    : [];
  // If we don't have enough related items of the same type, pad with other random items
  if (selectedItem && relatedItems.length < 3) {
    const extraItems = items.filter(item => item.id !== selectedItem.id && !relatedItems.includes(item));
    extraItems.sort(() => 0.5 - Math.random());
    relatedItems.push(...extraItems.slice(0, 3 - relatedItems.length));
  }

  useEffect(() => {
    if (selectedItem) {
      const [lat, lon] = selectedItem.coordinates;
      setWeatherLoading(true);
      setWeatherData(null);
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`)
        .then(res => res.json())
        .then(data => {
          if (data.current_weather) {
            setWeatherData({
              temperature: data.current_weather.temperature,
              windspeed: data.current_weather.windspeed,
            });
          }
        })
        .catch(err => {
          console.error("Failed to fetch weather data", err);
        })
        .finally(() => {
          setWeatherLoading(false);
        });
    }
  }, [selectedItem?.coordinates[0], selectedItem?.coordinates[1]]);

  const sortedBodiesOfWater = [...items].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  const totalPages = Math.ceil(sortedBodiesOfWater.length / itemsPerPage);
  const paginatedBodiesOfWater = sortedBodiesOfWater.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when sort order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Background image and ambient gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LazyImage 
          src="https://upload.wikimedia.org/wikipedia/commons/3/32/Triadelphia_lake.jpg"
          alt="Ambient Background"
          containerClassName="absolute inset-0 opacity-40 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24 min-h-screen flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-20 flex flex-col items-center justify-center gap-8 text-center"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-4">
              {title || "Bodies of Water"}
            </h1>
            <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed mx-auto">
              Explore the diverse aquatic ecosystems that shape our planet, from the deepest oceans to serene glacial lakes.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSortOrder(prev => prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default')}
              aria-label="Toggle sorting order"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors text-slate-300"
            >
              {sortOrder === 'default' && <><ArrowUpDown className="w-4 h-4" /><span className="text-sm">Sort</span></>}
              {sortOrder === 'asc' && <><ArrowDownAZ className="w-4 h-4" /><span className="text-sm">A-Z</span></>}
              {sortOrder === 'desc' && <><ArrowUpZA className="w-4 h-4" /><span className="text-sm">Z-A</span></>}
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0" role="list" aria-label="Bodies of water gallery">
          {paginatedBodiesOfWater.map((item, index) => (
            <motion.div
              key={item.id}
              ref={(el) => {
                if (el) itemsRef.current[item.id] = el;
              }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${item.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedId(item.id);
                }
              }}
              layoutId={`card-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedId(item.id)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer h-[300px] md:h-[350px] lg:h-[400px] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <LazyImage
                layoutId={`image-${item.id}`}
                src={item.image}
                alt={item.name}
                containerClassName="absolute inset-0 w-full h-full"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-20 pointer-events-none" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-30">
                <motion.div layoutId={`type-${item.id}`} className={`text-xs font-bold tracking-widest uppercase mb-2 ${item.accent}`}>
                  {item.type}
                </motion.div>
                <motion.h2 layoutId={`title-${item.id}`} className="text-3xl font-serif font-medium text-white mb-2">
                  {item.name}
                </motion.h2>
                <div className="h-0 overflow-hidden transition-all duration-500 group-hover:h-6 opacity-0 group-hover:opacity-100 flex items-center text-sm text-slate-300">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Previous
            </button>
            <div className="flex gap-2 mx-4" role="navigation" aria-label="Pagination">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentPage === i + 1 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                      : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 bg-slate-950/95"
            />
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`title-${selectedItem.id}`}
            >
              <motion.div
                layoutId={`card-${selectedItem.id}`}
                className="bg-slate-900 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto max-h-[90vh]"
              >
                <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0">
                  <LazyImage
                    layoutId={`image-${selectedItem.id}`}
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    containerClassName="absolute inset-0 w-full h-full"
                    imgClassName=""
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedItem.color} pointer-events-none transition-opacity duration-500 z-20 ${viewMode === 'map' ? 'opacity-0' : 'opacity-40'}`} />
                  
                  <div className={`absolute inset-0 z-30 transition-opacity duration-500 ${viewMode === 'map' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    {viewMode === 'map' && (
                      <MapContainer center={selectedItem.coordinates} zoom={13} scrollWheelZoom={true} className="w-full h-full">
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedItem.coordinates} />
                      </MapContainer>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 z-40 flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewMode('photo'); }}
                      aria-label="View Photo"
                      className={`p-2 rounded-full transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white ${viewMode === 'photo' ? 'bg-white text-slate-900' : 'bg-slate-900/80 text-white hover:bg-slate-800'}`}
                      title="View Photo"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewMode('map'); }}
                      aria-label="View Map"
                      className={`p-2 rounded-full transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white ${viewMode === 'map' ? 'bg-white text-slate-900' : 'bg-slate-900/80 text-white hover:bg-slate-800'}`}
                      title="View Map"
                    >
                      <MapIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <motion.div layoutId={`type-${selectedItem.id}`} className={`text-sm font-bold tracking-widest uppercase mb-2 ${selectedItem.accent}`}>
                        {selectedItem.type}
                      </motion.div>
                      <motion.h2 layoutId={`title-${selectedItem.id}`} className="text-4xl md:text-5xl font-serif font-medium text-white">
                        {selectedItem.name}
                      </motion.h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 shrink-0 ml-4">
                      <div className="flex items-center gap-2 mb-2 md:mb-0 mr-0 md:mr-2">
                        <button
                          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${selectedItem.name}!`)}`, '_blank')}
                          aria-label="Share on Twitter"
                          title="Share on Twitter"
                          className="p-2 rounded-full bg-slate-800/50 hover:bg-[#1DA1F2] text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                        >
                          <Twitter className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                          aria-label="Share on Facebook"
                          title="Share on Facebook"
                          className="p-2 rounded-full bg-slate-800/50 hover:bg-[#4267B2] text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#4267B2]"
                        >
                          <Facebook className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(window.location.href)}
                          aria-label="Copy link"
                          title="Copy link"
                          className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <button 
                        ref={closeBtnRef}
                        onClick={() => setSelectedId(null)}
                        aria-label="Close details"
                        title="Close"
                        className="p-2 rounded-full bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-300 text-lg leading-relaxed mb-6"
                  >
                    {selectedItem.description}
                  </motion.p>
                  
                  {selectedItem.details && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-10 space-y-4"
                    >
                      {selectedItem.details.history && (
                        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                          <h4 className="text-sm font-semibold text-slate-200 mb-1">Historical Fact</h4>
                          <p className="text-sm text-slate-400">{selectedItem.details.history}</p>
                        </div>
                      )}
                      {selectedItem.details.ecology && (
                        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                          <h4 className="text-sm font-semibold text-slate-200 mb-1">Ecological Significance</h4>
                          <p className="text-sm text-slate-400">{selectedItem.details.ecology}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-auto grid grid-cols-2 gap-6 mb-8"
                  >
                    {Object.entries(selectedItem.stats).map(([key, value]) => (
                      <div key={key} className="border-t border-slate-800 pt-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{key}</div>
                        <div className="text-xl font-medium text-slate-200">{value}</div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="border-t border-slate-800 pt-6"
                  >
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Current Weather</div>
                    {weatherLoading ? (
                      <div className="text-slate-400">Loading...</div>
                    ) : weatherData ? (
                      <div className="flex gap-8">
                        <div>
                          <div className="text-3xl font-medium text-slate-200">{weatherData.temperature}°F</div>
                          <div className="text-sm text-slate-400">Temperature</div>
                        </div>
                        <div>
                          <div className="text-3xl font-medium text-slate-200">{weatherData.windspeed} mph</div>
                          <div className="text-sm text-slate-400">Wind</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400">Weather data unavailable</div>
                    )}
                  </motion.div>

                  {relatedItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="border-t border-slate-800 pt-6 mt-8"
                    >
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-4">Similar Waterbodies</div>
                      <div className="grid grid-cols-1 gap-4">
                        {relatedItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600 transition-all text-left group"
                          >
                            <LazyImage src={item.image} alt={item.name} containerClassName="w-16 h-16 rounded-lg shrink-0" imgClassName="rounded-lg" />
                            <div>
                              <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{item.name}</div>
                              <div className="text-xs text-slate-400 uppercase tracking-wider">{item.type}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed right-6 bottom-6 md:right-8 md:bottom-8 z-30 h-14 w-14 md:h-16 md:w-16 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-slate-900/90 flex items-center justify-center text-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 group"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9, rotate: -15 }}
        onClick={() => {
          const randomIndex = Math.floor(Math.random() * items.length);
          setSelectedId(items[randomIndex].id);
        }}
        aria-label="Surprise Me! Pick a random body of water"
      >
        <Droplets className="w-6 h-6 md:w-8 md:h-8 group-hover:text-blue-300 transition-colors" />
        
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-slate-200 text-sm rounded-lg opacity-0 min-w-max group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 font-medium">
          Surprise Me!
        </span>
      </motion.button>
    </div>
  );
}

function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-center pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-md px-2 py-2 rounded-full border border-slate-700/50 flex gap-2 pointer-events-auto shadow-lg">
        <Link
          to="/"
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
            location.pathname === '/' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Home className="w-4 h-4" />
          Montgomery
        </Link>
        <Link
          to="/frederick"
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
            location.pathname === '/frederick' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Frederick
        </Link>
        <Link
          to="/about"
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
            location.pathname === '/about' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Info className="w-4 h-4" />
          About
        </Link>
      </div>
    </nav>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30 pt-32 pb-12 px-6">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LazyImage 
          src="https://upload.wikimedia.org/wikipedia/commons/3/32/Triadelphia_lake.jpg"
          alt="Ambient Background"
          containerClassName="absolute inset-0 opacity-20 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-6">About the Waterways Gallery</h1>
          <p className="text-slate-300 leading-relaxed mb-4 text-lg">
            This application is designed to be an exploratory visual gallery and map of the beautiful streams, rivers, and lakes found within and around Maryland's Montgomery and Frederick Counties.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4 text-lg">
            Our goal is to highlight the natural beauty of the area's aquatic ecosystems, encouraging local residents and visitors to explore, appreciate, and conserve these vital natural resources.
          </p>
          <h2 className="text-2xl font-light tracking-tight text-white mt-12 mb-4">Features</h2>
          <ul className="list-disc list-inside text-slate-300 leading-relaxed space-y-2 mb-8">
            <li>Interactive Gallery view with robust sorting.</li>
            <li>Map view to visually navigate to different water bodies.</li>
            <li>Real-time weather data contextualizing the locations.</li>
            <li>Detailed information on ecology and history.</li>
          </ul>
          
          <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/20 mt-8">
            <h3 className="text-xl font-medium text-blue-400 mb-2">Conservation Note</h3>
            <p className="text-slate-300">
              Please treat all local waterways with respect. Follow the "Leave No Trace" principles, stay on marked trails, and help protect our area's delicate aquatic ecosystems.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Gallery title="Montgomery County Waterways" items={bodiesOfWater} />} />
        <Route path="/frederick" element={<Gallery title="Frederick County Waterways" items={frederickBodiesOfWater} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
