import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Terminal, 
  Satellite, 
  Gauge, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { liveFleetTelemetryService } from '../../services/liveFleetTelemetryService';
import type { LiveTelemetryPacket, LiveTelemetryStats } from '../../types';

interface LiveMonitoringStatusBarProps {
  className?: string;
  onRefreshWeather?: () => void;
}

export const LiveMonitoringStatusBar: React.FC<LiveMonitoringStatusBarProps> = ({
  className = '',
  onRefreshWeather
}) => {
  const [stats, setStats] = useState<LiveTelemetryStats>(() => liveFleetTelemetryService.getStats());
  const [recentPackets, setRecentPackets] = useState<LiveTelemetryPacket[]>(() => liveFleetTelemetryService.getRecentPackets());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState<string>('All');

  useEffect(() => {
    // Subscribe to stats
    const unsubStats = liveFleetTelemetryService.subscribeToStats((newStats) => {
      setStats(newStats);
    });

    // Subscribe to incoming packets
    const unsubPackets = liveFleetTelemetryService.subscribeToPackets((packet) => {
      setRecentPackets((prev) => [packet, ...prev.slice(0, 59)]);
    });

    return () => {
      unsubStats();
      unsubPackets();
    };
  }, []);

  const handleToggleStream = () => {
    liveFleetTelemetryService.toggle();
  };

  const handleSetSpeed = (mult: number) => {
    liveFleetTelemetryService.setSpeedMultiplier(mult);
  };

  const filteredPackets = recentPackets.filter(p => 
    filterVehicle === 'All' || p.vehicleId === filterVehicle || p.vehicleNumber === filterVehicle
  );

  return (
    <div className={`neu-card border border-cyan-500/25 bg-gradient-to-r from-[#070b12] via-[#0b101c] to-[#070b12] shadow-tactical-md overflow-hidden relative ${className}`}>
      {/* Top Ambient Glow Pulse */}
      <div className="absolute -top-10 left-1/3 w-96 h-12 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />

      {/* Main Status Strip */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 relative z-10 text-xs font-mono">
        {/* Left: Stream Indicator & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {stats.isStreaming ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              )}
            </span>
            <span className={`font-extrabold uppercase tracking-wider text-[11px] ${
              stats.isStreaming ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {stats.isStreaming ? 'LIVE TELEMETRY STREAM: ACTIVE' : 'STREAM PAUSED'}
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Satellite Constellation */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>{stats.activeSatellites} NavIC / GPS Sats</span>
            <span className="text-slate-600">({stats.signalIntegrityPct}%)</span>
          </div>

          <span className="text-slate-700 hidden lg:inline">|</span>

          {/* Latency Jitter */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ping: <strong className="text-emerald-300">{stats.averageLatencyMs}ms</strong></span>
          </div>
        </div>

        {/* Center / Right: Live Counters & Controls */}
        <div className="flex items-center gap-3">
          {/* Packets Ingested Counter */}
          <div className="flex items-center gap-1.5 bg-[#0e1524] px-2.5 py-1 rounded-md border border-[#1e2a42] text-slate-300">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-slate-400 uppercase">Packets:</span>
            <span className="font-bold text-cyan-300 font-mono tracking-tight">
              {stats.packetsReceivedTotal.toLocaleString()}
            </span>
          </div>

          {/* Moving Fleets Count */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0e1524] px-2.5 py-1 rounded-md border border-[#1e2a42] text-slate-300">
            <Gauge className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-slate-400 uppercase">Fleets:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {stats.movingFleetsCount} Transiting
            </span>
          </div>

          {/* Speed Multiplier */}
          <div className="flex items-center bg-[#0e1524] rounded-md border border-[#1e2a42] p-0.5 text-[10px]">
            {[1, 2, 5].map((m) => (
              <button
                key={m}
                onClick={() => handleSetSpeed(m)}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  stats.speedMultiplier === m 
                    ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-500/40' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Run GPS telemetry simulation at ${m}x speed`}
              >
                {m}x
              </button>
            ))}
          </div>

          {/* Play / Pause Toggle */}
          <button
            onClick={handleToggleStream}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              stats.isStreaming
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
            }`}
            title={stats.isStreaming ? 'Pause Real-Time GPS Telemetry Stream' : 'Resume Real-Time GPS Telemetry Stream'}
          >
            {stats.isStreaming ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="hidden sm:inline">Resume</span>
              </>
            )}
          </button>

          {/* Trigger Weather Poll */}
          {onRefreshWeather && (
            <button
              onClick={onRefreshWeather}
              className="neu-btn p-1 rounded-md text-slate-400 hover:text-cyan-300 transition-colors"
              title="Force Refresh Open-Meteo Satellite Weather"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}

          {/* Live Console Drawer Toggle */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`px-2 py-1 rounded-md text-[11px] flex items-center gap-1.5 transition-all ${
              isDrawerOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'neu-btn text-slate-400 hover:text-slate-200'
            }`}
            title="Inspect Real-time Raw Telemetry GPS Packets"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Telemetry Log</span>
            {isDrawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Live Telemetry Ingestion Drawer */}
      {isDrawerOpen && (
        <div className="border-t border-[#182338] bg-[#05080e] p-4 text-xs font-mono space-y-3 animate-fade-in">
          {/* Drawer Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#141b2b]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                Active NMEA / GPS Telemetry Stream (Ring Buffer: 60 Packets)
              </span>
            </div>

            {/* Filter by Vehicle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Filter Vehicle:</span>
              <select
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
                className="bg-[#0b101a] border border-[#1e2a42] text-slate-200 text-xs px-2 py-0.5 rounded focus:outline-none"
              >
                <option value="All">All 6 Active Fleets</option>
                <option value="flt-101">AS-01-GC-4921 (Medical - NH-6)</option>
                <option value="flt-102">ML-05-D-8824 (Produce - NH-40)</option>
                <option value="flt-103">AR-01-T-3109 (Telecom - NH-13 Sela)</option>
                <option value="flt-104">MN-01-B-7401 (Petroleum - NH-29)</option>
                <option value="flt-105">SK-02-X-9905 (Machinery - NH-10)</option>
                <option value="flt-106">AS-03-BC-1144 (Relief - NH-27)</option>
              </select>
            </div>
          </div>

          {/* Rolling Packets Table / Terminal */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2 font-mono text-[11px] scrollbar-thin scrollbar-thumb-[#1e2a42]">
            {filteredPackets.length === 0 ? (
              <div className="text-slate-500 py-4 text-center">No telemetry packets recorded yet...</div>
            ) : (
              filteredPackets.map((pkt) => (
                <div 
                  key={pkt.packetId}
                  className="p-1.5 rounded bg-[#090e18] hover:bg-[#0d1524] border border-[#141d30] flex flex-wrap items-center justify-between gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{pkt.timestamp}</span>
                    <span className="px-1 py-0.2 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
                      {pkt.packetId}
                    </span>
                    <span className="font-bold text-white">{pkt.vehicleNumber}</span>
                    <span className="text-slate-400 text-[10px] hidden sm:inline">({pkt.cargoType})</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#111827] text-slate-300 text-[10px] border border-slate-700">
                      {pkt.highwayCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300 text-[10px]">
                    <span className="text-cyan-400 font-semibold">
                      {pkt.coordinates[0].toFixed(4)}°N, {pkt.coordinates[1].toFixed(4)}°E
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {pkt.speedKmH} km/h
                    </span>
                    <span className="text-amber-400 hidden md:inline">
                      Alt: {pkt.altitudeM}m
                    </span>
                    <span className="text-slate-400 hidden lg:inline">
                      Hdg: {pkt.headingDeg}°
                    </span>
                    <span className="text-slate-500">
                      {pkt.latencyMs}ms
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
