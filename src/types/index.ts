export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export type RoadStatus = 'Open' | 'Caution' | 'Blocked';

export type FleetStatus = 'On Schedule' | 'Delayed' | 'Rerouted' | 'Halted';

export type IncidentType = 'Landslide' | 'Flash Flood' | 'Road Collapse' | 'Bridge Damage' | 'Fallen Debris' | 'Heavy Fog';

export interface District {
  id: string;
  name: string;
  state: string;
  accessibilityScore: number; // 0 - 100
  riskLevel: RiskLevel;
  activeIncidents: number;
  majorHighway: string;
  elevation: string;
  weatherSummary: string;
  rainfallMm: number;
  roadStatus: RoadStatus;
  coordinates: [number, number]; // [lat, lng]
  historicalDisruptions: { month: string; incidents: number }[];
  emergencyContacts: { service: string; number: string }[];
  keyPasses: string[];
}

export interface RoadSegment {
  id: string;
  name: string;
  code: string;
  state: string;
  coordinates: [number, number][];
  status: RoadStatus;
  riskScore: number; // 0 - 100
  disruptionReason?: string;
  detourAvailable: boolean;
  detourRouteName?: string;
  lengthKm: number;
  lanes: string;
  avgSpeedKmH: number;
  clearanceEta?: string;
  trafficVolume: string;
  lastUpdated: string;
}

export interface VehicleFleet {
  id: string;
  vehicleNumber: string;
  driverName: string;
  cargoType: string;
  origin: string;
  destination: string;
  status: FleetStatus;
  coordinates: [number, number];
  speedKmH: number;
  etaMin: number;
  riskLevel: RiskLevel;
  headingDeg?: number;
  altitudeM?: number;
  odometerKm?: number;
  lastTelemetryPing?: string;
  satelliteCount?: number;
  signalStrengthPct?: number;
  recentBreadcrumbs?: [number, number][];
  currentHighway?: string;
}

export interface LiveTelemetryPacket {
  packetId: string;
  timestamp: string;
  vehicleId: string;
  vehicleNumber: string;
  driverName: string;
  cargoType: string;
  coordinates: [number, number];
  speedKmH: number;
  headingDeg: number;
  altitudeM: number;
  status: FleetStatus;
  highwayCode: string;
  satelliteCount: number;
  signalPct: number;
  latencyMs: number;
}

export interface LiveTelemetryStats {
  isStreaming: boolean;
  packetsReceivedTotal: number;
  packetsPerSecond: number;
  activeSatellites: number;
  averageLatencyMs: number;
  signalIntegrityPct: number;
  lastHeartbeat: string;
  movingFleetsCount: number;
  speedMultiplier: number;
}


export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: RiskLevel;
  location: string;
  districtId: string;
  districtName: string;
  timestamp: string;
  coordinates: [number, number];
  verifiedByAI: boolean;
  reportsCount: number;
  description: string;
}

export interface WeatherData {
  districtId: string;
  districtName: string;
  state: string;
  temperatureC: number;
  condition: string;
  rainfallMm: number;
  humidityPct?: number;
  isLive?: boolean;
  lastFetchedTime?: string;
  windSpeedKmh: number;
  visibilityMeters: number;
  landslideRiskIndex: number; // 0 - 100
  flashFloodRiskIndex: number; // 0 - 100
  warningLevel: 'None' | 'Yellow' | 'Orange' | 'Red';
  mountainPassStatus: { passName: string; status: 'Open' | 'Caution' | 'Blocked'; snowOrRain: string }[];
}

export interface KPIData {
  disruptedSegmentsCount: number;
  disruptedKm: number;
  networkAccessibilityPct: number;
  activeFleetsCount: number;
  criticalIncidentsCount: number;
  avgDelayMinutes: number;
  aiPredictionConfidence: number;
  reroutingEfficiencyPct: number;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'primary' | 'recommended_alternate' | 'secondary_alternate';
  distanceKm: number;
  durationHours: number;
  riskScore: number; // 0 - 100
  roadQuality: 'Paved Highway' | 'Hilly Curvature' | 'Severe Vulnerability';
  coordinates: [number, number][];
  checkpoints: { name: string; status: 'Clear' | 'Vulnerable' | 'Blocked' }[];
  warningNote?: string;
}

export interface AuthUser {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: 'Logistics Officer' | 'SDRF Coordinator' | 'Fleet Manager' | 'Field Responder';
  station: string;
  token: string;
}
