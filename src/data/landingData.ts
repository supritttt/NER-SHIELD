export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface RouteOptionComparison {
  id: string;
  title: string;
  badge?: string;
  isAiRecommended: boolean;
  distance: string;
  travelTime: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number;
  hazardsAvoided: string[];
  features: string[];
  weatherAlert: string;
  roadCondition: string;
}

export interface RiskFilterState {
  flood: boolean;
  landslide: boolean;
  roadConditions: boolean;
  weather: boolean;
  accessibility: boolean;
  emergencyRoutes: boolean;
}

export interface ImpactMetric {
  title: string;
  metric: string;
  subtext: string;
  description: string;
  iconName: string;
}

export interface TeamMember {
  name: string;
  role: string;
  domain: string;
  bio: string;
  avatar: string;
}

export interface TechStackCategory {
  category: string;
  tools: { name: string; tag: string }[];
}

export const CAPABILITIES: LandingFeature[] = [
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    description: 'Neural risk scoring calculating terrain-adaptive delay predictions.',
    iconName: 'Cpu',
  },
  {
    id: 'gis',
    title: 'GIS Intelligence',
    description: 'High-resolution geospatial overlays for eight North Eastern States.',
    iconName: 'Map',
  },
  {
    id: 'satellite',
    title: 'Satellite Data',
    description: 'Continuous satellite radar precipitation & landslide soil saturation models.',
    iconName: 'Satellite',
  },
  {
    id: 'weather',
    title: 'Weather Intelligence',
    description: 'Hyperlocal IMD telemetry parsing cloudburst & flash flood warnings.',
    iconName: 'CloudRain',
  },
  {
    id: 'gps',
    title: 'GPS Tracking',
    description: 'Telemetry feeds tracking critical relief convoys with dead-reckoning fallback.',
    iconName: 'Navigation',
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    description: 'Historical landslide hazard classification trained on multi-decade event logs.',
    iconName: 'Network',
  },
  {
    id: 'accessibility',
    title: 'Accessibility Analysis',
    description: 'Isochrone connectivity modeling to reveal isolated valley clusters.',
    iconName: 'Activity',
  },
];

export const ROUTE_COMPARISON_DATA: { [key: string]: { origin: string; destination: string; routes: RouteOptionComparison[] } } = {
  'guwahati-itanagar': {
    origin: 'Guwahati (Assam)',
    destination: 'Itanagar (Arunachal Pradesh)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — Conventional Highway (NH-15 via Mangaldoi)',
        badge: 'Shortest Distance',
        isAiRecommended: false,
        distance: '328 km',
        travelTime: '8h 30m',
        riskLevel: 'High',
        riskScore: 78,
        hazardsAvoided: [],
        features: [
          'Direct national highway corridor',
          'Heavy monsoon silt accumulation on river bridge approaches',
          'Substantial landslide vulnerability past Banderdewa pass',
        ],
        weatherAlert: 'Moderate to heavy rain predicted (42mm/hr)',
        roadCondition: 'Degraded macadam, intermittent washouts reported',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Resilient Corridor (NH-715 via Kaliabor & Gohpur)',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '354 km',
        travelTime: '9h 10m',
        riskLevel: 'Low',
        riskScore: 21,
        hazardsAvoided: [
          'Evades active Banderdewa debris flows',
          'Bypasses inundated Jia Bhoreli low-level causeways',
          'Sustained high-elevation embankment integrity',
        ],
        features: [
          'Lower landslide probability (-72% historical incidence)',
          'Better road accessibility and reinforced bridges',
          'Reduced rainfall exposure through leeward valley corridor',
          'Higher emergency connectivity with designated trauma depots',
        ],
        weatherAlert: 'Light intermittent mist, cloudburst risk 8%',
        roadCondition: 'All-weather 2-lane paved with reinforced retaining walls',
      },
    ],
  },
  'guwahati-silchar': {
    origin: 'Guwahati (Assam)',
    destination: 'Silchar (Barak Valley)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — NH-6 via Shillong & Sonapur Tunnel',
        badge: 'Primary Lifeline (Blocked)',
        isAiRecommended: false,
        distance: '312 km',
        travelTime: '10h 30m',
        riskLevel: 'Critical',
        riskScore: 92,
        hazardsAvoided: [],
        features: [
          'Shortest direct route between Brahmaputra & Barak Valleys',
          'Passes directly through active Sonapur mudflow portal',
          'Steep unstable shale escarpment prone to landslides',
        ],
        weatherAlert: 'Torrential downpour (88mm/hr) & rockfall warnings',
        roadCondition: 'Impassable at Sonapur Tunnel (60m mudflow)',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Recommended Detour via Haflong (NH-27 / SH-19)',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '348 km',
        travelTime: '8h 45m',
        riskLevel: 'Low',
        riskScore: 18,
        hazardsAvoided: [
          '100% circumvents blocked Sonapur Tunnel',
          'Avoids fragile East Jaintia Hills mudflow belts',
          'Reinforced 4-lane expressway over stable ridge line',
        ],
        features: [
          'All-weather multi-lane mountain expressway',
          'High average velocity (65 km/h)',
          'Automated electronic tolling and emergency escort depots',
        ],
        weatherAlert: 'Scattered light showers, optimal visibility',
        roadCondition: 'Paved divided 4-lane highway with anti-rockfall netting',
      },
    ],
  },
  'siliguri-gangtok': {
    origin: 'Siliguri (West Bengal)',
    destination: 'Gangtok (Sikkim)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — NH-10 Direct via Sevoke & Teesta Gorge',
        badge: 'Direct Defile (Hazardous)',
        isAiRecommended: false,
        distance: '114 km',
        travelTime: '4h 15m',
        riskLevel: 'High',
        riskScore: 84,
        hazardsAvoided: [],
        features: [
          'Follows Teesta river canyon floor',
          'Severely vulnerable to river scour at 29th Mile',
          'Single-lane alternating convoys creating multi-hour delays',
        ],
        weatherAlert: 'Active flood surge alert along Teesta river bed',
        roadCondition: 'Cracked pavement, washed-out embankments',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Recommended Detour via Lava & Algarah (NH-717A)',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '142 km',
        travelTime: '4h 50m',
        riskLevel: 'Low',
        riskScore: 26,
        hazardsAvoided: [
          'Completely avoids swollen Teesta gorge and riverbed washouts',
          'Bypasses 29th Mile single-lane bottleneck',
          'Zero risk of river scour or flash flooding',
        ],
        features: [
          'High-ridge mountain pass through stable pine forests',
          '100% reliable year-round transit corridor',
          'Smooth asphalt road built to modern BRO standards',
        ],
        weatherAlert: 'Light mountain mist, dry asphalt',
        roadCondition: 'Paved mountain highway with reinforced retaining walls',
      },
    ],
  },
  'dimapur-kohima': {
    origin: 'Dimapur (Nagaland)',
    destination: 'Kohima / Imphal (Manipur)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — NH-29 Direct via Chumukedima & Pagla Pahar',
        badge: 'Conventional Lifeline (Fragile)',
        isAiRecommended: false,
        distance: '74 km',
        travelTime: '3h 15m',
        riskLevel: 'High',
        riskScore: 86,
        hazardsAvoided: [],
        features: [
          'Pagla Pahar sinking zone active (14m road subsidence)',
          'Heavy boulder overhang with rockfall hazards under rainfall >25mm',
          'Frequent 1-lane alternating pilot vehicle escorts',
        ],
        weatherAlert: 'Heavy torrential downpour, high soil saturation',
        roadCondition: 'Fractured tarmac, frequent mud-clearing bulldozers active',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Resilient Bypass via NH-129A & Maram Ridge',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '96 km',
        travelTime: '3h 40m',
        riskLevel: 'Low',
        riskScore: 24,
        hazardsAvoided: [
          '100% evades notorious Pagla Pahar sinking fault line',
          'Bypasses Chumukedima gorge canyon bottleneck',
          'Eliminates rockfall exposure on fragile limestone bluffs',
        ],
        features: [
          'Geologically consolidated basalt ridgeline',
          'Pre-reinforced retaining walls and culvert storm drainage',
          'Designated heavy vehicle staging bays with telemetry beacons',
        ],
        weatherAlert: 'Passing mist, stable ground telemetry',
        roadCondition: '2-lane asphalt highway with gabion wall reinforcement',
      },
    ],
  },
  'tezpur-tawang': {
    origin: 'Tezpur (Assam)',
    destination: 'Tawang (High Arunachal)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — BCT Highway via Sela Pass High Summit (13,700 ft)',
        badge: 'Surface Summit (Sub-Zero)',
        isAiRecommended: false,
        distance: '320 km',
        travelTime: '11h 30m',
        riskLevel: 'Critical',
        riskScore: 89,
        hazardsAvoided: [],
        features: [
          'Passes over 13,700 ft summit with sub-zero black ice',
          'Frequent winter blizzard blockages lasting 48-72 hours',
          'Severe engine stalling & oxygen depletion risks for convoys',
        ],
        weatherAlert: 'Blizzard alert, wind gusts 65 km/h, visibility <15m',
        roadCondition: 'Ice-slick switchbacks, tire chains mandatory',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Smart Transit via Sela Twin-Tunnel Bypass',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '308 km',
        travelTime: '9h 15m',
        riskLevel: 'Low',
        riskScore: 22,
        hazardsAvoided: [
          'Avoids treacherous 3,000 ft climb to windswept summit',
          'Eliminates black-ice skidding on hairpin switchbacks',
          'Guarantees 365-day all-weather high-altitude connectivity',
        ],
        features: [
          'Grade-separated bi-directional heated tunnel (9.8 km)',
          'Automated jet ventilation and internal SOS telemetry shelters',
          'BRO continuous clearance escorts with zero blizzard stoppages',
        ],
        weatherAlert: 'Enclosed tunnel climate control, dry roadbed',
        roadCondition: 'Grade-A reinforced concrete roadway with illuminated lanes',
      },
    ],
  },
  'shillong-agartala': {
    origin: 'Shillong (Meghalaya)',
    destination: 'Agartala (Tripura)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — NH-8 via Jowai, Badarpur & Churaibari',
        badge: 'Direct Interstate Trunk',
        isAiRecommended: false,
        distance: '445 km',
        travelTime: '13h 45m',
        riskLevel: 'High',
        riskScore: 81,
        hazardsAvoided: [],
        features: [
          'Severe waterlogged clay sinks along Churaibari border checkpost',
          'Low-lying flood plains near Badarpur prone to inundation',
          'Multi-mile commercial truck queues creating 6+ hour standstills',
        ],
        weatherAlert: 'Heavy precipitation, flash flood advisory for low plains',
        roadCondition: 'Severe rutting, soft shoulder washouts',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Multi-Corridor via NH-106 & Dharmanagar Bypass',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '468 km',
        travelTime: '12h 30m',
        riskLevel: 'Low',
        riskScore: 25,
        hazardsAvoided: [
          'Bypasses gridlocked Churaibari border checkpoint bottleneck',
          'Elevated roadbed evades seasonal river backflow floods',
          'Avoids unstable clay marshlands on southern Barak plain',
        ],
        features: [
          'High-elevation embankment alignment through Dharmanagar',
          'Dedicated commercial fast-track lanes for priority logistics',
          'Continuous real-time road condition telemetry synced with Tripura PWD',
        ],
        weatherAlert: 'Moderate breeze, dry paved sectors',
        roadCondition: 'Well-drained 2-lane bitumen highway',
      },
    ],
  },
  'aizawl-silchar': {
    origin: 'Aizawl (Mizoram)',
    destination: 'Silchar (Assam)',
    routes: [
      {
        id: 'route-a',
        title: 'Route A — NH-306 Lifeline via Kolasib & Vairengte',
        badge: 'Sole National Lifeline (Vulnerable)',
        isAiRecommended: false,
        distance: '168 km',
        travelTime: '6h 30m',
        riskLevel: 'High',
        riskScore: 85,
        hazardsAvoided: [],
        features: [
          'Single arterial road serving 1.2 million residents of Mizoram',
          'Active slope failures near Kawnpui under rainfall >40mm/day',
          'Weight-restricted Bailey bridges creating single-truck bottlenecks',
        ],
        weatherAlert: 'Monsoon deluge detected, landslide saturation index 82%',
        roadCondition: 'Narrow mountain road with unstable hillside slopes',
      },
      {
        id: 'route-b',
        title: 'Route B — AI Resilient Corridor via Bairabi Multi-Modal Railhead',
        badge: 'AI RECOMMENDED',
        isAiRecommended: true,
        distance: '192 km',
        travelTime: '5h 50m',
        riskLevel: 'Low',
        riskScore: 20,
        hazardsAvoided: [
          'Evades saturated Kolasib landslide slips',
          'Bypasses weight-restricted wooden/bailey bridge spans',
          'Leverages wide multi-modal railway construction access road',
        ],
        features: [
          'Heavy-capacity reinforced culverts built for railway logistics',
          'Lower grade incline with wide 2-lane passing bays',
          'Direct intermodal transshipment link at Bairabi freight terminal',
        ],
        weatherAlert: 'Intermittent overcast, optimal traction',
        roadCondition: 'Heavy-duty asphalt corridor built to industrial specs',
      },
    ],
  },
};

export const PIPELINE_STEPS = [
  { id: 1, name: 'Weather Data', detail: 'Real-time IMD radar, precipitation rates & wind vectors', icon: 'CloudRain' },
  { id: 2, name: 'Satellite Data', detail: 'Optical SAR moisture indices & terrain contour gradients', icon: 'Satellite' },
  { id: 3, name: 'Road Conditions', detail: 'Border Roads Organisation (BRO) alerts & traffic telemetry', icon: 'Car' },
  { id: 4, name: 'Historical Disruptions', detail: '10-year spatial archive of monsoon landslides & washouts', icon: 'Clock' },
  { id: 5, name: 'GPS & Accessibility', detail: 'Fleet breadcrumbs, bridge clearances & network dead-zones', icon: 'Navigation' },
  { id: 6, name: 'AI Risk Engine', detail: 'XGBoost & Graph Neural Network multi-objective cost solver', icon: 'Cpu' },
  { id: 7, name: 'Smart Route Recommendation', detail: 'Hazard-resilient vector paths with live dispatch guidance', icon: 'CheckCircle' },
];

export const NER_STATES = [
  { name: 'Assam', center: [26.2006, 92.9376], capital: 'Dispur / Guwahati', keyChallenge: 'Severe seasonal Brahmaputra inundation and bank erosion' },
  { name: 'Arunachal Pradesh', center: [28.218, 94.7278], capital: 'Itanagar', keyChallenge: 'High-altitude tectonic shear zones, rockfalls, and snow locks' },
  { name: 'Meghalaya', center: [25.467, 91.3662], capital: 'Shillong', keyChallenge: 'World-record monsoon precipitation triggering escarpment mudslides' },
  { name: 'Manipur', center: [24.6637, 93.9063], capital: 'Imphal', keyChallenge: 'Fragile valley corridors flanked by steep seismic faults' },
  { name: 'Mizoram', center: [23.1645, 92.9376], capital: 'Aizawl', keyChallenge: 'Linear north-south ridgelines prone to widespread slope collapses' },
  { name: 'Nagaland', center: [26.1584, 94.5624], capital: 'Kohima', keyChallenge: 'Soft sedimentary strata prone to sinking highways in monsoons' },
  { name: 'Tripura', center: [23.9408, 91.9882], capital: 'Agartala', keyChallenge: 'Vulnerable bottleneck highway link through single hill corridor' },
  { name: 'Sikkim', center: [27.533, 88.5122], capital: 'Gangtok', keyChallenge: 'Glacial Lake Outburst Floods (GLOF) and extreme Teesta river turbulence' },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    title: 'Faster Emergency Response',
    metric: '38% Faster',
    subtext: 'Average dispatch clearance',
    description: 'Priority dynamic corridors expedite life-saving medicine, plasma, and oxygen tankers to cut-off sub-divisional health centers.',
    iconName: 'ShieldAlert',
  },
  {
    title: 'Safer Logistics',
    metric: '64% Hazard Drop',
    subtext: 'Convoy incident reduction',
    description: 'Preemptive routing steers critical supply trucks away from active landslide slopes and overflowing mountain streams.',
    iconName: 'Truck',
  },
  {
    title: 'Better Last-Mile Reach',
    metric: '142+ Isolated Pockets',
    subtext: 'Mapped for access resilience',
    description: 'Identifies accessibility vulnerabilities across remote hamlets, providing alternative feeder routing during severe bridge washouts.',
    iconName: 'Route',
  },
  {
    title: 'Data-Driven Planning',
    metric: '8 State Network',
    subtext: 'Cohesive GIS framework',
    description: 'Empowers disaster management authorities and civil transport directors with empirical route vulnerability analytics.',
    iconName: 'BarChart3',
  },
];

export const TECH_STACK: TechStackCategory[] = [
  {
    category: 'AI / Machine Learning',
    tools: [
      { name: 'Python', tag: 'Core Analytics' },
      { name: 'Scikit-learn', tag: 'Vulnerability Regression' },
      { name: 'PyTorch', tag: 'Graph Neural Networks' },
      { name: 'XGBoost', tag: 'Landslide Probability' },
      { name: 'TensorFlow', tag: 'Terrain Vision Inference' },
    ],
  },
  {
    category: 'GIS & Spatial Engine',
    tools: [
      { name: 'OpenStreetMap', tag: 'Base Topography' },
      { name: 'Leaflet.js', tag: 'Client-Side GIS' },
      { name: 'PostGIS', tag: 'Spatial Database' },
      { name: 'QGIS', tag: 'Hazard Modeling' },
      { name: 'Mapbox Vector', tag: 'Elevation Tiles' },
    ],
  },
  {
    category: 'Backend & APIs',
    tools: [
      { name: 'FastAPI', tag: 'Asynchronous Microservices' },
      { name: 'Python 3.12', tag: 'Runtime' },
      { name: 'PostgreSQL', tag: 'Relational Store' },
      { name: 'Redis', tag: 'Live Telemetry Cache' },
      { name: 'Docker', tag: 'Container Orchestration' },
    ],
  },
  {
    category: 'Intelligent Routing',
    tools: [
      { name: 'Custom AI Engine', tag: 'Multi-Factor Cost Solver' },
      { name: 'OSRM Engine', tag: 'Isochrone Matrix' },
      { name: 'GraphHopper', tag: 'Custom Terrain Weights' },
      { name: 'NetworkX', tag: 'Topological Resilience' },
    ],
  },
  {
    category: 'Telemetry & Ingestion',
    tools: [
      { name: 'IMD Open APIs', tag: 'Precipitation Feeds' },
      { name: 'Sentinel-1 SAR', tag: 'Soil Moisture Radar' },
      { name: 'BRO Telemetry', tag: 'Road Blockage Bulletins' },
      { name: 'GPS Fleets', tag: 'Real-Time Telematics' },
    ],
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Gargee Sharma',
    role: 'Lead Architect & AI Systems',
    domain: 'Spatial Intelligence & Deep Learning',
    bio: 'Specializes in spatial graph architectures and hazard modeling for Himalayan transportation corridors.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Arindam Das',
    role: 'Senior GIS & Remote Sensing Specialist',
    domain: 'Satellite Topography & Geodesy',
    bio: 'Over 12 years analyzing Brahmaputra flood dynamics, slope stability, and landslide susceptibility indexes.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tenzing Lhadon',
    role: 'Lead UI/UX & Frontend Engineer',
    domain: 'Tactical GIS Interfaces & WebGL',
    bio: 'Designs mission-critical visual analytics for emergency response command centers and logistics dashboards.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kunal Singha',
    role: 'Full-Stack Operations & Routing Engineer',
    domain: 'FastAPI, PostGIS & OSRM Pipeline',
    bio: 'Architect of high-throughput spatial pathfinding solvers calibrated for mountainous terrain and dead zones.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'COLLECT',
    lead: 'Continuous multi-source telemetry ingestion',
    points: [
      'IMD automated Doppler radar precipitation',
      'Copernicus Sentinel optical & radar soil moisture',
      'Border Roads Organisation (BRO) alerts',
      'Real-time GPS convoy velocity & dead reckoning',
    ],
  },
  {
    step: '02',
    title: 'ANALYZE',
    lead: 'Geospatial risk mapping & feature extraction',
    points: [
      'Slope gradient & geological shear planes',
      'Drainage basin flash flood accumulation',
      'Historical landslide frequency indexes',
      'Bridge payload rating and approach vulnerability',
    ],
  },
  {
    step: '03',
    title: 'PREDICT',
    lead: 'Proactive hazard probability forecasting',
    points: [
      'Pre-monsoon soil saturation thresholds',
      'Probability of road breach within next 12-48h',
      'Isochrone isolation risk for remote valleys',
      'Bottleneck susceptibility under surge demand',
    ],
  },
  {
    step: '04',
    title: 'OPTIMIZE',
    lead: 'Multi-objective risk-aware routing dispatch',
    points: [
      'Dynamic re-routing favoring stable terrain',
      'Emergency vehicle priority right-of-way',
      'Alternative arterial bypass recommendations',
      'Direct navigation broadcast to field drivers',
    ],
  },
];
