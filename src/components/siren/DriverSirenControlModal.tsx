import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  CheckCircle2,
  BellRing
} from 'lucide-react';
import type { CalamityAlert } from '../../services/liveCalamityService';
import { sirenAudioEngine } from '../../utils/sirenAudio';

interface DriverSirenControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSiren: (alert: Omit<CalamityAlert, 'id' | 'timestamp'>) => void;
}

export const DriverSirenControlModal: React.FC<DriverSirenControlModalProps> = ({
  isOpen,
  onClose,
  onBroadcastSiren
}) => {
  const [calamityType, setCalamityType] = useState<'Earthquake' | 'Landslide' | 'Flash Flood' | 'Severe Tempest' | 'Cloudburst'>('Earthquake');
  const [severity, setSeverity] = useState<'Critical' | 'Severe' | 'High'>('Critical');
  const [location, setLocation] = useState('NH-6 Sonapur Tunnel / East Jaintia Hills');
  const [affectedHighway, setAffectedHighway] = useState('NH-6 Guwahati-Silchar Lifeline');
  const [message, setMessage] = useState('CRITICAL DISASTER SIREN: Massive landslide and rockfall detected. Drivers stop vehicles safely in open clearing immediately.');
  const [instructions, setInstructions] = useState('EVACUATE GORGES, TURN ON EMERGENCY FLASHERS & WAIT FOR SDRF/NHAI CLEARANCE.');
  const [isTestingSound, setIsTestingSound] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const handleTestSiren = () => {
    if (isTestingSound) {
      sirenAudioEngine.stopSiren();
      setIsTestingSound(false);
    } else {
      sirenAudioEngine.startSiren();
      sirenAudioEngine.speakWarning('Testing Driver Calamity Emergency Siren System');
      setIsTestingSound(true);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sirenAudioEngine.stopSiren();
    setIsTestingSound(false);

    onBroadcastSiren({
      title: `EMERGENCY SIREN BROADCAST: ${calamityType.toUpperCase()} CALAMITY`,
      calamityType,
      severity,
      location,
      affectedHighway,
      coordinates: [25.3117, 92.4285],
      active: true,
      soundSiren: true,
      message,
      instructions
    });

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b0f19] border-2 border-rose-600/70 rounded-2xl w-full max-w-xl p-6 shadow-[0_0_50px_rgba(225,29,72,0.3)] space-y-5 text-white relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rose-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Emergency Driver Siren Broadcast Center
              </h2>
              <p className="text-xs text-rose-300/80 font-mono">
                Broadcast real-time natural calamity sirens to all active drivers via Supabase Realtime
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sirenAudioEngine.stopSiren();
              setIsTestingSound(false);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {broadcastSent ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-white">Siren Broadcast Transmitted!</h3>
            <p className="text-xs text-slate-300 font-mono">
              Natural calamity alert & high-decibel audio siren synced to all driver telemetry terminals.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="space-y-4">
            
            {/* Calamity Type & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Natural Calamity Type
                </label>
                <select
                  value={calamityType}
                  onChange={(e) => setCalamityType(e.target.value as any)}
                  className="w-full bg-[#121927] border border-rose-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-400"
                >
                  <option value="Earthquake">🌋 Earthquake / Seismic Tremor</option>
                  <option value="Landslide">🏔️ Landslide / Rockfall</option>
                  <option value="Flash Flood">🌊 Torrential Flash Flood</option>
                  <option value="Cloudburst">🌧️ Mountain Cloudburst</option>
                  <option value="Severe Tempest">🌪️ Cyclone / Severe Tempest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Alert Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-[#121927] border border-rose-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-400"
                >
                  <option value="Critical">🔴 CRITICAL (Immediate Siren Alarm)</option>
                  <option value="Severe">🟠 SEVERE (High Priority Siren)</option>
                  <option value="High">🟡 HIGH (Warning Alert)</option>
                </select>
              </div>
            </div>

            {/* Location & Highway */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Calamity Location / Sector
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#121927] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Affected Transport Corridor / Highway
                </label>
                <input
                  type="text"
                  value={affectedHighway}
                  onChange={(e) => setAffectedHighway(e.target.value)}
                  className="w-full bg-[#121927] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Driver Siren Message */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Driver Warning Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full bg-[#121927] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-sans focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Emergency Safety Instructions */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Immediate Driver Safety Directive
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-[#121927] border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
                required
              />
            </div>

            {/* Action Buttons: Siren Audio Test & Broadcast */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestSiren}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
                  isTestingSound 
                    ? 'bg-rose-600 text-white border-rose-400 animate-pulse' 
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isTestingSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
                <span>{isTestingSound ? 'STOP SIREN SOUND' : 'TEST SIREN AUDIO'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sirenAudioEngine.stopSiren();
                    setIsTestingSound(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>BROADCAST SIREN TO ALL DRIVERS</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
