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
