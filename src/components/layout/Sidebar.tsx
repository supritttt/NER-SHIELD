import { 
  LayoutDashboard, 
  MapPin, 
  Map, 
  Navigation, 
  Truck, 
  AlertOctagon, 
  CloudRain, 
  ShieldCheck,
  Cpu,
  Activity
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'live-feed'
  | 'districts'
  | 'gis-map'
  | 'routes'
  | 'fleets'
  | 'incidents'
  | 'weather';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Logistics Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'live-feed',
      label: 'Live Telemetry Feed',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      badge: 'LIVE'
    },
    {
      id: 'districts',
      label: 'District Intelligence',
      icon: <MapPin className="w-4 h-4" />,
      badge: '11 NER'
    },
    {
      id: 'gis-map',
      label: 'GIS Operations Map',
      icon: <Map className="w-4 h-4" />,
      badge: 'Live'
    },
    {
      id: 'routes',
      label: 'AI Route Optimizer',
      icon: <Navigation className="w-4 h-4" />
    },
    {
      id: 'fleets',
      label: 'Vehicle Fleet Tracking',
      icon: <Truck className="w-4 h-4" />,
      badge: '142'
    },
    {
      id: 'incidents',
      label: 'Hazard & Blockages',
      icon: <AlertOctagon className="w-4 h-4" />,
      badge: '4 Alert'
    },
    {
      id: 'weather',
      label: 'Mountain Weather Radar',
      icon: <CloudRain className="w-4 h-4" />
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-[#090d16] border-r border-[#161e2e] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } h-[calc(100vh-4rem)] sticky top-16 p-3.5 justify-between select-none z-20`}
    >
      <div className="space-y-5">
        {/* Section Title */}
        {!isCollapsed && (
          <div className="px-3 pt-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              Command Modules
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#121926] text-cyan-300 font-semibold border-l-2 border-l-cyan-400 border-t border-r border-b border-[#1f2c42] shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#0e1420] border-l-2 border-transparent'
                }`}
              >
                <div
                  className={`transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-300'
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left font-mono">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isActive
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            : 'bg-[#121824] text-slate-400 border border-[#1e2738]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quantum Team & AI Engine Status Card */}
      <div className="space-y-3 pt-3 border-t border-[#171f2e]">
        {!isCollapsed ? (
          <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1a2334] text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono font-bold text-slate-200 uppercase">AI Predictive Engine</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
              <p>Model: <span className="text-emerald-300">RandomForest v2.1</span></p>
              <p>Routing: <span className="text-cyan-300">OSRM Multimodal</span></p>
              <p>Telemetry: <span className="text-amber-300">8 NER States Seed</span></p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#1a2334] flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>SIH26002</span>
              <span className="text-cyan-400 font-bold">Team Quantum</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="p-2 rounded-lg bg-[#0c1018] border border-[#1a2334] text-emerald-400" title="Team Quantum AI Active">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
