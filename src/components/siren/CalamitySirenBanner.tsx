import React, { useEffect, useState } from 'react';
import { 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  Navigation, 
  MapPin,
  Flame,
  CheckCircle2
} from 'lucide-react';
import type { CalamityAlert } from '../../services/liveCalamityService';
import { sirenAudioEngine } from '../../utils/sirenAudio';

interface CalamitySirenBannerProps {
  alert: CalamityAlert | null;
  onDismiss: () => void;
  onOpenRouteOptimizer?: () => void;
}

export const CalamitySirenBanner: React.FC<CalamitySirenBannerProps> = ({
  alert,
  onDismiss,
  onOpenRouteOptimizer
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (alert && alert.active && alert.soundSiren && !acknowledged) {
      // Start siren sound and text-to-speech warning on screen prompt
      sirenAudioEngine.startSiren();
      sirenAudioEngine.speakWarning(
        `Emergency Alert: ${alert.calamityType} hazard detected near ${alert.location}. Drivers proceed with extreme caution or pull over immediately.`
      );
    }

    return () => {
      sirenAudioEngine.stopSiren();
    };
  }, [alert, acknowledged]);

  if (!alert || !alert.active) return null;

  const handleToggleMute = () => {
    if (isMuted) {
      sirenAudioEngine.startSiren();
      setIsMuted(false);
    } else {
      sirenAudioEngine.stopSiren();
      setIsMuted(true);
    }
  };

  const handleAcknowledge = () => {
    sirenAudioEngine.stopSiren();
    setAcknowledged(true);
    onDismiss();
  };

  return (
    <div className="w-full bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-y-2 border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.4)] animate-pulse-slow text-white z-50 sticky top-0">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Left: Calamity Warning Header */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2.5 rounded-xl bg-rose-600/30 border border-rose-400/50 text-rose-300 relative shrink-0">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <AlertOctagon className="w-7 h-7 text-rose-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  EMERGENCY CALAMITY SIREN
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold">
                  {alert.calamityType.toUpperCase()}
                </span>
                {alert.affectedHighway && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono">
                    {alert.affectedHighway}
                  </span>
                )}
                <span className="text-xs text-rose-200/80 font-mono">
                  • {alert.timestamp}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                {alert.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rose-100 font-sans">
                <span className="flex items-center gap-1 font-semibold text-rose-300">
                  <MapPin className="w-3.5 h-3.5" />
                  {alert.location}
                </span>
                <span className="text-rose-200/90 font-mono">
                  {alert.message}
                </span>
              </div>

              {alert.instructions && (
                <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-rose-500/30 text-amber-200 text-xs font-mono font-bold">
                  ⚠️ INSTRUCTION: {alert.instructions}
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Siren Audio Toggle, Reroute & Dismiss */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 self-end lg:self-center">
            {/* Audio Siren Toggle */}
            <button
              onClick={handleToggleMute}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                isMuted 
                  ? 'bg-slate-800/80 text-slate-300 border-slate-600 hover:bg-slate-700' 
                  : 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse'
              }`}
              title={isMuted ? "Unmute Emergency Siren Audio" : "Mute Emergency Siren Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
              <span>{isMuted ? 'SIREN MUTED' : 'SIREN ALARM ACTIVE'}</span>
            </button>

            {/* AI Route Solver */}
            {onOpenRouteOptimizer && (
              <button
                onClick={() => {
                  sirenAudioEngine.stopSiren();
                  onOpenRouteOptimizer();
                }}
                className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                <span>AI REROUTE SOLVER</span>
              </button>
            )}

            {/* Acknowledge Button */}
            <button
              onClick={handleAcknowledge}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ACKNOWLEDGE & DISMISS</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
