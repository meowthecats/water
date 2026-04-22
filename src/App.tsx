/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, X, ArrowRight, ArrowDownAZ, ArrowUpZA, ArrowUpDown, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
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
    id: 'wildcat_branch',
    type: 'Stream',
    name: 'Wildcat Branch',
    description: 'A scenic stream flowing through Germantown, Maryland. It is a tributary of Great Seneca Creek and runs through the Wildcat Branch Stream Valley Park, providing a natural habitat for local wildlife.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Muddy_Branch_and_C_and_O_Canal.jpg',
    fallbackImage: 'https://picsum.photos/seed/wildcatbranch/1200/800',
    color: 'from-emerald-500/20 to-green-700/20',
    accent: 'text-emerald-400',
    stats: { location: 'Germantown, MD', basin: 'Great Seneca', type: 'Tributary' },
    coordinates: [39.2037, -77.2283] as [number, number]
  },
  {
    id: 'river',
    type: 'Creek',
    name: 'Seneca Creek',
    description: 'A 27.4-mile-long free-flowing tributary of the Potomac River located in Montgomery County, Maryland. It flows through Seneca Creek State Park in Germantown, offering scenic views, historic mill ruins, and extensive hiking trails.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Seneca_Creek_2.jpg',
    fallbackImage: 'https://picsum.photos/seed/senecacreek/1200/800',
    color: 'from-emerald-500/20 to-teal-700/20',
    accent: 'text-emerald-400',
    stats: { length: '27.4 miles', basin: '129 sq mi', location: 'Germantown, MD' },
    coordinates: [39.1200, -77.3400] as [number, number]
  },
  {
    id: 'lake',
    type: 'Lake',
    name: 'Little Seneca Lake',
    description: 'A 505-acre reservoir located in Black Hill Regional Park in Germantown, Maryland. It was constructed to provide an emergency water supply for the Washington, D.C. metropolitan area and offers excellent recreational boating and fishing.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Little_Seneca_Lake_MD.jpg',
    fallbackImage: 'https://picsum.photos/seed/littlesenecalake/1200/800',
    color: 'from-blue-400/20 to-indigo-600/20',
    accent: 'text-blue-400',
    stats: { area: '505 acres', depth: '68 ft', location: 'Germantown, MD' },
    coordinates: [39.1914, -77.2911] as [number, number]
  },
  {
    id: 'gunner_lake',
    type: 'Lake',
    name: 'Gunner Lake',
    description: 'A scenic man-made lake located in Germantown, Maryland. Surrounded by a paved walking trail, it is a popular local spot for jogging, fishing, and observing waterfowl and wildlife.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Gunners_Lake_Park_sign_Germantown_MD_2021-08-21_10-47-24_1.jpg',
    fallbackImage: 'https://picsum.photos/seed/gunnerlake/1200/800',
    color: 'from-teal-400/20 to-emerald-600/20',
    accent: 'text-teal-400',
    stats: { area: '~14 acres', trail: '1.5 miles', location: 'Germantown, MD' },
    coordinates: [39.1601, -77.2650] as [number, number]
  },
  {
    id: 'great_seneca_stream',
    type: 'Stream',
    name: 'Great Seneca Stream',
    description: 'A major stream in Montgomery County, Maryland, flowing through Germantown. It forms the backbone of Seneca Creek State Park and eventually empties into the Potomac River.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Seneca_Creek_State_Park_foliage_-_25_Oct_2022.jpg',
    fallbackImage: 'https://picsum.photos/seed/greatseneca/1200/800',
    color: 'from-green-500/20 to-emerald-900/20',
    accent: 'text-green-400',
    stats: { location: 'Germantown, MD', basin: 'Potomac River', length: '21.4 miles' },
    coordinates: [39.1500, -77.3000] as [number, number]
  },
  {
    id: 'bucklodge_branch',
    type: 'Stream',
    name: 'Bucklodge Branch',
    description: 'A scenic tributary of Little Seneca Creek located in Germantown, Maryland. It flows through the Bucklodge Conservation Park, providing important habitat and contributing to the local watershed.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Little_Seneca_Creek_Montgomery_County_Maryland.jpg',
    fallbackImage: 'https://picsum.photos/seed/bucklodgebranch/1200/800',
    color: 'from-lime-500/20 to-green-800/40',
    accent: 'text-lime-400',
    stats: { location: 'Germantown, MD', basin: 'Little Seneca Creek', type: 'Tributary' },
    coordinates: [39.1800, -77.3200] as [number, number]
  },
  {
    id: 'long_draught_creek',
    type: 'Creek',
    name: 'Long Draught Creek',
    description: 'A picturesque stream in Germantown, Maryland, that acts as a tributary to Great Seneca Creek. It flows prominently into Clopper Lake within Seneca Creek State Park, offering a serene environment for local wildlife and park visitors.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454242862.jpg',
    fallbackImage: 'https://picsum.photos/seed/longdraughtcreek/1200/800',
    color: 'from-emerald-600/20 to-teal-900/40',
    accent: 'text-emerald-400',
    stats: { location: 'Germantown, MD', basin: 'Great Seneca', flows_into: 'Clopper Lake' },
    coordinates: [39.1400, -77.2300] as [number, number]
  },
  {
    id: 'kentlands_lakes',
    type: 'Lakes',
    name: 'Kentlands Lakes',
    description: 'A series of scenic, interconnected lakes in the Kentlands neighborhood of Gaithersburg, Maryland. They provide a beautiful backdrop for walking trails, community events, and local wildlife.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Seneca_creek_montgomery_county.jpg',
    fallbackImage: 'https://picsum.photos/seed/kentlandslakes/1200/800',
    color: 'from-cyan-500/20 to-blue-900/40',
    accent: 'text-cyan-400',
    stats: { location: 'Gaithersburg, MD', type: 'Community Lakes', features: 'Walking Paths' },
    coordinates: [39.1230, -77.2380] as [number, number]
  },
  {
    id: 'clopper_lake',
    type: 'Lake',
    name: 'Clopper Lake',
    description: 'A beautiful 90-acre man-made lake situated in Seneca Creek State Park in Gaithersburg, Maryland. It is surrounded by forests and trails, offering excellent opportunities for boating, fishing, and picnicking.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Seneca_creek_montgomery_county.jpg',
    fallbackImage: 'https://picsum.photos/seed/clopperlake/1200/800',
    color: 'from-blue-500/20 to-cyan-900/40',
    accent: 'text-blue-400',
    stats: { area: '90 acres', location: 'Gaithersburg, MD', park: 'Seneca Creek State Park' },
    coordinates: [39.1450, -77.2520] as [number, number]
  },
  {
    id: 'lake_churchill',
    type: 'Lake',
    name: 'Lake Churchill',
    description: 'A picturesque man-made lake located in the Churchill Village community of Germantown, Maryland. It features a paved walking path, scenic views, and is a peaceful spot for residents and wildlife.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Christman_Park_pond_Gaithersburg_MD_20210508_120600_1.jpg',
    fallbackImage: 'https://picsum.photos/seed/lakechurchill/1200/800',
    color: 'from-indigo-500/20 to-blue-900/40',
    accent: 'text-indigo-400',
    stats: { location: 'Germantown, MD', trail: '1.2 miles', type: 'Community Lake' },
    coordinates: [39.1850, -77.2580] as [number, number]
  },
  {
    id: 'potomac_river',
    type: 'River',
    name: 'Potomac River',
    description: 'A major river flowing into the Chesapeake Bay, forming the border between Maryland and Virginia. It is known for its historic significance, scenic beauty like Great Falls, and diverse recreational opportunities.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Great_Falls_of_the_Potomac_River_-_NPS.jpg',
    fallbackImage: 'https://picsum.photos/seed/potomacriver/1200/800',
    color: 'from-blue-600/20 to-teal-900/40',
    accent: 'text-blue-400',
    stats: { length: '405 miles', basin: '14,670 sq mi', location: 'Maryland' },
    coordinates: [38.9950, -77.2450] as [number, number]
  },
  {
    id: 'inspiration_lake',
    type: 'Lake',
    name: 'Inspiration Lake',
    description: 'A beautiful community lake situated in the Kentlands neighborhood of Gaithersburg, Maryland. It offers a serene environment with walking paths, scenic views, and is a popular spot for local residents to relax and enjoy nature.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Lake_Needwood%2C_Maryland.jpg',
    fallbackImage: 'https://picsum.photos/seed/inspirationlake/1200/800',
    color: 'from-emerald-500/20 to-teal-900/40',
    accent: 'text-emerald-400',
    stats: { location: 'Gaithersburg, MD', type: 'Community Lake', features: 'Walking Paths' },
    coordinates: [39.1250, -77.2400] as [number, number]
  },
  {
    id: 'rio_washingtonian_lake',
    type: 'Lake',
    name: 'Rio Washingtonian Center Lake',
    description: 'A vibrant man-made lake located at the heart of the Rio Washingtonian Center in Gaithersburg, Maryland. It features a scenic boardwalk, paddleboats, and is surrounded by a bustling shopping and dining district.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/RIO_Washingtonian_Center_03.jpg',
    fallbackImage: 'https://picsum.photos/seed/riowashingtonian/1200/800',
    color: 'from-blue-500/20 to-cyan-800/40',
    accent: 'text-blue-400',
    stats: { location: 'Gaithersburg, MD', features: 'Boardwalk, Paddleboats', type: 'Man-made Lake' },
    coordinates: [39.1170, -77.1980] as [number, number]
  },
  {
    id: 'lake_needwood',
    type: 'Lake',
    name: 'Lake Needwood',
    description: 'A 75-acre man-made reservoir situated in Rock Creek Regional Park near Gaithersburg/Derwood, Maryland. It is a popular destination offering a scenic natural surface trail, boating rentals, and sweeping sunset views.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Lake_needwood_from_dam_rockville_md_20200621_133125_1.jpg',
    fallbackImage: 'https://picsum.photos/seed/lakeneedwood/1200/800',
    color: 'from-teal-500/20 to-emerald-800/40',
    accent: 'text-teal-400',
    stats: { area: '75 acres', location: 'Derwood, MD', park: 'Rock Creek Regional' },
    coordinates: [39.1170, -77.1240] as [number, number]
  },
  {
    id: 'north_creek_lake_park',
    type: 'Lake',
    name: 'North Creek Lake Park',
    description: 'A peaceful park setup featuring a small lake. The park offers walking paths around the water, picnic areas, and serves as an inspiring aesthetic water feature akin to local Inspiration Lake attractions.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Seneca_Creek_State_Park_foliage_-_25_Oct_2022.jpg',
    fallbackImage: 'https://picsum.photos/seed/northcreeklake/1200/800',
    color: 'from-sky-500/20 to-blue-800/40',
    accent: 'text-sky-400',
    stats: { location: 'Montgomery Village, MD', type: 'Park Lake', features: 'Paved Paths' },
    coordinates: [39.1830, -77.2025] as [number, number]
  },
  {
    id: 'lake_whetstone',
    type: 'Lake',
    name: 'Lake Whetstone',
    description: 'A scenic man-made lake serving as a central feature of Montgomery Village, Maryland. It offers boating, fishing, and a paved walking trail right in the heart of the community.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455033204.jpg',
    fallbackImage: 'https://picsum.photos/seed/lakewhetstone/1200/800',
    color: 'from-blue-500/20 to-indigo-800/40',
    accent: 'text-blue-400',
    stats: { location: 'Montgomery Village, MD', type: 'Community Lake', boating: 'Yes' },
    coordinates: [39.1670, -77.2030] as [number, number]
  },
  {
    id: 'lake_bernard_frank',
    type: 'Lake',
    name: 'Lake Bernard Frank',
    description: 'A serene 54-acre reservoir nestled quietly within the sprawling Rock Creek Regional Park near Derwood, Maryland. It is isolated from significant paved developments, providing a pristine habitat for hikers and naturalists.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Lake_Bernard_Frank_view_from_Dam.jpg',
    fallbackImage: 'https://picsum.photos/seed/lakebernardfrank/1200/800',
    color: 'from-emerald-500/20 to-green-900/40',
    accent: 'text-emerald-400',
    stats: { area: '54 acres', location: 'Derwood, MD', park: 'Rock Creek Regional' },
    coordinates: [39.1240, -77.1060] as [number, number]
  },
  {
    id: 'lake_nirvana',
    type: 'Lake',
    name: 'Lake Nirvana',
    description: 'A quaint, quiet community lake tucked away within Gaithersburg, Maryland. Though modest in size, it serves as a peaceful water feature for the surrounding local neighborhoods.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455030829.jpg',
    fallbackImage: 'https://picsum.photos/seed/lakenirvana/1200/800',
    color: 'from-teal-400/20 to-cyan-800/40',
    accent: 'text-teal-400',
    stats: { location: 'Gaithersburg, MD', type: 'Pond', environment: 'Suburban' },
    coordinates: [39.1200, -77.2200] as [number, number]
  },
  {
    id: 'maple_lake',
    type: 'Lake',
    name: 'Maple Lake',
    description: 'A historic small lake nestled inside the tranquil town of Washington Grove, Maryland. Heavily wooded and scenic, it has long been a private gem for the town\'s residents.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454764321.jpg',
    fallbackImage: 'https://picsum.photos/seed/maplelake/1200/800',
    color: 'from-orange-500/20 to-amber-900/40',
    accent: 'text-orange-400',
    stats: { location: 'Washington Grove, MD', type: 'Woodland Lake', historic_town: 'Yes' },
    coordinates: [39.1410, -77.1700] as [number, number]
  },
  {
    id: 'rock_creek_regional_park',
    type: 'Park',
    name: 'Rock Creek Regional Park',
    description: 'A massive 1,800-acre park stretching across Gaithersburg, Derwood, and Rockville. It encompasses both Lake Needwood and Lake Bernard Frank, providing dense forests, an extensive trail network, and boating.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Lake_Needwood_Rock_Creek_Regional_Park_13.jpg',
    fallbackImage: 'https://picsum.photos/seed/rockcreek/1200/800',
    color: 'from-green-600/20 to-emerald-900/40',
    accent: 'text-green-400',
    stats: { area: '1,800 acres', location: 'Montgomery County, MD', trails: 'Extensive' },
    coordinates: [39.1200, -77.1150] as [number, number]
  },
  {
    id: 'triadelphia_reservoir',
    type: 'Reservoir',
    name: 'Triadelphia Lake Recreation',
    description: 'A beautiful 800-acre reservoir created by the Brighton Dam on the Patuxent River. It offers recreational boating, fishing, and scenic picnic areas just outside Gaithersburg, Maryland.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Triadelphia_lake.jpg',
    fallbackImage: 'https://picsum.photos/seed/triadelphia/1200/800',
    color: 'from-blue-500/20 to-sky-800/40',
    accent: 'text-blue-400',
    stats: { area: '800 acres', location: 'Montgomery/Howard County', recreation: 'Fishing, Boating' },
    coordinates: [39.1910, -77.0050] as [number, number]
  },
  {
    id: 'great_seneca_stream_valley_park',
    type: 'Park & Stream',
    name: 'Great Seneca Stream Valley Park',
    description: 'A sprawling linear park tracing the main branch of Great Seneca Creek. The park preserves vital stream habitats and features miles of natural surface trails following the flowing water.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52454240472.jpg',
    fallbackImage: 'https://picsum.photos/seed/greatsenecavalley/1200/800',
    color: 'from-teal-500/20 to-green-800/40',
    accent: 'text-teal-400',
    stats: { location: 'Montgomery County, MD', features: 'Stream, Trails', ecosystem: 'Riparian' },
    coordinates: [39.1550, -77.2950] as [number, number]
  },
  {
    id: 'cabin_branch_stream_valley_park',
    type: 'Park & Stream',
    name: 'Cabin Branch Stream Valley Park',
    description: 'A dedicated conservation park built to protect the Cabin Branch tributary before it joins the larger Seneca Creek watershed. Thickly forested and secluded, it safeguards a sparkling stream.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455216490.jpg',
    fallbackImage: 'https://picsum.photos/seed/cabinbranch/1200/800',
    color: 'from-emerald-500/20 to-lime-800/40',
    accent: 'text-emerald-400',
    stats: { location: 'Clarksburg, MD', tributary: 'Seneca Creek', type: 'Valley Park' },
    coordinates: [39.2200, -77.2800] as [number, number]
  },
  {
    id: 'patuxent_river',
    type: 'River',
    name: 'Patuxent River',
    description: 'The longest river entirely within Maryland, passing closely to Montgomery County\'s borders. It serves as a vital drinking water source via its reservoirs and flows through stunning wooded landscapes.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Patuxent_River_at_Jefferson_Patterson_Park_MD1.jpg',
    fallbackImage: 'https://picsum.photos/seed/patuxentriver/1200/800',
    color: 'from-indigo-500/20 to-blue-900/40',
    accent: 'text-indigo-400',
    stats: { length: '115 miles', basin: '932 sq mi', location: 'Maryland' },
    coordinates: [39.1915, -77.0060] as [number, number]
  },
  {
    id: 'hawlings_river_stream_valley',
    type: 'Stream Valley',
    name: 'Hawlings River Stream Valley',
    description: 'A beautiful stream valley winding through Montgomery County, featuring the rocky, cascading Hawlings River. It offers lush forested banks and peaceful spots to observe the rushing water.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Little_Waterfall_on_the_Hawlings_River_%2849081090797%29.jpg',
    fallbackImage: 'https://picsum.photos/seed/hawlingsriver/1200/800',
    color: 'from-cyan-500/20 to-teal-800/40',
    accent: 'text-cyan-400',
    stats: { location: 'Montgomery County, MD', tributary: 'Patuxent River' },
    coordinates: [39.1950, -77.0150] as [number, number]
  },
  {
    id: 'muddy_branch',
    type: 'Stream',
    name: 'Muddy Branch',
    description: 'A major tributary of the Potomac River that runs through Gaithersburg. Muddy Branch features diverse aquatic habitats and is flanked by an extensive stream valley park network.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Muddy_branch_morris_park_gaithersburg_md_20201107_094800_1.jpg',
    fallbackImage: 'https://picsum.photos/seed/muddybranch/1200/800',
    color: 'from-amber-600/20 to-orange-900/40',
    accent: 'text-amber-500',
    stats: { location: 'Gaithersburg, MD', destination: 'Potomac River', type: 'Tributary' },
    coordinates: [39.1120, -77.2350] as [number, number]
  },
  {
    id: 'ingram_creek',
    type: 'Creek',
    name: 'Ingram Creek',
    description: 'A small, lively creek located in the Gaithersburg and Montgomery County area. It trickles through suburban neighborhoods and wooded patches, providing a vital micro-habitat for local amphibians.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Seneca_Creek_State_Park_foliage_-_25_Oct_2022_-_52455289708.jpg',
    fallbackImage: 'https://picsum.photos/seed/ingramcreek/1200/800',
    color: 'from-emerald-400/20 to-lime-800/40',
    accent: 'text-emerald-300',
    stats: { location: 'Gaithersburg, MD', type: 'Local Creek' },
    coordinates: [39.1500, -77.2000] as [number, number]
  },
  {
    id: 'seneca_creek_aqueduct',
    type: 'Aqueduct',
    name: 'Seneca Creek Aqueduct',
    description: 'A historic sandstone aqueduct where the Chesapeake and Ohio Canal crosses Seneca Creek. The structure allows one body of water to flow directly over another, showcasing 19th-century engineering.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Seneca_Creek_as_seen_from_the_Seneca_Aqueduct.jpg',
    fallbackImage: 'https://picsum.photos/seed/senecaaqueduct/1200/800',
    color: 'from-stone-500/20 to-blue-800/40',
    accent: 'text-stone-400',
    stats: { location: 'Montgomery County, MD', built: '1832', type: 'Navigable Aqueduct' },
    coordinates: [39.0680, -77.3390] as [number, number]
  },
  {
    id: 'foxkit_creek',
    type: 'Creek',
    name: 'Foxkit Creek',
    description: 'A meandering stream in Gaithersburg, Maryland. Known to locals winding through neighborhood greenways, Foxkit Creek features gentle riffles and is surrounded by dense suburban tree canopy.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Muddy_branch_morris_park_gaithersburg_md_20201107_094800_1.jpg',
    fallbackImage: 'https://picsum.photos/seed/foxkitcreek/1200/800',
    color: 'from-orange-500/20 to-red-800/40',
    accent: 'text-orange-400',
    stats: { location: 'Gaithersburg, MD', environment: 'Neighborhood Greenway' },
    coordinates: [39.1450, -77.2250] as [number, number]
  },
  {
    id: 'monocacy_aqueduct',
    type: 'Aqueduct',
    name: 'Monocacy Aqueduct',
    description: 'The largest aqueduct on the Chesapeake and Ohio Canal, spanning the Monocacy River right near the Montgomery County border. This magnificent 19th-century stone structure channels water elegantly across the river below.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Monocacy_Aqueduct%2C_C%26O_Canal%2C_MD.jpg',
    fallbackImage: 'https://picsum.photos/seed/monocacyaqueduct/1200/800',
    color: 'from-slate-500/20 to-blue-800/40',
    accent: 'text-slate-400',
    stats: { location: 'Dickerson, MD', length: '516 feet', built: '1833' },
    coordinates: [39.2230, -77.4470] as [number, number]
  },
  {
    id: 'chevy_chase_lake',
    type: 'Historic Lake / Stream',
    name: 'Chevy Chase Lake',
    description: 'Historically a popular man-made lake and trolley destination in Chevy Chase, Maryland. While the original lake was drained, the pristine waters of Coquelin Run still flow through the valley today as a beautiful stream memory.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Coquelin_Run.jpg',
    fallbackImage: 'https://picsum.photos/seed/chevychaselake/1200/800',
    color: 'from-sky-400/20 to-cyan-800/40',
    accent: 'text-sky-400',
    stats: { location: 'Chevy Chase, MD', stream: 'Coquelin Run', type: 'Historic Site' },
    coordinates: [38.9950, -77.0750] as [number, number]
  },
  {
    id: 'stone_lake',
    type: 'Quarry Lake',
    name: 'Stone Lake',
    description: 'A strikingly clear and deep lake formed within a historic rock quarry near the Montgomery County footprint. The sheer stone cliffs slope directly into vividly colored, refreshing waters.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Quarry_Lake_Maryland_July_2022.jpg',
    fallbackImage: 'https://picsum.photos/seed/stonelake/1200/800',
    color: 'from-blue-600/20 to-indigo-900/40',
    accent: 'text-blue-500',
    stats: { location: 'Montgomery Area, MD', type: 'Repurposed Quarry', clarity: 'High' },
    coordinates: [39.1300, -76.8400] as [number, number]
  }
];

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const [viewMode, setViewMode] = useState<'photo' | 'map'>('photo');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (selectedId) {
      setViewMode('photo');
    }
  }, [selectedId]);

  const selectedItem = bodiesOfWater.find(item => item.id === selectedId);

  const sortedBodiesOfWater = [...bodiesOfWater].sort((a, b) => {
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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(30,58,138,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(15,118,110,0.1),_transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24 min-h-screen flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-4">
              Bodies of Water
            </h1>
            <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
              Explore the diverse aquatic ecosystems that shape our planet, from the deepest oceans to serene glacial lakes.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSortOrder(prev => prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors text-slate-300"
            >
              {sortOrder === 'default' && <><ArrowUpDown className="w-4 h-4" /><span className="text-sm">Sort</span></>}
              {sortOrder === 'asc' && <><ArrowDownAZ className="w-4 h-4" /><span className="text-sm">A-Z</span></>}
              {sortOrder === 'desc' && <><ArrowUpZA className="w-4 h-4" /><span className="text-sm">Z-A</span></>}
            </button>
            <div className="hidden md:flex h-16 w-16 rounded-full border border-slate-800 items-center justify-center bg-slate-900/50 backdrop-blur-sm">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {paginatedBodiesOfWater.map((item, index) => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedId(item.id)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer h-[300px] md:h-[350px] lg:h-[400px]"
            >
              <motion.img
                layoutId={`image-${item.id}`}
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = item.fallbackImage;
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
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
              className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-2 mx-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
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
              className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
              <motion.div
                layoutId={`card-${selectedItem.id}`}
                className="bg-slate-900 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto max-h-[90vh]"
              >
                <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0">
                  <motion.img
                    layoutId={`image-${selectedItem.id}`}
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = selectedItem.fallbackImage;
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedItem.color} mix-blend-overlay pointer-events-none transition-opacity duration-500 ${viewMode === 'map' ? 'opacity-0' : 'opacity-100'}`} />
                  
                  <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${viewMode === 'map' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
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

                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewMode('photo'); }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-lg ${viewMode === 'photo' ? 'bg-white text-slate-900' : 'bg-slate-900/50 text-white hover:bg-slate-800/80'}`}
                      title="View Photo"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setViewMode('map'); }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-lg ${viewMode === 'map' ? 'bg-white text-slate-900' : 'bg-slate-900/50 text-white hover:bg-slate-800/80'}`}
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
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 ml-4"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-300 text-lg leading-relaxed mb-10"
                  >
                    {selectedItem.description}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-auto grid grid-cols-2 gap-6"
                  >
                    {Object.entries(selectedItem.stats).map(([key, value]) => (
                      <div key={key} className="border-t border-slate-800 pt-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{key}</div>
                        <div className="text-xl font-medium text-slate-200">{value}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
