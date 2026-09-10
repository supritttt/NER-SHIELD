import { useState } from 'react';
import { 
  AlertOctagon, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Plus
} from 'lucide-react';
import type { Incident, IncidentType } from '../../types';
import { Badge } from '../common/Badge';

interface IncidentsViewProps {
  incidents: Incident[];
  onOpenReportModal: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onOpenReportModal
}) => {
  const [filterType, setFilterType] = useState<'All' | IncidentType>('All');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(inc => {
    const matchesType = filterType === 'All' || inc.type === filterType;
    const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
                          inc.location.toLowerCase().includes(search.toLowerCase()) ||
                          inc.districtName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="neu-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Verified Disruption Incidents & Hazards
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live crowd-sourced & SDRF field hazard logs validated by satellite radar
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="neu-btn-primary px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Report Hazard
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search incident, district..."
                className="pl-8 pr-3 py-1.5 text-xs neu-input w-48 text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Hazard Types Filter */}
        <div className="flex gap-1.5 overflow-x-auto pt-3 border-t border-[#182130] mt-3.5 no-scrollbar">
          {(['All', 'Landslide', 'Flash Flood', 'Road Collapse', 'Fallen Debris', 'Heavy Fog'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded text-xs font-mono shrink-0 transition-all ${
                filterType === t
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                  : 'bg-[#0d121c] text-slate-400 hover:text-slate-200 border border-[#192234]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            className="neu-card p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 border-l-2 border-l-rose-500"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-[#182130]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white font-mono">{inc.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {inc.location} ({inc.districtName})
                  </p>
                </div>
                <Badge value={inc.severity} size="sm" />
              </div>

              <div className="bg-[#090d15] border border-[#172030] p-3 rounded-lg my-3 text-xs text-slate-300 font-mono leading-relaxed">
                {inc.description}
              </div>
            </div>

            <div className="pt-3 border-t border-[#182130] flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI Verified ({inc.reportsCount} Field Reports)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{inc.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
