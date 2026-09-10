import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Activity, 
  CloudRain, 
  Droplets, 
  ArrowRight,
  Clock
} from 'lucide-react';
import type { WeatherData } from '../../types';

interface LiveTelemetryTickerProps {
  weatherList: WeatherData[];
  onRefreshLive: () => Promise<void>;
  onOpenLiveFeed: () => void;
}

export const LiveTelemetryTicker: React.FC<LiveTelemetryTickerProps> = ({
  weatherList,
  onRefreshLive,
  onOpenLiveFeed
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastRefreshedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastRefreshedAt]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshLive();
      setLastRefreshedAt(new Date());
      setSecondsAgo(0);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const avgTemp = weatherList.length > 0 
    ? Math.round(weatherList.reduce((acc, w) => acc + w.temperatureC, 0) / weatherList.length) 
    : 22;

  const maxRain = weatherList.reduce((prev, curr) => 
    (curr.rainfallMm > prev.rainfallMm) ? curr : prev, weatherList[0] || { rainfallMm: 0, districtName: 'N/A' }
  );

  return (
    <div className="neu-card p-4 border border-cyan-500/20 bg-[#090d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Stream Status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 relative shrink-0">
          <Activity className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 animate-ping" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Telemetry Ingestion Active
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Open-Meteo & USGS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-cyan-400" />
              Regional Temp: <strong className="text-slate-200">{avgTemp}°C</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Peak Rain: <strong className="text-slate-200">{maxRain.rainfallMm}mm</strong> ({maxRain.districtName.split(' ')[0]})
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              {secondsAgo < 5 ? 'Just Now' : `${secondsAgo}s ago`}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="neu-btn px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
        </button>

        <button
          onClick={onOpenLiveFeed}
          className="neu-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Open Live Feed</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
