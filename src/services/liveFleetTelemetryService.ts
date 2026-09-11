import type { VehicleFleet, LiveTelemetryPacket, LiveTelemetryStats } from '../types';

interface RouteTrack {
  highwayCode: string;
  name: string;
  waypoints: [number, number][]; // [lat, lon]
  altitudes: number[]; // Altitude in meters at each waypoint
  baseSpeed: number; // km/h
  isDisrupted?: boolean;
}

// Authentic North East arterial highway routes with dense waypoints for smooth GPS interpolation
const TRACKS: Record<string, RouteTrack> = {
  'flt-101': {
    highwayCode: 'NH-6 / NH-27 Detour',
    name: 'Guwahati - Jowai - Sonapur - Silchar Corridor',
    waypoints: [
      [26.1445, 91.7362], // Guwahati
      [26.0120, 91.7940],
      [25.8850, 91.8210],
      [25.6980, 91.8750],
      [25.5788, 91.8933], // Shillong
      [25.4850, 92.0520],
      [25.4300, 92.1500], // Jowai
      [25.3620, 92.2980],
      [25.3117, 92.4285], // Sonapur Tunnel Portal (Hazard Area)
      [25.2100, 92.5400],
      [25.0500, 92.6500],
      [24.9200, 92.7400],
      [24.8170, 92.8000]  // Silchar
    ],
    altitudes: [55, 320, 780, 1240, 1525, 1380, 1280, 1050, 890, 640, 310, 140, 35],
    baseSpeed: 38,
    isDisrupted: true
  },
  'flt-102': {
    highwayCode: 'NH-40',
    name: 'Shillong - Umroi - Guwahati Express Arterial',
    waypoints: [
      [25.5788, 91.8933], // Shillong
      [25.6800, 91.8700], // Barapani / Umiam
      [25.7500, 91.8500],
      [25.8500, 91.8300], // Nongpoh
      [25.9500, 91.8000],
      [26.0500, 91.7700], // Khanapara
      [26.1445, 91.7362]  // Guwahati Wholesale Mandi
    ],
    altitudes: [1525, 1020, 880, 520, 310, 110, 55],
    baseSpeed: 56
  },
  'flt-103': {
    highwayCode: 'NH-13',
    name: 'Tezpur - Bhalukpong - Sela Pass - Tawang',
    waypoints: [
      [26.6500, 92.8000], // Tezpur Base
      [26.8500, 92.7200], // Bhalukpong Gateway
      [27.0100, 92.6300], // Rupa Valley
      [27.2600, 92.4200], // Bomdila (2,200m)
      [27.3500, 92.2400], // Dirang
      [27.5000, 92.1000], // Sela Pass Switchbacks (4,170m)
      [27.5500, 91.9800], // Jaswant Garh
      [27.5861, 91.8594]  // Tawang Station
    ],
    altitudes: [75, 210, 890, 2210, 1600, 4170, 3200, 3048],
    baseSpeed: 26,
    isDisrupted: true
  },
  'flt-104': {
    highwayCode: 'NH-29',
    name: 'Khatkhati - Dimapur - Kohima - Imphal Trunk',
    waypoints: [
      [26.0200, 93.6500], // Khatkhati Fuel Depot
      [25.9000, 93.7300], // Dimapur
      [25.8200, 93.8200], // Medziphema
      [25.7500, 93.9000], // Zubza
      [25.6751, 94.1086], // Kohima
      [25.5500, 94.0800], // Mao Gate
      [25.2800, 93.9800], // Senapati
      [25.0200, 93.9500], // Kangpokpi
      [24.8170, 93.9368]  // Imphal Valley Store
    ],
    altitudes: [140, 145, 360, 820, 1444, 1620, 1050, 920, 786],
    baseSpeed: 48
  },
  'flt-105': {
    highwayCode: 'NH-10',
    name: 'Siliguri Railhead - Teesta Gorge - Gangtok',
    waypoints: [
      [26.7271, 88.4312], // Siliguri Junction
      [26.8800, 88.4700], // Sevoke Coronation Bridge
      [26.9800, 88.4900], // Kalijhora
      [27.0500, 88.5200], // Teesta Bazar (Scour Alert Zone)
      [27.1800, 88.5300], // Rangpo Border Checkpost
      [27.2400, 88.5600], // Singtam
      [27.3000, 88.5900], // Ranipool
      [27.3389, 88.6065]  // Gangtok Power Grid
    ],
    altitudes: [120, 210, 340, 480, 620, 880, 1200, 1650],
    baseSpeed: 24,
    isDisrupted: true
  },
  'flt-106': {
    highwayCode: 'NH-27',
    name: 'Guwahati - Nagaon - Lumding Quick Express',
    waypoints: [
      [26.1445, 91.7362], // Guwahati
      [26.1900, 92.0500], // Sonapur Assam
      [26.2400, 92.3500], // Jagiroad
      [26.3400, 92.6800], // Nagaon Bypass
      [26.1200, 92.8900], // Doboka
      [25.8500, 92.9500], // Lumding Junction
      [25.1700, 93.0200]  // Haflong Railhead
    ],
    altitudes: [55, 60, 68, 72, 95, 130, 680],
    baseSpeed: 68
  }
};

interface FleetInternalState {
  fleet: VehicleFleet;
  track: RouteTrack;
  segmentIndex: number;
  segmentProgress: number; // 0.0 to 1.0 between waypoints
  direction: 1 | -1; // 1 = forward, -1 = reverse
  currentAltitude: number;
  currentHeading: number;
  odometer: number;
  packetsSent: number;
}

class LiveFleetTelemetryService {
  private fleetStates: Map<string, FleetInternalState> = new Map();
  private timer: number | null = null;
  private isRunning: boolean = false;
  private speedMultiplier: number = 1;
  private totalPacketsReceived: number = 2480;
  private recentPackets: LiveTelemetryPacket[] = [];
  private fleetSubscribers: Set<(fleets: VehicleFleet[]) => void> = new Set();
  private packetSubscribers: Set<(packet: LiveTelemetryPacket) => void> = new Set();
  private statsSubscribers: Set<(stats: LiveTelemetryStats) => void> = new Set();

  constructor() {
    this.initializeFleets();
  }

  private calculateHeading(p1: [number, number], p2: [number, number]): number {
    const lat1 = (p1[0] * Math.PI) / 180;
    const lat2 = (p2[0] * Math.PI) / 180;
    const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const rad = Math.atan2(y, x);
    const deg = (rad * 180) / Math.PI;
    return Math.round((deg + 360) % 360);
  }

  private interpolateCoords(p1: [number, number], p2: [number, number], t: number): [number, number] {
    const lat = p1[0] + (p2[0] - p1[0]) * t;
    const lon = p1[1] + (p2[1] - p1[1]) * t;
    return [Number(lat.toFixed(5)), Number(lon.toFixed(5))];
  }

  private initializeFleets() {
    const initialDefinitions: Omit<VehicleFleet, 'coordinates' | 'speedKmH' | 'etaMin' | 'headingDeg' | 'altitudeM'>[] = [
      {
        id: 'flt-101',
        vehicleNumber: 'AS-01-GC-4921',
        driverName: 'Pranab Kalita',
        cargoType: 'Medical & Vaccines',
        origin: 'Guwahati Logistics Hub',
        destination: 'Silchar Civil Depot',
        status: 'Rerouted',
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
        riskLevel: 'High'
      },
      {
        id: 'flt-106',
        vehicleNumber: 'AS-03-BC-1144',
        driverName: 'Dipankar Barua',
        cargoType: 'Disaster Relief Rations',
        origin: 'Guwahati Central Depot',
        destination: 'Haflong Relief Hub',
        status: 'On Schedule',
        riskLevel: 'Low'
      }
    ];

    initialDefinitions.forEach((def, index) => {
      const track = TRACKS[def.id] || TRACKS['flt-101'];
      // Stagger start position along waypoints
      const startSeg = Math.min(index * 2, track.waypoints.length - 2);
      const startProg = 0.25;
      const p1 = track.waypoints[startSeg];
      const p2 = track.waypoints[startSeg + 1];
      const coords = this.interpolateCoords(p1, p2, startProg);
      const heading = this.calculateHeading(p1, p2);
      const alt = track.altitudes[startSeg] || 500;

      const fleet: VehicleFleet = {
        ...def,
        coordinates: coords,
        speedKmH: track.baseSpeed,
        etaMin: 120 + index * 35,
        headingDeg: heading,
        altitudeM: alt,
        odometerKm: 1420 + index * 320,
        lastTelemetryPing: 'Just now',
        satelliteCount: 14 + (index % 3),
        signalStrengthPct: 98 - (index * 2),
        currentHighway: track.highwayCode,
        recentBreadcrumbs: [coords]
      };

      this.fleetStates.set(def.id, {
        fleet,
        track,
        segmentIndex: startSeg,
        segmentProgress: startProg,
        direction: 1,
        currentAltitude: alt,
        currentHeading: heading,
        odometer: fleet.odometerKm || 1420,
        packetsSent: 150 + index * 40
      });
    });

    // Seed initial rolling packets log
    this.seedInitialPackets();
  }

  private seedInitialPackets() {
    const now = Date.now();
    const packets: LiveTelemetryPacket[] = [];
    const states = Array.from(this.fleetStates.values());

    for (let i = 20; i >= 0; i--) {
      const state = states[i % states.length];
      const timeStr = new Date(now - i * 1800).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      packets.push({
        packetId: `PKT-${9000 + i}`,
        timestamp: timeStr,
        vehicleId: state.fleet.id,
        vehicleNumber: state.fleet.vehicleNumber,
        driverName: state.fleet.driverName,
        cargoType: state.fleet.cargoType,
        coordinates: state.fleet.coordinates,
        speedKmH: state.fleet.speedKmH,
        headingDeg: state.currentHeading,
        altitudeM: state.currentAltitude,
        status: state.fleet.status,
        highwayCode: state.track.highwayCode,
        satelliteCount: state.fleet.satelliteCount || 14,
        signalPct: state.fleet.signalStrengthPct || 98,
        latencyMs: 32 + (i % 12)
      });
    }
    this.recentPackets = packets;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Tick every 1500ms for realistic GPS streaming
    this.timer = window.setInterval(() => {
      this.tick();
    }, 1500);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.notifyStats();
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  public setSpeedMultiplier(mult: number) {
    this.speedMultiplier = Math.max(1, Math.min(10, mult));
    this.notifyStats();
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  private tick() {
    const updatedFleets: VehicleFleet[] = [];
    const timestampStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    this.fleetStates.forEach((state) => {
      const { track } = state;
      const waypoints = track.waypoints;
      const altitudes = track.altitudes;

      // Realistic speed modulation with mountain & hazard dynamics
      let speedVariance = (Math.random() - 0.5) * 4; // jitter
      let targetSpeed = track.baseSpeed + speedVariance;

      // Speed reductions for high passes or disrupted highways
      if (track.isDisrupted) {
        targetSpeed = Math.max(15, targetSpeed * 0.75);
      }
      if (state.currentAltitude > 2000) {
        targetSpeed = Math.max(18, targetSpeed * 0.65); // high pass slowing
      }
      targetSpeed = Math.round(targetSpeed);

      // Distance step per tick: (speed km/h) * (1.5 sec / 3600 sec) * multiplier
      // Typical segment distance is ~15-40 km, so we step proportionally
      const stepProg = (0.015 + (targetSpeed / 100) * 0.02) * this.speedMultiplier;

      state.segmentProgress += stepProg * state.direction;

      // Check if reached end of current waypoint segment
      if (state.direction === 1 && state.segmentProgress >= 1.0) {
        state.segmentIndex++;
        state.segmentProgress = 0.0;
        if (state.segmentIndex >= waypoints.length - 1) {
          // Reached destination! Reverse or loop back for continuous monitoring
          state.segmentIndex = waypoints.length - 2;
          state.direction = -1;
          state.fleet.status = 'On Schedule';
        }
      } else if (state.direction === -1 && state.segmentProgress <= 0.0) {
        state.segmentIndex--;
        state.segmentProgress = 1.0;
        if (state.segmentIndex < 0) {
          state.segmentIndex = 0;
          state.direction = 1;
        }
      }

      const p1 = waypoints[state.segmentIndex];
      const p2 = waypoints[state.segmentIndex + 1];

      if (p1 && p2) {
        const nextCoords = this.interpolateCoords(p1, p2, state.segmentProgress);
        const heading = state.direction === 1 
          ? this.calculateHeading(p1, p2) 
          : this.calculateHeading(p2, p1);

        const alt1 = altitudes[state.segmentIndex] || 200;
        const alt2 = altitudes[state.segmentIndex + 1] || alt1;
        const nextAlt = Math.round(alt1 + (alt2 - alt1) * state.segmentProgress);

        state.currentHeading = heading;
        state.currentAltitude = nextAlt;
        state.odometer += (targetSpeed * 1.5) / 3600;

        // Maintain up to 8 recent breadcrumbs for visual GPS path trail
        const crumbs = state.fleet.recentBreadcrumbs || [];
        crumbs.unshift(nextCoords);
        if (crumbs.length > 8) crumbs.pop();

        // Dynamically compute remaining ETA minutes based on remaining waypoints
        const remainingSegments = state.direction === 1 
          ? (waypoints.length - 1 - state.segmentIndex)
          : state.segmentIndex;
        const dynamicEta = Math.max(8, Math.round(remainingSegments * 22 + (1.0 - state.segmentProgress) * 20));

        state.fleet = {
          ...state.fleet,
          coordinates: nextCoords,
          speedKmH: targetSpeed,
          etaMin: dynamicEta,
          headingDeg: heading,
          altitudeM: nextAlt,
          odometerKm: Number(state.odometer.toFixed(1)),
          lastTelemetryPing: `${timestampStr} (Live Telemetry)`,
          satelliteCount: 14 + Math.floor(Math.random() * 3),
          signalStrengthPct: Math.min(99, Math.max(88, 97 + Math.floor(Math.random() * 3) - (nextAlt > 2500 ? 5 : 0))),
          recentBreadcrumbs: crumbs
        };
      }

      state.packetsSent++;
      this.totalPacketsReceived++;

      // Create live telemetry packet
      const packet: LiveTelemetryPacket = {
        packetId: `PKT-${this.totalPacketsReceived}`,
        timestamp: timestampStr,
        vehicleId: state.fleet.id,
        vehicleNumber: state.fleet.vehicleNumber,
        driverName: state.fleet.driverName,
        cargoType: state.fleet.cargoType,
        coordinates: state.fleet.coordinates,
        speedKmH: state.fleet.speedKmH,
        headingDeg: state.currentHeading,
        altitudeM: state.currentAltitude,
        status: state.fleet.status,
        highwayCode: state.track.highwayCode,
        satelliteCount: state.fleet.satelliteCount || 14,
        signalPct: state.fleet.signalStrengthPct || 98,
        latencyMs: Math.round(28 + Math.random() * 16)
      };

      this.recentPackets.unshift(packet);
      if (this.recentPackets.length > 60) this.recentPackets.pop();

      // Emit single packet to listeners
      this.notifyPacket(packet);
      updatedFleets.push(state.fleet);
    });

    // Emit all updated fleets
    this.notifyFleets(updatedFleets);
    this.notifyStats();
  }

  // Subscriber pattern
  public subscribeToFleets(callback: (fleets: VehicleFleet[]) => void): () => void {
    this.fleetSubscribers.add(callback);
    callback(this.getVehicles());
    return () => this.fleetSubscribers.delete(callback);
  }

  public subscribeToPackets(callback: (packet: LiveTelemetryPacket) => void): () => void {
    this.packetSubscribers.add(callback);
    return () => this.packetSubscribers.delete(callback);
  }

  public subscribeToStats(callback: (stats: LiveTelemetryStats) => void): () => void {
    this.statsSubscribers.add(callback);
    callback(this.getStats());
    return () => this.statsSubscribers.delete(callback);
  }

  private notifyFleets(fleets: VehicleFleet[]) {
    this.fleetSubscribers.forEach((cb) => cb(fleets));
  }

  private notifyPacket(packet: LiveTelemetryPacket) {
    this.packetSubscribers.forEach((cb) => cb(packet));
  }

  private notifyStats() {
    const stats = this.getStats();
    this.statsSubscribers.forEach((cb) => cb(stats));
  }

  public getVehicles(): VehicleFleet[] {
    return Array.from(this.fleetStates.values()).map((s) => s.fleet);
  }

  public getRecentPackets(): LiveTelemetryPacket[] {
    return [...this.recentPackets];
  }

  public getStats(): LiveTelemetryStats {
    const movingCount = Array.from(this.fleetStates.values()).filter((s) => s.fleet.speedKmH > 0).length;
    return {
      isStreaming: this.isRunning,
      packetsReceivedTotal: this.totalPacketsReceived,
      packetsPerSecond: this.isRunning ? Math.round(this.fleetStates.size * (1 / 1.5) * 10) / 10 : 0,
      activeSatellites: 14,
      averageLatencyMs: 34,
      signalIntegrityPct: 98.4,
      lastHeartbeat: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      movingFleetsCount: movingCount,
      speedMultiplier: this.speedMultiplier
    };
  }
}

export const liveFleetTelemetryService = new LiveFleetTelemetryService();
