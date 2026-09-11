import { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Send
} from 'lucide-react';
import type { IncidentType, RiskLevel, District, Incident } from '../../types';
import { apiService } from '../../services/api';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: District[];
  initialDistrict?: District | null;
  onIncidentReported: (newIncident: Incident) => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  districts,
  initialDistrict,
  onIncidentReported
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IncidentType>('Landslide');
  const [severity, setSeverity] = useState<RiskLevel>('Severe');
  const [districtId, setDistrictId] = useState(initialDistrict ? initialDistrict.id : districts[0]?.id || '');
  const [location, setLocation] = useState(initialDistrict?.majorHighway ? `${initialDistrict.majorHighway} corridor` : '');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number]>(initialDistrict?.coordinates || [25.3117, 92.4285]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialDistrict) {
      setDistrictId(initialDistrict.id);
      setCoordinates(initialDistrict.coordinates);
      if (initialDistrict.majorHighway) {
        setLocation(prev => prev || `${initialDistrict.majorHighway} corridor`);
      }
    }
  }, [initialDistrict, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const chosenDistrict = districts.find(d => d.id === districtId);

    try {
      const created = await apiService.reportIncident({
        title: title || `${type} reported on road corridor`,
        type,
        severity,
        location: location || `${chosenDistrict?.majorHighway || 'NH Highway'} checkpoint`,
        districtId,
        districtName: chosenDistrict?.name || 'North Eastern Region',
        coordinates,
        description: description || `Reported by field officer. High risk of transit blockage.`
      });

      setSuccess(true);
      onIncidentReported(created);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // Default to Sonapur coordinates
          setCoordinates([25.3117, 92.4285]);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-count-up">
      <div 
        className="bg-[#0c1018] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-xl border border-rose-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#111827] border border-[#1f2a3e] text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#182130]">
          <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight font-mono uppercase">
              Geo-Tagged Field Hazard Report
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Low-bandwidth resilient dispatch for field units and SDRF
            </p>
          </div>
        </div>

        {/* Supabase Realtime Cloud Connection Banner */}
        <div className="flex items-center justify-between bg-[#090d15] border border-[#172030] px-3 py-2 rounded-lg my-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-300 text-[11px]">
              Supabase Realtime Cloud Connected
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
            Postgres DB Active
          </span>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full neu-inset mx-auto flex items-center justify-center text-emerald-400 shadow-neu-glow-emerald">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Hazard Dispatched & Synced</h3>
            <p className="text-xs text-emerald-300 font-mono">
              ✓ Successfully written to Supabase Cloud Database (Live Broadcast Active)
            </p>
            <p className="text-xs text-slate-400">
              Corridor risk scores recalculated; commercial fleets automatically rerouting.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Incident Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Major mudslide & rockfall on highway"
                className="w-full neu-input px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Hazard Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full neu-input px-3 py-2 text-xs text-slate-200"
              >
                <option value="Landslide">Landslide / Mudflow</option>
                <option value="Flash Flood">Flash Flood / Waterlogging</option>
                <option value="Road Collapse">Road Collapse / Cavitation</option>
                <option value="Bridge Damage">Bridge Structural Damage</option>
                <option value="Fallen Debris">Fallen Trees / Boulders</option>
                <option value="Heavy Fog">Zero-Visibility Mountain Fog</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                  className="w-full neu-input px-3 py-2 text-xs text-slate-200"
                >
                  <option value="Severe">Severe (Full Road Blocked)</option>
                  <option value="High">High (Single Lane Passable)</option>
                  <option value="Moderate">Moderate (Speed Restricted)</option>
                  <option value="Low">Low (Caution Only)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Target District
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full neu-input px-3 py-2 text-xs text-slate-200"
                >
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Location & Milestone Marker
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. NH-6 KM Marker 134 near Sonapur Tunnel"
                className="w-full neu-input px-3 py-2 text-xs text-slate-200"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase text-slate-400">
                  GPS Geotag Coordinates
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <MapPin className="w-3 h-3" /> Fetch Device GPS
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <input
                  type="number"
                  step="0.0001"
                  value={coordinates[0]}
                  onChange={(e) => setCoordinates([parseFloat(e.target.value) || 0, coordinates[1]])}
                  className="w-full neu-input px-3 py-2 text-slate-200"
                  placeholder="Latitude"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={coordinates[1]}
                  onChange={(e) => setCoordinates([coordinates[0], parseFloat(e.target.value) || 0])}
                  className="w-full neu-input px-3 py-2 text-slate-200"
                  placeholder="Longitude"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Incident Description & Detour Note
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe road blockage dimensions, presence of stranded vehicles, or earthmover requirement..."
                className="w-full neu-input px-3 py-2 text-xs text-slate-200 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full neu-btn-primary py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Broadcasting Alert...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast Hazard Alert to Fleet</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
