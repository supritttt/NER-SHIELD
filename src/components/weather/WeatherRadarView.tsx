import { 
  CloudRain, 
  Wind, 
  Eye, 
  Droplets
} from 'lucide-react';
import type { WeatherData } from '../../types';
import { Badge } from '../common/Badge';

interface WeatherRadarViewProps {
  weatherList: WeatherData[];
}

export const WeatherRadarView: React.FC<WeatherRadarViewProps> = ({ weatherList }) => {
  return (
    <div className="space-y-6">
      <div className="neu-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              North Eastern Regional Hydrology & Mountain Pass Radar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live precipitation indices, cloud radar, and high-altitude highway pass conditions
            </p>
          </div>

          <div className="neu-inset px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            IMD & GIS Radar Sync Active
          </div>
        </div>
      </div>

      {/* Grid of Weather Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weatherList.map((station) => (
          <div key={station.districtId} className="neu-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#182130]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                    {station.state}
                  </span>
                  <h3 className="font-bold text-base text-white mt-0.5">{station.districtName}</h3>
                  <p className="text-xs text-cyan-300 font-mono mt-0.5">{station.condition}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-white">{station.temperatureC}°C</div>
                  <div className="mt-1">
                    <Badge 
                      value={station.warningLevel === 'Red' ? 'Severe Alert' : station.warningLevel === 'Orange' ? 'Warning' : 'Normal'} 
                      variant={station.warningLevel === 'Red' ? 'red' : station.warningLevel === 'Orange' ? 'amber' : 'green'} 
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Environmental Metrics */}
              <div className="grid grid-cols-3 gap-2 my-3.5 text-xs font-mono">
                <div className="bg-[#090d15] border border-[#172030] p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" /> Precipitation
                  </span>
                  <span className="text-sm font-bold text-slate-100 mt-1 block">{station.rainfallMm} mm/h</span>
                </div>

                <div className="bg-[#090d15] border border-[#172030] p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-400" /> Ridge Wind
                  </span>
                  <span className="text-sm font-bold text-slate-100 mt-1 block">{station.windSpeedKmh} km/h</span>
                </div>

                <div className="bg-[#090d15] border border-[#172030] p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Visibility
                  </span>
                  <span className="text-sm font-bold text-slate-100 mt-1 block">{station.visibilityMeters} m</span>
                </div>
              </div>

              {/* Vulnerabilities */}
              <div className="space-y-2 mb-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Landslide Risk Factor:</span>
                    <span className={`font-bold ${station.landslideRiskIndex > 75 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {station.landslideRiskIndex}%
                    </span>
                  </div>
                  <div className="w-full bg-[#080b12] rounded-full h-1 border border-[#161f2e] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${station.landslideRiskIndex > 75 ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${station.landslideRiskIndex}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Flash Flood Vulnerability:</span>
                    <span className={`font-bold ${station.flashFloodRiskIndex > 75 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {station.flashFloodRiskIndex}%
                    </span>
                  </div>
                  <div className="w-full bg-[#080b12] rounded-full h-1 border border-[#161f2e] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${station.flashFloodRiskIndex}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Passes */}
            <div className="pt-3 border-t border-[#182130]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                Pass Status in this Sector
              </span>
              <div className="space-y-1.5">
                {station.mountainPassStatus.map((pass, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-[#090d15] border border-[#172030] p-2 rounded font-mono">
                    <span className="text-slate-200">{pass.passName} ({pass.snowOrRain})</span>
                    <Badge value={pass.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
