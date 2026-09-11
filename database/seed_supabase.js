import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdwwqkiwmwzsvdjfshiz.supabase.co';
const supabaseKey = 'sb_publishable_mY3ss8dg2kL-hpGAIOawrA_lI78Xtup';

const supabase = createClient(supabaseUrl, supabaseKey);

const DISTRICTS = [
  { id: 'dist-kamrup', name: 'Kamrup Metropolitan (Guwahati)', state: 'Assam', accessibility_score: 92, risk_level: 'Low', active_incidents: 1, major_highway: 'NH-27 / AH-1', elevation: '55m MSL', weather_summary: 'Light Drizzle, 28°C', rainfall_mm: 12.4, road_status: 'Open', latitude: 26.1445, longitude: 91.7362 },
  { id: 'dist-cachar', name: 'Cachar (Silchar)', state: 'Assam', accessibility_score: 74, risk_level: 'Moderate', active_incidents: 2, major_highway: 'NH-37 / NH-6', elevation: '35m MSL', weather_summary: 'Cloudy Rains, 27°C', rainfall_mm: 38.0, road_status: 'Caution', latitude: 24.8170, longitude: 92.8000 },
  { id: 'dist-dima-hasao', name: 'Dima Hasao (Haflong)', state: 'Assam', accessibility_score: 42, risk_level: 'Severe', active_incidents: 3, major_highway: 'NH-27', elevation: '960m MSL', weather_summary: 'Torrential Mountain Showers, 22°C', rainfall_mm: 78.4, road_status: 'Blocked', latitude: 25.1680, longitude: 93.0200 },
  { id: 'dist-east-khasi', name: 'East Khasi Hills (Shillong)', state: 'Meghalaya', accessibility_score: 78, risk_level: 'Moderate', active_incidents: 2, major_highway: 'NH-6', elevation: '1,525m MSL', weather_summary: 'Heavy Mist & Mountain Rains, 18°C', rainfall_mm: 45.8, road_status: 'Caution', latitude: 25.5788, longitude: 91.8933 },
  { id: 'dist-east-jaintia', name: 'East Jaintia Hills (Sonapur)', state: 'Meghalaya', accessibility_score: 36, risk_level: 'Severe', active_incidents: 4, major_highway: 'NH-6', elevation: '890m MSL', weather_summary: 'Torrential Downpour, 21°C', rainfall_mm: 88.2, road_status: 'Blocked', latitude: 25.3117, longitude: 92.4285 },
  { id: 'dist-ri-bhoi', name: 'Ri-Bhoi (Nongpoh)', state: 'Meghalaya', accessibility_score: 84, risk_level: 'Low', active_incidents: 1, major_highway: 'NH-6', elevation: '485m MSL', weather_summary: 'Intermittent Rain, 24°C', rainfall_mm: 22.0, road_status: 'Open', latitude: 25.9000, longitude: 91.8800 },
  { id: 'dist-tawang', name: 'Tawang & West Kameng', state: 'Arunachal Pradesh', accessibility_score: 54, risk_level: 'High', active_incidents: 3, major_highway: 'NH-13', elevation: '3,048m MSL', weather_summary: 'Freezing Fog & Rockfall Alert, 8°C', rainfall_mm: 31.0, road_status: 'Caution', latitude: 27.5861, longitude: 91.8594 },
  { id: 'dist-papum-pare', name: 'Papum Pare (Itanagar)', state: 'Arunachal Pradesh', accessibility_score: 72, risk_level: 'Moderate', active_incidents: 1, major_highway: 'NH-415', elevation: '320m MSL', weather_summary: 'Scattered Downpour, 26°C', rainfall_mm: 34.5, road_status: 'Open', latitude: 27.0844, longitude: 93.6053 },
  { id: 'dist-imphal-west', name: 'Imphal West (Imphal)', state: 'Manipur', accessibility_score: 68, risk_level: 'Moderate', active_incidents: 2, major_highway: 'NH-102', elevation: '786m MSL', weather_summary: 'Overcast & Humidity, 24°C', rainfall_mm: 18.5, road_status: 'Open', latitude: 24.8170, longitude: 93.9368 },
  { id: 'dist-noney', name: 'Noney & Tamenglong', state: 'Manipur', accessibility_score: 38, risk_level: 'Severe', active_incidents: 4, major_highway: 'NH-37', elevation: '980m MSL', weather_summary: 'Heavy Thunderstorm & Mudflow, 21°C', rainfall_mm: 84.0, road_status: 'Blocked', latitude: 24.7800, longitude: 93.5800 },
  { id: 'dist-aizawl', name: 'Aizawl & Kolasib', state: 'Mizoram', accessibility_score: 62, risk_level: 'High', active_incidents: 2, major_highway: 'NH-306', elevation: '1,132m MSL', weather_summary: 'Continuous Drizzle, 20°C', rainfall_mm: 42.1, road_status: 'Caution', latitude: 23.7271, longitude: 92.7176 },
  { id: 'dist-lunglei', name: 'Lunglei', state: 'Mizoram', accessibility_score: 66, risk_level: 'Moderate', active_incidents: 1, major_highway: 'NH-54', elevation: '1,222m MSL', weather_summary: 'Scattered Showers, 22°C', rainfall_mm: 28.0, road_status: 'Open', latitude: 22.8800, longitude: 92.7300 },
  { id: 'dist-kohima', name: 'Kohima & Dimapur', state: 'Nagaland', accessibility_score: 48, risk_level: 'High', active_incidents: 3, major_highway: 'NH-29', elevation: '1,444m MSL', weather_summary: 'Active Mudslide Alert, 17°C', rainfall_mm: 52.4, road_status: 'Caution', latitude: 25.6751, longitude: 94.1086 },
  { id: 'dist-mokokchung', name: 'Mokokchung', state: 'Nagaland', accessibility_score: 70, risk_level: 'Moderate', active_incidents: 1, major_highway: 'NH-702', elevation: '1,325m MSL', weather_summary: 'Passing Showers, 19°C', rainfall_mm: 24.0, road_status: 'Open', latitude: 26.3200, longitude: 94.5200 },
  { id: 'dist-gangtok', name: 'Gangtok & Mangan', state: 'Sikkim', accessibility_score: 40, risk_level: 'Severe', active_incidents: 5, major_highway: 'NH-10', elevation: '1,650m MSL', weather_summary: 'Teesta Flash Flood Warning, 15°C', rainfall_mm: 96.4, road_status: 'Blocked', latitude: 27.3389, longitude: 88.6065 },
  { id: 'dist-west-tripura', name: 'West Tripura (Agartala)', state: 'Tripura', accessibility_score: 88, risk_level: 'Low', active_incidents: 0, major_highway: 'NH-8', elevation: '15m MSL', weather_summary: 'Clear Skies, 30°C', rainfall_mm: 4.2, road_status: 'Open', latitude: 23.8315, longitude: 91.2868 }
];

const ROAD_SEGMENTS = [
  {
    id: 'seg-nh6-sonapur',
    name: 'NH-6 Guwahati - Sonapur - Silchar Lifeline',
    code: 'NH-6',
    state: 'Meghalaya',
    status: 'Blocked',
    risk_score: 94,
    disruption_reason: 'Massive mudslide & rockfall blocking both carriageways at Sonapur Tunnel portal (KM 132). 60m sludge.',
    detour_available: true,
    detour_route_name: 'Alternate Haflong-Umrangso bypass (NH-27 / SH-19)',
    length_km: 312.0,
    lanes: '2-Lane Hill Corridor',
    avg_speed_kmh: 0,
    clearance_eta: 'Est. Clearance: 6h 30m',
    traffic_volume: '8,450 PCU/day',
    coordinates: [[26.1445, 91.7362], [25.9, 91.82], [25.5788, 91.8933], [25.43, 92.15], [25.3117, 92.4285], [25.05, 92.65], [24.817, 92.8]]
  },
  {
    id: 'seg-nh27-east-west',
    name: 'NH-27 East-West Expressway (Guwahati - Nagaon - Lumding)',
    code: 'NH-27',
    state: 'Assam',
    status: 'Open',
    risk_score: 18,
    disruption_reason: 'Pavement resurfacing near Jagiroad bypass. Traffic moving at normal hill speeds.',
    detour_available: false,
    detour_route_name: null,
    length_km: 185.0,
    lanes: '4-Lane Divided Highway',
    avg_speed_kmh: 68,
    clearance_eta: 'All Clear',
    traffic_volume: '18,200 PCU/day',
    coordinates: [[26.1445, 91.7362], [26.19, 92.15], [26.34, 92.68], [25.75, 93.18]]
  },
  {
    id: 'seg-nh10-teesta',
    name: 'NH-10 Siliguri - Teesta Gorge - Gangtok Lifeline',
    code: 'NH-10',
    state: 'Sikkim',
    status: 'Blocked',
    risk_score: 96,
    disruption_reason: 'Teesta River flash flood breached 120m roadway at 29th Mile. BRO Heavy Earthmovers deployed.',
    detour_available: true,
    detour_route_name: 'Melli - Jorethang - Namchi High-Ridge bypass',
    length_km: 114.0,
    lanes: '2-Lane Mountain Defile',
    avg_speed_kmh: 0,
    clearance_eta: 'Est. Clearance: 14h',
    traffic_volume: '6,800 PCU/day',
    coordinates: [[26.7271, 88.3953], [27.05, 88.48], [27.18, 88.52], [27.3389, 88.6065]]
  },
  {
    id: 'seg-nh13-sela',
    name: 'NH-13 Trans-Arunachal Highway (Bhalukpong - Sela Pass)',
    code: 'NH-13',
    state: 'Arunachal Pradesh',
    status: 'Caution',
    risk_score: 72,
    disruption_reason: 'Dense fog reducing visibility below 30m; minor rockfalls between Jaswant Garh and Sela Tunnel portal.',
    detour_available: false,
    detour_route_name: null,
    length_km: 180.0,
    lanes: '2-Lane BRO Strategic Link',
    avg_speed_kmh: 28,
    clearance_eta: 'Slow Traffic (Convoys Only)',
    traffic_volume: '2,900 PCU/day',
    coordinates: [[27.01, 92.63], [27.25, 92.42], [27.5, 92.1], [27.5861, 91.8594]]
  },
  {
    id: 'seg-nh29-pagla',
    name: 'NH-29 Dimapur - Pagla Pahar - Kohima Lifeline',
    code: 'NH-29',
    state: 'Nagaland',
    status: 'Caution',
    risk_score: 68,
    disruption_reason: 'Active sinking zone at Pagla Pahar (KM 22); single-lane staggered convoy movement enforced by traffic police.',
    detour_available: true,
    detour_route_name: 'Niuland - Kohima Rural Bypass (Light Vehicles Only)',
    length_km: 74.0,
    lanes: '2-Lane Mountain Corridor',
    avg_speed_kmh: 22,
    clearance_eta: 'Delay: +90 mins',
    traffic_volume: '7,100 PCU/day',
    coordinates: [[25.9, 93.73], [25.78, 93.9], [25.6751, 94.1086]]
  },
  {
    id: 'seg-nh37-noney',
    name: 'NH-37 Imphal - Jiribam - Silchar Lifeline',
    code: 'NH-37',
    state: 'Manipur',
    status: 'Blocked',
    risk_score: 91,
    disruption_reason: 'Major mudflow near Makru Bridge approach. 80 loaded freight trucks stranded.',
    detour_available: true,
    detour_route_name: 'Reroute via Churachandpur - Tipaimukh border track (4WD Only)',
    length_km: 220.0,
    lanes: '2-Lane Hill Road',
    avg_speed_kmh: 0,
    clearance_eta: 'Est. Clearance: 10h 30m',
    traffic_volume: '4,300 PCU/day',
    coordinates: [[24.8, 93.15], [24.78, 93.58], [24.817, 93.9368]]
  },
  {
    id: 'seg-nh306-hunthar',
    name: 'NH-306 Silchar - Vairengte - Aizawl Lifeline',
    code: 'NH-306',
    state: 'Mizoram',
    status: 'Caution',
    risk_score: 64,
    disruption_reason: 'Hunthar sinking zone road depression; heavy multi-axle trailers restricted.',
    detour_available: false,
    detour_route_name: null,
    length_km: 130.0,
    lanes: '2-Lane Lifeline',
    avg_speed_kmh: 32,
    clearance_eta: 'Controlled Movement',
    traffic_volume: '3,800 PCU/day',
    coordinates: [[24.5, 92.76], [24.18, 92.75], [23.7271, 92.7176]]
  },
  {
    id: 'seg-nh8-tripura',
    name: 'NH-8 Churaibari - Teliamura - Agartala Corridor',
    code: 'NH-8',
    state: 'Tripura',
    status: 'Open',
    risk_score: 15,
    disruption_reason: 'All bridges cleared. Toll gates automated and fast moving.',
    detour_available: false,
    detour_route_name: null,
    length_km: 198.0,
    lanes: '2-Lane National Highway',
    avg_speed_kmh: 62,
    clearance_eta: 'Normal',
    traffic_volume: '9,400 PCU/day',
    coordinates: [[24.4, 92.2], [24.0, 91.7], [23.8315, 91.2868]]
  }
];

const INCIDENTS = [
  {
    id: 'inc-001',
    title: 'Sonapur Tunnel Portal Mudflow & Rockfall',
    type: 'Landslide',
    severity: 'Severe',
    location: 'NH-6 KM 132 near Sonapur',
    district_id: 'dist-east-jaintia',
    district_name: 'East Jaintia Hills (Sonapur)',
    coordinates: [25.3117, 92.4285],
    verified_by_ai: true,
    reports_count: 18,
    description: 'Massive torrential hill mudslide triggered by 88mm rain. Both carriageways completely blocked by 60m sludge. Heavy excavators on site.'
  },
  {
    id: 'inc-002',
    title: 'Pagla Pahar Road Slump & Sinking Zone',
    type: 'Landslide',
    severity: 'High',
    location: 'NH-29 KM 22 near Chümoukedima',
    district_id: 'dist-kohima',
    district_name: 'Kohima & Dimapur',
    coordinates: [25.78, 93.90],
    verified_by_ai: true,
    reports_count: 9,
    description: 'Gradual slope failure following continuous drizzle. Left carriageway cracked; single-lane alternating passage managed by SDRF.'
  },
  {
    id: 'inc-003',
    title: 'Teesta River Embankment Washout at 29th Mile',
    type: 'Flash Flood',
    severity: 'Severe',
    location: 'NH-10 near 29th Mile Gorge',
    district_id: 'dist-gangtok',
    district_name: 'Gangtok & Mangan',
    coordinates: [27.18, 88.52],
    verified_by_ai: true,
    reports_count: 27,
    description: 'Teesta water levels breached the river wall. 120m roadway washed away. All vehicular traffic suspended until further notice.'
  },
  {
    id: 'inc-004',
    title: 'Sela Pass Frozen Slush & Zero Visibility',
    type: 'Heavy Fog',
    severity: 'High',
    location: 'NH-13 Sela Pass Summit (4,170m)',
    district_id: 'dist-tawang',
    district_name: 'Tawang & West Kameng',
    coordinates: [27.50, 92.10],
    verified_by_ai: true,
    reports_count: 6,
    description: 'Sub-zero freezing fog combined with rock slippage. Military and civilian supply trucks requested to mount snow tire chains.'
  },
  {
    id: 'inc-005',
    title: 'Makru Bridge Approach Landslip',
    type: 'Road Collapse',
    severity: 'Severe',
    location: 'NH-37 near Makru River Crossing',
    district_id: 'dist-noney',
    district_name: 'Noney & Tamenglong',
    coordinates: [24.78, 93.58],
    verified_by_ai: true,
    reports_count: 14,
    description: 'Slope collapse onto bridge abutment. Heavy multi-axle freight traffic halted; SDRF clearance underway.'
  }
];

const CALAMITY_ALERTS = [
  {
    id: 'calamity-001',
    title: 'CRITICAL NATURAL CALAMITY: Sonapur Mudflow & Mountain Collapse',
    calamity_type: 'Landslide',
    severity: 'Critical',
    location: 'NH-6 Sonapur Tunnel Corridor',
    district_id: 'dist-east-jaintia',
    affected_highway: 'NH-6 Lifeline',
    latitude: 25.3117,
    longitude: 92.4285,
    active: true,
    sound_siren: true,
    message: 'Massive mudslide triggered by 88.2mm torrential downpour. Highway impassable. Extreme structural risk of further collapse.',
    instructions: 'PULL OVER TO DESIGNATED OPEN SAFE ZONE. DO NOT PARK BENEATH ROCK OVERHANGS. WAIT FOR SDRF CLEARANCE.'
  },
  {
    id: 'calamity-002',
    title: 'USGS Seismic Alert: Tremor M4.2 Recorded in Cachar-Barak Valley',
    calamity_type: 'Earthquake',
    severity: 'Severe',
    location: 'Cachar-Meghalaya Border Fault',
    district_id: 'dist-cachar',
    affected_highway: 'NH-37 / NH-6 Corridor',
    latitude: 24.82,
    longitude: 92.78,
    active: true,
    sound_siren: true,
    message: 'Tremor of magnitude M4.2 recorded at depth 12km. Drivers on mountain highways check road pavement for fissures.',
    instructions: 'REDUCE SPEED IMMEDIATELY. INSPECT BRIDGES AND TUNNEL APPROACHES FOR CRACKS BEFORE CROSSING.'
  }
];

async function seed() {
  console.log('Seeding Supabase database with NER-SHIELD dataset...');

  // 1. Districts
  const { error: dErr } = await supabase.from('districts').upsert(DISTRICTS);
  if (dErr) console.error('Districts error:', dErr);
  else console.log('✓ Seeded', DISTRICTS.length, 'districts');

  // 2. Road Segments
  const { error: rErr } = await supabase.from('road_segments').upsert(ROAD_SEGMENTS);
  if (rErr) console.error('Road segments error:', rErr);
  else console.log('✓ Seeded', ROAD_SEGMENTS.length, 'road segments');

  // 3. Incidents
  const { error: iErr } = await supabase.from('incidents').upsert(INCIDENTS);
  if (iErr) console.error('Incidents error:', iErr);
  else console.log('✓ Seeded', INCIDENTS.length, 'incidents');

  // 4. Calamity Alerts
  const { error: cErr } = await supabase.from('calamity_alerts').upsert(CALAMITY_ALERTS);
  if (cErr) console.error('Calamity alerts error:', cErr);
  else console.log('✓ Seeded', CALAMITY_ALERTS.length, 'calamity alerts');

  console.log('Finished seeding Supabase successfully!');
}

seed().catch(err => console.error(err));
