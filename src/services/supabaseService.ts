import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { District, Incident, RoadSegment, VehicleFleet } from '../types';
import type { CalamityAlert } from './liveCalamityService';

function normalizeCoordinates(coords: unknown): [number, number] {
  if (!coords) return [25.3117, 92.4285];
  let parsed = coords;
  if (typeof coords === 'string') {
    try {
      parsed = JSON.parse(coords);
    } catch {
      return [25.3117, 92.4285];
    }
  }
  if (Array.isArray(parsed) && parsed.length >= 2) {
    const lat = Number(parsed[0]);
    const lng = Number(parsed[1]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    const lat = Number(obj.lat ?? obj.latitude);
    const lng = Number(obj.lng ?? obj.lon ?? obj.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }
  return [25.3117, 92.4285];
}

export class SupabaseService {
  isConfigured(): boolean {
    return isSupabaseConfigured && Boolean(supabase);
  }

  // 1. Districts
  async getDistricts(): Promise<District[] | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase.from('districts').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map(d => ({
        id: d.id,
        name: d.name,
        state: d.state,
        accessibilityScore: d.accessibility_score,
        riskLevel: d.risk_level,
        activeIncidents: d.active_incidents,
        majorHighway: d.major_highway,
        elevation: d.elevation,
        weatherSummary: d.weather_summary,
        rainfallMm: Number(d.rainfall_mm),
        roadStatus: d.road_status,
        coordinates: [Number(d.latitude), Number(d.longitude)],
        historicalDisruptions: [],
        emergencyContacts: [],
        keyPasses: []
      }));
    } catch {
      return null;
    }
  }

  // 2. Road Segments
  async getRoadSegments(): Promise<RoadSegment[] | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase.from('road_segments').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map(r => ({
        id: r.id,
        name: r.name,
        code: r.code,
        state: r.state,
        status: r.status,
        riskScore: r.risk_score,
        disruptionReason: r.disruption_reason,
        detourAvailable: Boolean(r.detour_available),
        detourRouteName: r.detour_route_name,
        lengthKm: Number(r.length_km),
        lanes: r.lanes,
        avgSpeedKmH: r.avg_speed_kmh,
        clearanceEta: r.clearance_eta,
        trafficVolume: r.traffic_volume,
        coordinates: (Array.isArray(r.coordinates) ? r.coordinates : []) as [number, number][],
        lastUpdated: 'Supabase Live'
      }));
    } catch {
      return null;
    }
  }

  // 3. Vehicle Fleets
  async getVehicles(): Promise<VehicleFleet[] | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase.from('vehicle_fleets').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map(v => ({
        id: v.id,
        vehicleNumber: v.vehicle_number,
        driverName: v.driver_name,
        cargoType: v.cargo_type,
        origin: v.origin,
        destination: v.destination,
        status: v.status,
        coordinates: [Number(v.latitude), Number(v.longitude)],
        speedKmH: Number(v.speed_kmh || 40),
        etaMin: Number(v.eta_min || 120),
        riskLevel: v.risk_level || 'Low',
        lastTelemetryPing: 'Supabase Realtime'
      }));
    } catch {
      return null;
    }
  }

  // 4. Incidents
  async getIncidents(): Promise<Incident[] | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase.from('incidents').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map(i => ({
        id: i.id,
        title: i.title,
        type: i.type,
        severity: i.severity,
        location: i.location,
        districtId: i.district_id,
        districtName: i.district_name,
        timestamp: new Date(i.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coordinates: normalizeCoordinates(i.coordinates),
        verifiedByAI: i.verified_by_ai,
        reportsCount: i.reports_count,
        description: i.description
      }));
    } catch {
      return null;
    }
  }

  async saveIncident(inc: Incident): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured() || !supabase) {
      console.warn('[SupabaseService] Supabase not configured, skipping cloud save');
      return { success: false, error: 'Supabase not configured' };
    }
    try {
      console.log('[SupabaseService] Writing hazard report to Supabase DB:', inc.id, inc.title);
      const { data, error } = await supabase.from('incidents').insert({
        id: inc.id,
        title: inc.title,
        type: inc.type,
        severity: inc.severity,
        location: inc.location,
        district_id: inc.districtId,
        district_name: inc.districtName,
        coordinates: inc.coordinates,
        verified_by_ai: inc.verifiedByAI,
        reports_count: inc.reportsCount,
        description: inc.description
      }).select();

      if (error) {
        console.error('[SupabaseService] Error saving incident to Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('[SupabaseService] Successfully saved incident to Supabase:', data);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[SupabaseService] Exception saving incident to Supabase:', msg);
      return { success: false, error: msg };
    }
  }

  /**
   * Listen in real-time to Hazard Incidents reported across Supabase DB
   */
  subscribeToIncidents(onIncidentReceived: (incident: Incident) => void): () => void {
    if (!this.isConfigured() || !supabase) {
      return () => {};
    }

    const channel = supabase
      .channel('public:incidents_realtime_stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incidents' },
        (payload) => {
          const i = payload.new;
          if (i) {
            console.log('[Supabase Realtime] New hazard incident reported via Postgres Changes:', i.id);
            const incident: Incident = {
              id: i.id,
              title: i.title,
              type: i.type,
              severity: i.severity,
              location: i.location,
              districtId: i.district_id,
              districtName: i.district_name,
              timestamp: 'Just now (Supabase Live)',
              coordinates: normalizeCoordinates(i.coordinates),
              verifiedByAI: i.verified_by_ai,
              reportsCount: i.reports_count || 1,
              description: i.description
            };
            onIncidentReceived(incident);
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }

  // 3. Calamity Alerts & Driver Siren System
  async getActiveCalamityAlerts(): Promise<CalamityAlert[]> {
    if (!this.isConfigured() || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('calamity_alerts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      if (error || !data) return [];
      return data.map(c => ({
        id: c.id,
        title: c.title,
        calamityType: c.calamity_type,
        severity: c.severity,
        location: c.location,
        districtId: c.district_id,
        affectedHighway: c.affected_highway,
        coordinates: [Number(c.latitude || 26.14), Number(c.longitude || 91.73)],
        active: c.active,
        soundSiren: c.sound_siren,
        message: c.message,
        instructions: c.instructions,
        timestamp: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    } catch {
      return [];
    }
  }

  async broadcastCalamitySiren(alert: Omit<CalamityAlert, 'id' | 'timestamp'>): Promise<CalamityAlert | null> {
    const newAlert: CalamityAlert = {
      ...alert,
      id: `calamity-sp-${Date.now()}`,
      timestamp: 'Just Now'
    };

    if (this.isConfigured() && supabase) {
      try {
        await supabase.from('calamity_alerts').insert({
          id: newAlert.id,
          title: newAlert.title,
          calamity_type: newAlert.calamityType,
          severity: newAlert.severity,
          location: newAlert.location,
          district_id: newAlert.districtId,
          affected_highway: newAlert.affectedHighway,
          latitude: newAlert.coordinates[0],
          longitude: newAlert.coordinates[1],
          active: newAlert.active,
          sound_siren: newAlert.soundSiren,
          message: newAlert.message,
          instructions: newAlert.instructions
        });
      } catch (err) {
        console.warn('Failed to broadcast siren to Supabase:', err);
      }
    }
    return newAlert;
  }

  /**
   * Listen in real-time to Calamity Siren Alerts broadcasted across Supabase DB
   */
  subscribeToCalamityAlerts(onAlertReceived: (alert: CalamityAlert) => void): () => void {
    if (!this.isConfigured() || !supabase) {
      return () => {};
    }

    const channel = supabase
      .channel('public:calamity_alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'calamity_alerts' },
        (payload) => {
          const c = payload.new;
          if (c && c.active) {
            const alert: CalamityAlert = {
              id: c.id,
              title: c.title,
              calamityType: c.calamity_type,
              severity: c.severity,
              location: c.location,
              districtId: c.district_id,
              affectedHighway: c.affected_highway,
              coordinates: [Number(c.latitude || 26.14), Number(c.longitude || 91.73)],
              active: c.active,
              soundSiren: c.sound_siren,
              message: c.message,
              instructions: c.instructions,
              timestamp: 'LIVE Realtime Broadcast'
            };
            onAlertReceived(alert);
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }
}

export const supabaseService = new SupabaseService();
