import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Map, 
  Navigation, 
  Truck,
  AlertTriangle,
  Activity
} from 'lucide-react';
import type { NavTab } from './Sidebar';

interface MobileNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReportModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenReportModal
}) => {
  const items: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dash', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'live-feed', label: 'Live', icon: <Activity className="w-5 h-5 text-emerald-400" /> },
    { id: 'districts', label: 'Districts', icon: <MapPin className="w-5 h-5" /> },
    { id: 'gis-map', label: 'Map', icon: <Map className="w-5 h-5" /> },
    { id: 'routes', label: 'Routes', icon: <Navigation className="w-5 h-5" /> },
    { id: 'fleets', label: 'Fleets', icon: <Truck className="w-5 h-5" /> },
  ];

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neu-card/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-cyan-400 neu-inset scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium mt-1 font-mono">{item.label}</span>
            </button>
          );
        })}
        {/* Quick Hazard Report button */}
        <button
          onClick={onOpenReportModal}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-rose-400 neu-btn"
          title="Report Hazard"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1 font-mono">Report</span>
        </button>
      </div>
    </nav>
  );
};
