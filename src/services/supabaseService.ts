import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { District, Incident } from '../types';
import type { CalamityAlert } from './liveCalamityService';

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

  // 2. Incidents
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
        coordinates: typeof i.coordinates === 'string' ? JSON.parse(i.coordinates) : i.coordinates,
        verifiedByAI: i.verified_by_ai,
        reportsCount: i.reports_count,
        description: i.description
      }));
    } catch {
      return null;
    }
  }

  async saveIncident(inc: Incident): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('incidents').insert({
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
      });
      return !error;
    } catch {
      return false;
    }
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
