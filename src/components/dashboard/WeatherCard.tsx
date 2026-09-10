import { useState } from 'react';
import { 
  CloudRain, 
  Wind, 
  Eye, 
  Mountain,
  Droplets
} from 'lucide-react';
import type { WeatherData } from '../../types';
import { Badge } from '../common/Badge';

interface WeatherCardProps {
  weatherList: WeatherData[];
  onSelectStation?: (districtId: string) => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherList }) => {
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const current = weatherList[selectedStationIndex] || weatherList[0];

  if (!current) return null;

  return (
    <div className="neu-card p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#182130]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111724] border border-[#1d273a] flex items-center justify-center text-cyan-400">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-tight font-mono uppercase">
                Mountain Weather & Hydrology Radar
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Landslide saturation & high-altitude pass telemetry
              </p>
            </div>
          </div>

          <Badge 
            value={current.warningLevel === 'Red' ? 'Severe Alert' : current.warningLevel === 'Orange' ? 'Warning' : 'Normal'} 
            variant={current.warningLevel === 'Red' ? 'red' : current.warningLevel === 'Orange' ? 'amber' : 'green'}
          />
        </div>

        {/* Station Selector Pills */}
        <div className="flex gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
          {weatherList.map((station, idx) => (
            <button
              key={station.districtId}
              onClick={() => setSelectedStationIndex(idx)}
              className={`px-2.5 py-1 rounded text-xs font-mono shrink-0 transition-all ${
                selectedStationIndex === idx
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-[#0d121c] text-slate-400 hover:text-slate-200 border border-[#192234]'
              }`}
            >
              {station.districtName.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Current Station Primary Metric */}
        <div className="bg-[#090d15] border border-[#172030] p-4 rounded-xl mt-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-100 text-sm">{current.districtName}</h4>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">{current.condition}</p>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-extrabold text-white">{current.temperatureC}°</span>
              <span className="text-slate-400 text-sm">C</span>
            </div>
          </div>

          {/* Environmental metrics grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#161f2e] text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" /> Rain Rate
              </span>
              <span className="font-bold text-slate-100 text-xs mt-0.5">{current.rainfallMm} mm/h</span>
            </div>

            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> Ridge Wind
              </span>
              <span className="font-bold text-slate-100 text-xs mt-0.5">{current.windSpeedKmh} km/h</span>
            </div>

            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-400" /> Visibility
              </span>
              <span className="font-bold text-slate-100 text-xs mt-0.5">{current.visibilityMeters} m</span>
            </div>
          </div>
        </div>

        {/* Landslide & Flood Risk Indicators */}
        <div className="space-y-2 mt-3">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-rose-400" />
                Landslide Probability Index:
              </span>
              <span className={`font-bold ${current.landslideRiskIndex > 75 ? 'text-rose-400' : 'text-amber-400'}`}>
                {current.landslideRiskIndex}%
              </span>
            </div>
            <div className="w-full bg-[#080b12] rounded-full h-1.5 border border-[#161f2e] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  current.landslideRiskIndex > 75 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${current.landslideRiskIndex}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Flash Flood Vulnerability:
              </span>
              <span className={`font-bold ${current.flashFloodRiskIndex > 75 ? 'text-rose-400' : 'text-amber-400'}`}>
                {current.flashFloodRiskIndex}%
              </span>
            </div>
            <div className="w-full bg-[#080b12] rounded-full h-1.5 border border-[#161f2e] overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                style={{ width: `${current.flashFloodRiskIndex}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mountain Pass Statuses */}
      <div className="mt-4 pt-3 border-t border-[#182130]">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
          Strategic Mountain Pass Status
        </span>
        <div className="space-y-1.5">
          {current.mountainPassStatus.map((pass, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs p-2 rounded bg-[#090d15] border border-[#161f2e]"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-medium">{pass.passName}</span>
                <span className="text-[10px] text-slate-400 font-mono">({pass.snowOrRain})</span>
              </div>
              <Badge value={pass.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
