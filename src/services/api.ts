import type { District, RoadSegment, VehicleFleet, Incident, WeatherData, KPIData, RouteOption } from '../types';
import { liveWeatherService } from './liveWeatherService';
import { supabaseService } from './supabaseService';


export const INITIAL_DISTRICTS: District[] = [
  {
    id: 'dist-kamrup',
    name: 'Kamrup Metropolitan (Guwahati)',
    state: 'Assam',
    accessibilityScore: 92,
    riskLevel: 'Low',
    activeIncidents: 1,
    majorHighway: 'NH-27 / AH-1',
    elevation: '55m MSL',
    weatherSummary: 'Light Drizzle, 28°C',
    rainfallMm: 12.4,
    roadStatus: 'Open',
    coordinates: [26.1445, 91.7362],
    historicalDisruptions: [
      { month: 'May', incidents: 3 },
      { month: 'Jun', incidents: 8 },
      { month: 'Jul', incidents: 14 },
      { month: 'Aug', incidents: 9 },
      { month: 'Sep', incidents: 4 }
    ],
    emergencyContacts: [
      { service: 'State Disaster Response (SDRF)', number: '1079' },
      { service: 'NHAI Guwahati Control', number: '+91-361-2234001' }
    ],
    keyPasses: ['Saraighat Bridge Crossing', 'Khanapara Transit Chokepoint']
  },
  {
    id: 'dist-east-khasi',
    name: 'East Khasi Hills (Shillong)',
    state: 'Meghalaya',
    accessibilityScore: 78,
    riskLevel: 'Moderate',
    activeIncidents: 2,
    majorHighway: 'NH-6 (Guwahati-Shillong Expy)',
    elevation: '1,525m MSL',
    weatherSummary: 'Heavy Mist & Mountain Rains, 18°C',
    rainfallMm: 45.8,
    roadStatus: 'Caution',
    coordinates: [25.5788, 91.8933],
    historicalDisruptions: [
      { month: 'May', incidents: 7 },
      { month: 'Jun', incidents: 19 },
      { month: 'Jul', incidents: 32 },
      { month: 'Aug', incidents: 24 },
      { month: 'Sep', incidents: 12 }
    ],
    emergencyContacts: [
      { service: 'Meghalaya Police Control', number: '112' },
      { service: 'Umiam Emergency Highway Patrol', number: '+91-364-2501234' }
    ],
    keyPasses: ['Barapani Dam Viaduct', 'Mawlai Slope Corridor']
  },
  {
    id: 'dist-east-jaintia',
    name: 'East Jaintia Hills (Sonapur)',
    state: 'Meghalaya',
    accessibilityScore: 36,
    riskLevel: 'Severe',
    activeIncidents: 4,
    majorHighway: 'NH-6 (Silchar-Agartala Lifeline)',
    elevation: '890m MSL',
    weatherSummary: 'Torrential Downpour, 21°C',
    rainfallMm: 88.2,
    roadStatus: 'Blocked',
    coordinates: [25.3117, 92.4285],
    historicalDisruptions: [
      { month: 'May', incidents: 15 },
      { month: 'Jun', incidents: 42 },
      { month: 'Jul', incidents: 58 },
      { month: 'Aug', incidents: 39 },
      { month: 'Sep', incidents: 27 }
    ],
    emergencyContacts: [
      { service: 'Sonapur Tunnel Rescue Post', number: '+91-3655-220199' },
      { service: 'Khliehriat Civil Hospital', number: '108' }
    ],
    keyPasses: ['Sonapur Tunnel Entrance', 'Lukha River Bridge Bypass']
  },
  {
    id: 'dist-tawang',
    name: 'Tawang & West Kameng',
    state: 'Arunachal Pradesh',
    accessibilityScore: 54,
    riskLevel: 'High',
    activeIncidents: 3,
    majorHighway: 'NH-13 (Trans-Arunachal)',
    elevation: '3,048m MSL',
    weatherSummary: 'Freezing Fog & Rockfall Alert, 8°C',
    rainfallMm: 31.0,
    roadStatus: 'Caution',
    coordinates: [27.5861, 91.8594],
    historicalDisruptions: [
      { month: 'May', incidents: 6 },
      { month: 'Jun', incidents: 12 },
      { month: 'Jul', incidents: 22 },
      { month: 'Aug', incidents: 18 },
      { month: 'Sep', incidents: 14 }
    ],
    emergencyContacts: [
      { service: 'Border Roads Org (BRO) Vartak', number: '+91-3794-222240' },
      { service: 'District Disaster Cell', number: '1077' }
    ],
    keyPasses: ['Sela Pass (4,170m)', 'Jaswant Garh Ridge', 'Bhalukpong Gate']
  },
  {
    id: 'dist-imphal-west',
    name: 'Imphal West & Noney',
    state: 'Manipur',
    accessibilityScore: 68,
    riskLevel: 'Moderate',
    activeIncidents: 2,
    majorHighway: 'NH-37 (Silchar-Imphal)',
    elevation: '786m MSL',
    weatherSummary: 'Scattered Showers, 24°C',
    rainfallMm: 22.1,
    roadStatus: 'Caution',
    coordinates: [24.8170, 93.9368],
    historicalDisruptions: [
      { month: 'May', incidents: 4 },
      { month: 'Jun', incidents: 14 },
      { month: 'Jul', incidents: 26 },
      { month: 'Aug', incidents: 19 },
      { month: 'Sep', incidents: 8 }
    ],
    emergencyContacts: [
      { service: 'Manipur Traffic Control', number: '0385-2450144' },
      { service: 'Makru Bridge Incident Team', number: '112' }
    ],
    keyPasses: ['Makru Bridge', 'Noney Tupul Railway-Highway Link']
  },
  {
    id: 'dist-aizawl',
    name: 'Aizawl & Kolasib',
    state: 'Mizoram',
    accessibilityScore: 71,
    riskLevel: 'Moderate',
    activeIncidents: 1,
    majorHighway: 'NH-306',
    elevation: '1,132m MSL',
    weatherSummary: 'Cloudy, Occasional Drizzle, 22°C',
    rainfallMm: 18.5,
    roadStatus: 'Open',
    coordinates: [23.7271, 92.7176],
    historicalDisruptions: [
      { month: 'May', incidents: 5 },
      { month: 'Jun', incidents: 16 },
      { month: 'Jul', incidents: 29 },
      { month: 'Aug', incidents: 20 },
      { month: 'Sep', incidents: 10 }
    ],
    emergencyContacts: [
      { service: 'Mizoram Disaster Cell', number: '1070' },
      { service: 'Kolasib Checkpost Emergency', number: '+91-3837-220021' }
    ],
    keyPasses: ['Vairengte Gateway', 'Hunthar Mudslide Zone']
  },
  {
    id: 'dist-kohima',
    name: 'Kohima & Dimapur',
    state: 'Nagaland',
    accessibilityScore: 82,
    riskLevel: 'Low',
    activeIncidents: 1,
    majorHighway: 'NH-29',
    elevation: '1,444m MSL',
    weatherSummary: 'Partly Cloudy, 20°C',
    rainfallMm: 14.0,
    roadStatus: 'Open',
    coordinates: [25.6751, 94.1086],
    historicalDisruptions: [
      { month: 'May', incidents: 3 },
      { month: 'Jun', incidents: 11 },
      { month: 'Jul', incidents: 21 },
      { month: 'Aug', incidents: 13 },
      { month: 'Sep', incidents: 6 }
    ],
    emergencyContacts: [
      { service: 'Nagaland State Police', number: '100' },
      { service: 'Chumukedima Highway Patrol', number: '+91-3862-240112' }
    ],
    keyPasses: ['Pagla Pahar Landslide Belt', 'Dzükou Foothill Pass']
  },
  {
    id: 'dist-gangtok',
    name: 'Gangtok & Mangan',
    state: 'Sikkim',
    accessibilityScore: 62,
    riskLevel: 'High',
    activeIncidents: 3,
    majorHighway: 'NH-10 (Siliguri-Sikkim Corridor)',
    elevation: '1,650m MSL',
    weatherSummary: 'Heavy Downpour, Silt Runoff, 15°C',
    rainfallMm: 52.4,
    roadStatus: 'Caution',
    coordinates: [27.3389, 88.6065],
    historicalDisruptions: [
      { month: 'May', incidents: 8 },
      { month: 'Jun', incidents: 24 },
      { month: 'Jul', incidents: 41 },
      { month: 'Aug', incidents: 33 },
      { month: 'Sep', incidents: 18 }
    ],
    emergencyContacts: [
      { service: 'Sikkim SDRF', number: '03592-202461' },
      { service: 'Teesta Basin Rapid Response', number: '1070' }
    ],
    keyPasses: ['29th Mile Teesta Gorge', 'Rangpo Border Hub', 'Singtam Junction']
  },
  {
    id: 'dist-west-tripura',
    name: 'West Tripura (Agartala)',
    state: 'Tripura',
    accessibilityScore: 89,
    riskLevel: 'Low',
    activeIncidents: 0,
    majorHighway: 'NH-8',
    elevation: '15m MSL',
    weatherSummary: 'Clear Sky, High Humidity, 30°C',
    rainfallMm: 6.2,
    roadStatus: 'Open',
    coordinates: [23.8315, 91.2868],
    historicalDisruptions: [
      { month: 'May', incidents: 2 },
      { month: 'Jun', incidents: 7 },
      { month: 'Jul', incidents: 12 },
      { month: 'Aug', incidents: 8 },
      { month: 'Sep', incidents: 3 }
    ],
    emergencyContacts: [
      { service: 'Tripura Emergency Ops', number: '1070' },
      { service: 'Churaibari Border Transit', number: '+91-381-2323880' }
    ],
    keyPasses: ['Baramura Hill Pass', 'Churaibari Logistics Gate']
  }
];

export const INITIAL_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'seg-nh6-sonapur',
    name: 'NH-6 Guwahati - Sonapur - Silchar Lifeline',
    code: 'NH-6',
    state: 'Meghalaya',
    coordinates: [
      [26.1445, 91.7362],
      [25.9000, 91.8200],
      [25.5788, 91.8933],
      [25.4300, 92.1500],
      [25.3117, 92.4285],
      [25.0500, 92.6500],
      [24.8170, 92.8000]
    ],
    status: 'Blocked',
    riskScore: 94,
    disruptionReason: 'Massive mudslide & rockfall blocking both carriageways at Sonapur Tunnel portal (KM 132). 60m sludge.',
    detourAvailable: true,
    detourRouteName: 'Alternate Haflong-Umrangso bypass (NH-27 / SH-19)',
    lengthKm: 312,
    lanes: '2-Lane Hill Corridor',
    avgSpeedKmH: 0,
    clearanceEta: 'Est. Clearance: 6h 30m',
    trafficVolume: '8,450 PCU/day',
    lastUpdated: '12m ago (SAR Radar)'
  },
  {
    id: 'seg-nh27-east-west',
    name: 'NH-27 East-West Expressway (Guwahati - Nagaon - Lumding)',
    code: 'NH-27',
    state: 'Assam',
    coordinates: [
      [26.1445, 91.7362],
      [26.1900, 92.0500],
      [26.3400, 92.6800],
      [25.8500, 92.9500],
      [25.1700, 93.0200],
      [24.8170, 92.8000]
    ],
    status: 'Open',
    riskScore: 18,
    detourAvailable: true,
    detourRouteName: 'Primary Safe AI Detour to Barak Valley',
    lengthKm: 374,
    lanes: '4-Lane Divided Expressway',
    avgSpeedKmH: 68,
    clearanceEta: 'Free Flowing',
    trafficVolume: '22,400 PCU/day',
    lastUpdated: 'Live Telemetry'
  },
  {
    id: 'seg-nh10-teesta',
    name: 'NH-10 Sevoke - Teesta Gorge - Gangtok Corridor',
    code: 'NH-10',
    state: 'Sikkim',
    coordinates: [
      [26.7271, 88.4312],
      [26.8800, 88.4700],
      [27.0500, 88.5200],
      [27.1800, 88.5300],
      [27.3389, 88.6065]
    ],
    status: 'Caution',
    riskScore: 74,
    disruptionReason: 'Teesta river embankment scour at 29th Mile. Active single-lane alternating convoy guided by SDRF.',
    detourAvailable: true,
    detourRouteName: 'Lava-Algarah-Reshi alternative corridor (NH-717A)',
    lengthKm: 114,
    lanes: '2-Lane River Gorge',
    avgSpeedKmH: 24,
    clearanceEta: 'Speed Restricted 20 km/h',
    trafficVolume: '6,100 PCU/day',
    lastUpdated: '8m ago (CCTV Feed)'
  },
  {
    id: 'seg-nh13-sela',
    name: 'NH-13 Trans-Arunachal Highway (Tezpur - Sela Pass - Tawang)',
    code: 'NH-13',
    state: 'Arunachal Pradesh',
    coordinates: [
      [26.6500, 92.8000],
      [27.0100, 92.6300],
      [27.3500, 92.2400],
      [27.5000, 92.1000],
      [27.5861, 91.8594]
    ],
    status: 'Caution',
    riskScore: 68,
    disruptionReason: 'High mountain icing and dense zero-visibility fog near Sela Tunnel switchbacks (4,170m MSL).',
    detourAvailable: false,
    lengthKm: 340,
    lanes: '2-Lane Mountain Highway',
    avgSpeedKmH: 28,
    clearanceEta: 'Chains Mandatory at Sela',
    trafficVolume: '2,900 PCU/day',
    lastUpdated: '15m ago (BRO Post)'
  },
  {
    id: 'seg-nh29-dimapur-kohima',
    name: 'NH-29 Dimapur - Kohima 4-Lane Trunk Corridor',
    code: 'NH-29',
    state: 'Nagaland',
    coordinates: [
      [25.9000, 93.7300],
      [25.7500, 93.9000],
      [25.6751, 94.1086]
    ],
    status: 'Open',
    riskScore: 16,
    detourAvailable: true,
    detourRouteName: 'Old Zubza bypass feeder',
    lengthKm: 74,
    lanes: '4-Lane Engineered Highway',
    avgSpeedKmH: 52,
    clearanceEta: 'Normal Flow',
    trafficVolume: '11,200 PCU/day',
    lastUpdated: 'Live Telemetry'
  },
  {
    id: 'seg-nh37-silchar-imphal',
    name: 'NH-37 Silchar - Jiribam - Makru - Imphal Arterial',
    code: 'NH-37',
    state: 'Manipur',
    coordinates: [
      [24.8170, 92.8000],
      [24.8000, 93.1200],
      [24.7800, 93.5000],
      [24.8170, 93.9368]
    ],
    status: 'Caution',
    riskScore: 62,
    disruptionReason: 'Minor embankment slip at Irang Bridge approach. Light commercial vehicles permitted with convoy.',
    detourAvailable: false,
    lengthKm: 220,
    lanes: '2-Lane Hill Arterial',
    avgSpeedKmH: 34,
    clearanceEta: 'Convoy Managed',
    trafficVolume: '4,800 PCU/day',
    lastUpdated: '22m ago'
  },
  {
    id: 'seg-nh306-aizawl',
    name: 'NH-306 Silchar - Kolasib - Aizawl Gateway',
    code: 'NH-306',
    state: 'Mizoram',
    coordinates: [
      [24.8170, 92.8000],
      [24.2000, 92.7500],
      [23.7271, 92.7176]
    ],
    status: 'Open',
    riskScore: 22,
    detourAvailable: false,
    lengthKm: 130,
    lanes: '2-Lane Hilly Paved',
    avgSpeedKmH: 42,
    clearanceEta: 'Normal Flow',
    trafficVolume: '5,300 PCU/day',
    lastUpdated: 'Live Telemetry'
  },
  {
    id: 'seg-nh8-tripura',
    name: 'NH-8 Churaibari - Teliamura - Agartala Lifeline',
    code: 'NH-8',
    state: 'Tripura',
    coordinates: [
      [24.8170, 92.8000],
      [24.3000, 92.2000],
      [23.8315, 91.2868]
    ],
    status: 'Open',
    riskScore: 14,
    detourAvailable: true,
    detourRouteName: 'Alternative Kailashahar-Khowai bypass',
    lengthKm: 198,
    lanes: '2-Lane Heavy Freight',
    avgSpeedKmH: 56,
    clearanceEta: 'Normal Flow',
    trafficVolume: '9,800 PCU/day',
    lastUpdated: 'Live Telemetry'
  }
];

export const INITIAL_FLEETS: VehicleFleet[] = [
  {
    id: 'flt-101',
    vehicleNumber: 'AS-01-GC-4921',
    driverName: 'Pranab Kalita',
    cargoType: 'Medical & Vaccines',
    origin: 'Guwahati Logistics Hub',
    destination: 'Silchar Civil Depot',
    status: 'Rerouted',
    coordinates: [25.7800, 92.7500],
    speedKmH: 34,
    etaMin: 180,
    riskLevel: 'High'
  },
  {
    id: 'flt-102',
    vehicleNumber: 'ML-05-D-8824',
    driverName: 'Banteilang Khongwir',
    cargoType: 'Fresh Produce / FMCG',
    origin: 'Shillong Wholesale',
    destination: 'Guwahati Mandi',
    status: 'On Schedule',
    coordinates: [25.9000, 91.8200],
    speedKmH: 52,
    etaMin: 55,
    riskLevel: 'Low'
  },
  {
    id: 'flt-103',
    vehicleNumber: 'AR-01-T-3109',
    driverName: 'Dorjee Thongdok',
    cargoType: 'Telecom Infrastructure',
    origin: 'Tezpur Base',
    destination: 'Tawang Station',
    status: 'Delayed',
    coordinates: [27.3200, 92.2200],
    speedKmH: 22,
    etaMin: 290,
    riskLevel: 'High'
  },
  {
    id: 'flt-104',
    vehicleNumber: 'MN-01-B-7401',
    driverName: 'L. Chaoba Singh',
    cargoType: 'Petroleum & LPG',
    origin: 'Khatkhati Depot',
    destination: 'Imphal Valley Store',
    status: 'On Schedule',
    coordinates: [25.6800, 94.0500],
    speedKmH: 42,
    etaMin: 130,
    riskLevel: 'Low'
  },
  {
    id: 'flt-105',
    vehicleNumber: 'SK-02-X-9905',
    driverName: 'Karma Bhutia',
    cargoType: 'Heavy Machinery Spares',
    origin: 'Siliguri Railhead',
    destination: 'Gangtok Power Grid',
    status: 'Delayed',
    coordinates: [27.1200, 88.5200],
    speedKmH: 18,
    etaMin: 160,
    riskLevel: 'High'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-901',
    title: 'Massive Mudslide at Sonapur Portal',
    type: 'Landslide',
    severity: 'Severe',
    location: 'NH-6, KM Marker 132, East Jaintia Hills',
    districtId: 'dist-east-jaintia',
    districtName: 'East Jaintia Hills',
    timestamp: '18 mins ago',
    coordinates: [25.3117, 92.4285],
    verifiedByAI: true,
    reportsCount: 14,
    description: 'Sludge and heavy boulders covering over 60 meters of double carriageway. Heavy earthmovers deployed by NHAI.'
  },
  {
    id: 'inc-902',
    title: 'River Erosion Scour at 29th Mile',
    type: 'Road Collapse',
    severity: 'High',
    location: 'NH-10 corridor near Teesta Bazar',
    districtId: 'dist-gangtok',
    districtName: 'Gangtok',
    timestamp: '42 mins ago',
    coordinates: [27.1800, 88.5300],
    verifiedByAI: true,
    reportsCount: 8,
    description: 'Swollen Teesta current damaged outer retaining wall. Light vehicle convoy guided one-way.'
  },
  {
    id: 'inc-903',
    title: 'Freezing Fog & Rock Debris at Sela',
    type: 'Fallen Debris',
    severity: 'High',
    location: 'NH-13, Baisakhi to Sela Tunnel approach',
    districtId: 'dist-tawang',
    districtName: 'Tawang & West Kameng',
    timestamp: '1 hour ago',
    coordinates: [27.5000, 92.1000],
    verifiedByAI: true,
    reportsCount: 5,
    description: 'Fresh rocks scattered on sharp hairpin bend. BRO bulldozers actively clearing loose scree.'
  },
  {
    id: 'inc-904',
    title: 'Waterlogging at Khanapara Underpass',
    type: 'Flash Flood',
    severity: 'Moderate',
    location: 'GS Road / Khanapara Flyover intersection',
    districtId: 'dist-kamrup',
    districtName: 'Kamrup Metropolitan (Guwahati)',
    timestamp: '2 hours ago',
    coordinates: [26.1150, 91.8020],
    verifiedByAI: true,
    reportsCount: 22,
    description: 'Flash runoff from Meghalaya hills causing 1.5ft water accumulation. Pumps operational, slow traffic movement.'
  }
];

export const INITIAL_WEATHER: WeatherData[] = [
  {
    districtId: 'dist-east-jaintia',
    districtName: 'East Jaintia Hills (Sonapur)',
    state: 'Meghalaya',
    temperatureC: 21,
    condition: 'Torrential Rain & Thunder',
    rainfallMm: 88.2,
    windSpeedKmh: 42,
    visibilityMeters: 250,
    landslideRiskIndex: 96,
    flashFloodRiskIndex: 91,
    warningLevel: 'Red',
    mountainPassStatus: [
      { passName: 'Sonapur Tunnel Portal', status: 'Blocked', snowOrRain: '88mm Rain / Runoff' },
      { passName: 'Khliehriat Bypass', status: 'Caution', snowOrRain: 'Mud Pools' }
    ]
  },
  {
    districtId: 'dist-tawang',
    districtName: 'Tawang & West Kameng',
    state: 'Arunachal Pradesh',
    temperatureC: 8,
    condition: 'Dense Freezing Mist',
    rainfallMm: 31.0,
    windSpeedKmh: 36,
    visibilityMeters: 180,
    landslideRiskIndex: 82,
    flashFloodRiskIndex: 45,
    warningLevel: 'Orange',
    mountainPassStatus: [
      { passName: 'Sela Pass (4,170m)', status: 'Caution', snowOrRain: 'Sleet / Frost' },
      { passName: 'Nechiphu Tunnel', status: 'Open', snowOrRain: 'Heavy Rain' }
    ]
  },
  {
    districtId: 'dist-gangtok',
    districtName: 'Gangtok & Mangan',
    state: 'Sikkim',
    temperatureC: 15,
    condition: 'Continuous Monsoon Downpour',
    rainfallMm: 52.4,
    windSpeedKmh: 28,
    visibilityMeters: 400,
    landslideRiskIndex: 88,
    flashFloodRiskIndex: 84,
    warningLevel: 'Orange',
    mountainPassStatus: [
      { passName: '29th Mile Teesta', status: 'Caution', snowOrRain: '52mm Rain' },
      { passName: 'Rangpo Gateway', status: 'Open', snowOrRain: 'Moderate Rain' }
    ]
  },
  {
    districtId: 'dist-kamrup',
    districtName: 'Kamrup Metropolitan (Guwahati)',
    state: 'Assam',
    temperatureC: 28,
    condition: 'Scattered Showers',
    rainfallMm: 12.4,
    windSpeedKmh: 14,
    visibilityMeters: 3500,
    landslideRiskIndex: 22,
    flashFloodRiskIndex: 38,
    warningLevel: 'Yellow',
    mountainPassStatus: [
      { passName: 'Brahmaputra Saraighat', status: 'Open', snowOrRain: 'Light Rain' },
      { passName: 'Jorabat Gap', status: 'Caution', snowOrRain: 'Water Accumulation' }
    ]
  }
];

export const INITIAL_KPIS: KPIData = {
  disruptedSegmentsCount: 3,
  disruptedKm: 148,
  networkAccessibilityPct: 83.6,
  activeFleetsCount: 142,
  criticalIncidentsCount: 4,
  avgDelayMinutes: 46,
  aiPredictionConfidence: 94.8,
  reroutingEfficiencyPct: 91.2
};

export const ROUTE_RECOMMENDATIONS: Record<string, RouteOption[]> = {
  'guwahati-silchar': [
    {
      id: 'rt-nh6-direct',
      name: 'Primary NH-6 Corridor (via Shillong & Sonapur)',
      type: 'primary',
      distanceKm: 312,
      durationHours: 8.5,
      riskScore: 92,
      roadQuality: 'Severe Vulnerability',
      coordinates: [
        [26.1445, 91.7362],
        [25.8500, 91.8000],
        [25.5788, 91.8933],
        [25.4300, 92.1500],
        [25.3117, 92.4285],
        [25.0500, 92.6500],
        [24.8170, 92.8000]
      ],
      checkpoints: [
        { name: 'Guwahati Khanapara', status: 'Clear' },
        { name: 'Shillong Bypass', status: 'Clear' },
        { name: 'Sonapur Tunnel', status: 'Blocked' },
        { name: 'Silchar Entry', status: 'Vulnerable' }
      ],
      warningNote: 'CRITICAL: Mudslide block at Sonapur. Estimated clearance time > 6 hours.'
    },
    {
      id: 'rt-ai-alternate',
      name: 'AI Smart Reroute: NH-27 via Nagaon & Haflong (Dima Hasao)',
      type: 'recommended_alternate',
      distanceKm: 374,
      durationHours: 9.8,
      riskScore: 28,
      roadQuality: 'Paved Highway',
      coordinates: [
        [26.1445, 91.7362],
        [26.1900, 92.0500],
        [26.3400, 92.6800],
        [25.8500, 92.9500],
        [25.1700, 93.0200],
        [24.8170, 92.8000]
      ],
      checkpoints: [
        { name: 'Guwahati - Nagaon 4-Lane', status: 'Clear' },
        { name: 'Lumding - Haflong Corridor', status: 'Clear' },
        { name: 'Jatinga Valley Viaduct', status: 'Clear' },
        { name: 'Silchar Northern Bypass', status: 'Clear' }
      ],
      warningNote: 'RECOMMENDED BY NER-SHIELD: 62km longer but 100% passable with 0 landslide bottlenecks.'
    }
  ],
  'guwahati-tawang': [
    {
      id: 'rt-bhalukpong',
      name: 'Direct Route via Bhalukpong & Sela Pass (NH-13)',
      type: 'primary',
      distanceKm: 440,
      durationHours: 12.0,
      riskScore: 78,
      roadQuality: 'Hilly Curvature',
      coordinates: [
        [26.1445, 91.7362],
        [26.6500, 92.8000],
        [27.0100, 92.6300],
        [27.3500, 92.2400],
        [27.5000, 92.1000],
        [27.5861, 91.8594]
      ],
      checkpoints: [
        { name: 'Tezpur Kolia Bhomora', status: 'Clear' },
        { name: 'Bhalukpong Gate', status: 'Clear' },
        { name: 'Sela Tunnel Approach', status: 'Blocked' },
        { name: 'Tawang Base', status: 'Clear' }
      ],
      warningNote: 'CRITICAL: Sela Pass icing and rock debris. Single-lane convoy only.'
    },
    {
      id: 'rt-ai-tawang-detour',
      name: 'AI Recommended: Trans-Arunachal via Kalaktang & Rupa Bypass',
      type: 'recommended_alternate',
      distanceKm: 462,
      durationHours: 11.2,
      riskScore: 32,
      roadQuality: 'Paved Highway',
      coordinates: [
        [26.1445, 91.7362],
        [26.8000, 92.1000],
        [27.1000, 92.1500],
        [27.2500, 92.2000],
        [27.5861, 91.8594]
      ],
      checkpoints: [
        { name: 'Orang - Kalaktang Highway', status: 'Clear' },
        { name: 'Shergaon Valley Bypass', status: 'Clear' },
        { name: 'Dirang Transit Node', status: 'Clear' },
        { name: 'Tawang Civil Depot', status: 'Clear' }
      ],
      warningNote: 'RECOMMENDED BY NER-SHIELD: Avoids Sela scree hazard zone with higher average transit speed.'
    }
  ],
  'guwahati-shillong': [
    {
      id: 'rt-gs-nh6',
      name: 'NH-6 Guwahati-Shillong 4-Lane Expressway',
      type: 'primary',
      distanceKm: 98,
      durationHours: 2.2,
      riskScore: 24,
      roadQuality: 'Paved Highway',
      coordinates: [
        [26.1445, 91.7362],
        [25.9800, 91.7800],
        [25.7500, 91.8800],
        [25.5788, 91.8933]
      ],
      checkpoints: [
        { name: 'Khanapara Hub', status: 'Clear' },
        { name: 'Nongpoh Food Plaza', status: 'Clear' },
        { name: 'Umiam Lake Viewpoint', status: 'Clear' },
        { name: 'Mawlai Shillong Gate', status: 'Clear' }
      ],
      warningNote: 'Expressway open with light rain showers near Nongpoh.'
    },
    {
      id: 'rt-ai-gs-alt',
      name: 'AI Recommended Scenic Detour via Byrnihat - Bhoirymbong',
      type: 'recommended_alternate',
      distanceKm: 112,
      durationHours: 2.8,
      riskScore: 18,
      roadQuality: 'Paved Highway',
      coordinates: [
        [26.1445, 91.7362],
        [26.0200, 91.8500],
        [25.8000, 91.9500],
        [25.5788, 91.8933]
      ],
      checkpoints: [
        { name: 'Byrnihat Industrial Corridor', status: 'Clear' },
        { name: 'Bhoirymbong Airport Link', status: 'Clear' },
        { name: 'Shillong Golf Links Entry', status: 'Clear' }
      ],
      warningNote: 'Zero traffic congestion; heavy vehicle transit recommended.'
    }
  ],
  'guwahati-imphal': [
    {
      id: 'rt-nh29-direct',
      name: 'Primary NH-29 & NH-2 Corridor (via Dimapur & Kohima)',
      type: 'primary',
      distanceKm: 485,
      durationHours: 13.5,
      riskScore: 42,
      roadQuality: 'Hilly Curvature',
      coordinates: [
        [26.1445, 91.7362],
        [26.3400, 92.6800],
        [25.9000, 93.7300],
        [25.6751, 94.1086],
        [24.8170, 93.9368]
      ],
      checkpoints: [
        { name: 'Guwahati - Nagaon 4-Lane', status: 'Clear' },
        { name: 'Dimapur Highway Gateway', status: 'Clear' },
        { name: 'Kohima Heavy Vehicle Bypass', status: 'Vulnerable' },
        { name: 'Mao Gate Border', status: 'Clear' },
        { name: 'Imphal Kangla Hub', status: 'Clear' }
      ],
      warningNote: 'Moderate transit delay at Kohima bypass during peak hours.'
    },
    {
      id: 'rt-ai-imphal-nh37',
      name: 'AI Recommended Multi-Corridor: NH-27 via Silchar & Jiribam (NH-37)',
      type: 'recommended_alternate',
      distanceKm: 520,
      durationHours: 14.0,
      riskScore: 35,
      roadQuality: 'Paved Highway',
      coordinates: [
        [26.1445, 91.7362],
        [26.3400, 92.6800],
        [25.1700, 93.0200],
        [24.8000, 93.1200],
        [24.8170, 93.9368]
      ],
      checkpoints: [
        { name: 'Haflong Mountain Expressway', status: 'Clear' },
        { name: 'Silchar Logistics Hub', status: 'Clear' },
        { name: 'Makru Bridge Corridor', status: 'Clear' },
        { name: 'Noney Railway-Road Nexus', status: 'Clear' },
        { name: 'Imphal Valley Terminal', status: 'Clear' }
      ],
      warningNote: 'RECOMMENDED FOR HEAVY FREIGHT: Modern reinforced bridges and continuous military security convoy.'
    }
  ],
  'siliguri-gangtok': [
    {
      id: 'rt-nh10-teesta-direct',
      name: 'NH-10 Direct via Sevoke & Teesta Gorge',
      type: 'primary',
      distanceKm: 114,
      durationHours: 4.2,
      riskScore: 84,
      roadQuality: 'Severe Vulnerability',
      coordinates: [
        [26.7271, 88.4312],
        [26.8800, 88.4700],
        [27.0500, 88.5200],
        [27.1800, 88.5300],
        [27.3389, 88.6065]
      ],
      checkpoints: [
        { name: 'Sevoke Coronation Bridge', status: 'Clear' },
        { name: 'Teesta Bazar Corridor', status: 'Blocked' },
        { name: 'Rangpo Gateway', status: 'Vulnerable' },
        { name: 'Singtam Junction', status: 'Clear' },
        { name: 'Gangtok Deorali', status: 'Clear' }
      ],
      warningNote: 'CRITICAL: River scour at 29th Mile. Single-lane alternating convoy only.'
    },
    {
      id: 'rt-ai-gangtok-lava',
      name: 'AI Recommended: Alternative Detour via Lava, Algarah & Reshi (NH-717A)',
      type: 'recommended_alternate',
      distanceKm: 142,
      durationHours: 4.8,
      riskScore: 26,
      roadQuality: 'Paved Highway',
      coordinates: [
        [26.7271, 88.4312],
        [26.9500, 88.6200],
        [27.1000, 88.6600],
        [27.2000, 88.6200],
        [27.3389, 88.6065]
      ],
      checkpoints: [
        { name: 'Gorubathan Hill Ascent', status: 'Clear' },
        { name: 'Lava Pine Ridge', status: 'Clear' },
        { name: 'Reshi Border Bridge', status: 'Clear' },
        { name: 'Rhenock - Gangtok Bypass', status: 'Clear' }
      ],
      warningNote: 'RECOMMENDED BY NER-SHIELD: Completely avoids flooded Teesta gorge with 100% uptime.'
    }
  ]
};

// API Service Layer
class APIService {
  private isDemoMode: boolean = false; // Default to LIVE TELEMETRY
  private apiBaseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  constructor() {
    this.checkBackendHealth();
  }

  private async checkBackendHealth(): Promise<void> {
    try {
      const res = await fetch(`${this.apiBaseUrl.replace('/api/v1', '')}/health`, {
        signal: AbortSignal.timeout(1200)
      });
      if (res.ok) {
        console.log('NER-SHIELD: Connected to live FastAPI backend at', this.apiBaseUrl);
      }
    } catch {
      console.log('NER-SHIELD: Running with Open-Meteo & USGS Live APIs + Supabase Realtime Telemetry.');
    }
  }

  getDemoMode(): boolean {
    return this.isDemoMode;
  }

  setDemoMode(enabled: boolean): void {
    this.isDemoMode = enabled;
  }

  async refreshAllLiveData(): Promise<{ districts: District[]; weather: WeatherData[] }> {
    liveWeatherService.clearCache();
    const weather = await liveWeatherService.fetchAllLiveWeather(true);
    const districts = await this.getDistricts();
    return { districts, weather };
  }

  async getDistricts(): Promise<District[]> {
    const spDistricts = await supabaseService.getDistricts();
    if (spDistricts && spDistricts.length > 0) {
      return spDistricts;
    }
    // Enrich INITIAL_DISTRICTS with live weather telemetry from Open-Meteo
    try {
      const liveWeatherList = await liveWeatherService.fetchAllLiveWeather();
      return INITIAL_DISTRICTS.map(d => {
        const liveW = liveWeatherList.find(w => w.districtId === d.id);
        if (liveW) {
          return {
            ...d,
            weatherSummary: `${liveW.condition}, ${liveW.temperatureC}°C`,
            rainfallMm: liveW.rainfallMm,
            riskLevel: liveW.warningLevel === 'Red' ? 'Severe' : liveW.warningLevel === 'Orange' ? 'High' : liveW.warningLevel === 'Yellow' ? 'Moderate' : 'Low',
            accessibilityScore: Math.max(20, 100 - Math.round(liveW.landslideRiskIndex * 0.6 + liveW.flashFloodRiskIndex * 0.3))
          };
        }
        return d;
      });
    } catch {
      return INITIAL_DISTRICTS;
    }
  }

  async getRoadSegments(): Promise<RoadSegment[]> {
    const spRoads = await supabaseService.getRoadSegments();
    if (spRoads && spRoads.length > 0) {
      return spRoads;
    }
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${this.apiBaseUrl}/roads`);
        if (res.ok) return await res.json();
      } catch {
        // Fallback cleanly
      }
    }
    return INITIAL_ROAD_SEGMENTS;
  }

  async getVehicles(): Promise<VehicleFleet[]> {
    const spVehicles = await supabaseService.getVehicles();
    if (spVehicles && spVehicles.length > 0) {
      return spVehicles;
    }
    if (!this.isDemoMode) {
      try {
        const res = await fetch(`${this.apiBaseUrl}/vehicles`);
        if (res.ok) return await res.json();
      } catch {
        // Fallback cleanly
      }
    }
    return INITIAL_FLEETS;
  }

  async getIncidents(): Promise<Incident[]> {
    const spIncidents = await supabaseService.getIncidents();
    const map = new Map<string, Incident>();
    INITIAL_INCIDENTS.forEach(inc => map.set(inc.id, inc));
    if (spIncidents && spIncidents.length > 0) {
      spIncidents.forEach(inc => map.set(inc.id, inc));
    }
    return Array.from(map.values());
  }

  async getWeather(districtId?: string): Promise<WeatherData[]> {
    try {
      const liveList = await liveWeatherService.fetchAllLiveWeather();
      if (districtId) {
        const match = liveList.find(w => w.districtId === districtId);
        return match ? [match] : [liveList[0]];
      }
      return liveList;
    } catch {
      if (districtId) {
        const match = INITIAL_WEATHER.find(w => w.districtId === districtId);
        return match ? [match] : [INITIAL_WEATHER[0]];
      }
      return INITIAL_WEATHER;
    }
  }

  async getKPIs(): Promise<KPIData> {
    return INITIAL_KPIS;
  }

  async getRouteRecommendation(origin: string, destination: string): Promise<RouteOption[]> {
    const key = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
    if (ROUTE_RECOMMENDATIONS[key]) {
      return ROUTE_RECOMMENDATIONS[key];
    }
    // Reverse key check
    const revKey = `${destination.toLowerCase()}-${origin.toLowerCase()}`;
    if (ROUTE_RECOMMENDATIONS[revKey]) {
      return ROUTE_RECOMMENDATIONS[revKey];
    }

    // Attempt resolved hub keys
    const oNode = getDistrictCityNode(origin);
    const dNode = getDistrictCityNode(destination);
    const resolvedKey = `${oNode.toLowerCase()}-${dNode.toLowerCase()}`;
    if (ROUTE_RECOMMENDATIONS[resolvedKey]) {
      return ROUTE_RECOMMENDATIONS[resolvedKey];
    }
    const resolvedRevKey = `${dNode.toLowerCase()}-${oNode.toLowerCase()}`;
    if (ROUTE_RECOMMENDATIONS[resolvedRevKey]) {
      return ROUTE_RECOMMENDATIONS[resolvedRevKey];
    }

    // Dynamic coordinates dictionary for NER nodes
    const cityCoords: Record<string, [number, number]> = {
      guwahati: [26.1445, 91.7362],
      shillong: [25.5788, 91.8933],
      silchar: [24.8170, 92.8000],
      tawang: [27.5861, 91.8594],
      imphal: [24.8170, 93.9368],
      aizawl: [23.7271, 92.7176],
      kohima: [25.6751, 94.1086],
      dimapur: [25.9000, 93.7300],
      gangtok: [27.3389, 88.6065],
      siliguri: [26.7271, 88.4312],
      tezpur: [26.6500, 92.8000]
    };

    const oCoord = cityCoords[origin.toLowerCase()] || [26.1445, 91.7362];
    const dCoord = cityCoords[destination.toLowerCase()] || [24.8170, 92.8000];
    const mid1: [number, number] = [(oCoord[0] + dCoord[0]) / 2 + 0.15, (oCoord[1] + dCoord[1]) / 2 - 0.2];
    const mid2: [number, number] = [(oCoord[0] + dCoord[0]) / 2 - 0.15, (oCoord[1] + dCoord[1]) / 2 + 0.2];

    return [
      {
        id: `rt-${origin.toLowerCase()}-${destination.toLowerCase()}-primary`,
        name: `Primary Direct Corridor: ${origin} to ${destination}`,
        type: 'primary',
        distanceKm: 280,
        durationHours: 7.2,
        riskScore: 76,
        roadQuality: 'Hilly Curvature',
        coordinates: [oCoord, mid1, dCoord],
        checkpoints: [
          { name: `${origin} Exit Transit Hub`, status: 'Clear' },
          { name: 'Mountain Chokepoint Pass', status: 'Blocked' },
          { name: `${destination} Terminal Approach`, status: 'Clear' }
        ],
        warningNote: `Caution: Severe rockfall vulnerability detected along direct mountain pass.`
      },
      {
        id: `rt-${origin.toLowerCase()}-${destination.toLowerCase()}-ai-detour`,
        name: `AI Safe Detour via Valley Bypass: ${origin} to ${destination}`,
        type: 'recommended_alternate',
        distanceKm: 315,
        durationHours: 7.6,
        riskScore: 22,
        roadQuality: 'Paved Highway',
        coordinates: [oCoord, mid2, dCoord],
        checkpoints: [
          { name: `${origin} Express Connector`, status: 'Clear' },
          { name: 'Reinforced Valley Bypass Viaduct', status: 'Clear' },
          { name: `${destination} Safe Gateway`, status: 'Clear' }
        ],
        warningNote: `RECOMMENDED BY NER-SHIELD: 100% passable road with automated landslide avoidance.`
      }
    ];
  }

  async reportIncident(incidentData: Omit<Incident, 'id' | 'timestamp' | 'verifiedByAI' | 'reportsCount'>): Promise<Incident> {
    const newIncident: Incident = {
      ...incidentData,
      id: `inc-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      verifiedByAI: true,
      reportsCount: 1
    };
    INITIAL_INCIDENTS.unshift(newIncident);
    await supabaseService.saveIncident(newIncident);
    return newIncident;
  }
}

export const apiService = new APIService();

export function getDistrictCityNode(input: string): string {
  if (!input) return 'Guwahati';
  const lower = input.toLowerCase();
  if (lower.includes('shillong') || lower.includes('khasi') || lower.includes('dist-east-khasi')) return 'Shillong';
  if (lower.includes('silchar') || lower.includes('cachar') || lower.includes('jaintia') || lower.includes('sonapur') || lower.includes('dist-east-jaintia') || lower.includes('dist-cachar')) return 'Silchar';
  if (lower.includes('tawang') || lower.includes('kameng') || lower.includes('dist-tawang')) return 'Tawang';
  if (lower.includes('imphal') || lower.includes('noney') || lower.includes('dist-imphal-west') || lower.includes('dist-noney')) return 'Imphal';
  if (lower.includes('aizawl') || lower.includes('kolasib') || lower.includes('lunglei') || lower.includes('dist-aizawl')) return 'Aizawl';
  if (lower.includes('kohima') || lower.includes('dist-kohima')) return 'Kohima';
  if (lower.includes('dimapur')) return 'Dimapur';
  if (lower.includes('gangtok') || lower.includes('sikkim') || lower.includes('mangan') || lower.includes('dist-gangtok')) return 'Gangtok';
  if (lower.includes('siliguri')) return 'Siliguri';
  if (lower.includes('tezpur')) return 'Tezpur';
  if (lower.includes('agartala') || lower.includes('tripura') || lower.includes('dist-west-tripura')) return 'Agartala';
  if (lower.includes('haflong') || lower.includes('dima hasao') || lower.includes('dist-dima-hasao')) return 'Silchar';
  return 'Guwahati';
}
