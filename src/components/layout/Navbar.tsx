import { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Bell, 
  Globe, 
  Radio, 
  AlertTriangle, 
  ChevronDown, 
  X 
} from 'lucide-react';

import type { AuthUser } from '../../types';

interface NavbarProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenReportModal: () => void;
  onOpenSirenModal?: () => void;
  onBackToLanding?: () => void;
  currentUser?: AuthUser | null;
  onOpenSignIn?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedState,
  onSelectState,
  searchQuery,
  onSearchChange,
  isDemoMode,
  onToggleDemoMode,
  onOpenReportModal,
  onOpenSirenModal,
  onBackToLanding,
  currentUser,
  onOpenSignIn,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'as'>('en');

  const states = [
    'All North East',
    'Assam',
    'Meghalaya',
    'Arunachal Pradesh',
    'Manipur',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim'
  ];

  const notifications = [
    {
      id: 1,
      title: 'CRITICAL: Landslide at NH-6 Sonapur',
      time: '18m ago',
      level: 'Severe',
      desc: 'Mudflow and heavy debris blocking Sonapur tunnel portal. Traffic halted.'
    },
    {
      id: 2,
      title: 'High Water Level at Saraighat',
      time: '45m ago',
      level: 'Moderate',
      desc: 'Brahmaputra flowing near warning mark. Freight speed restricted to 40km/h.'
    },
    {
      id: 3,
      title: 'Dense Mist & Sleet at Sela Pass',
      time: '1h ago',
      level: 'High',
      desc: 'Sub-zero temperatures; caution advised for commercial fleets on NH-13.'
    }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080c14]/95 backdrop-blur-md border-b border-[#171f2f] shadow-tactical-md">
      {/* Real-time Emergency Ticker */}
      <div className="bg-[#0b0f18] px-4 py-1.5 border-b border-[#182233] text-xs font-mono flex items-center justify-between text-rose-200 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
            <AlertTriangle className="w-3 h-3" />
            Active Disruption Radar:
          </span>
        </div>
        <div className="truncate px-4 text-slate-300 font-sans text-xs">
          <span className="text-rose-400 font-semibold font-mono">[NH-6 Blocked]</span> Sonapur Tunnel portal closed (60m mudflow) • 
          <span className="text-amber-400 font-semibold font-mono ml-2">[NH-10 Restricted]</span> Teesta 29th Mile 1-way alternating • 
          <span className="text-emerald-400 font-semibold font-mono ml-2">[NH-27 Passable]</span> Guwahati-Nagaon 4-lane clear
        </div>
        <div className="shrink-0 text-slate-400 text-[10px] font-mono hidden sm:flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-[#121824] border border-[#1d2738] text-cyan-300">
            SIH26002
          </span>
          <span>Sentinel SAR Synced</span>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4 py-2.5">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-700/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors flex items-center gap-1"
              title="Return to NER-Logistics Public Site"
            >
              ← Landing
            </button>
          )}
          <div className="w-9 h-9 rounded-lg bg-[#0e1522] flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(37,99,235,0.2)]">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-display">
                NER-Logistics
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-blue-950/80 text-blue-400 border border-blue-500/30">
                PLATFORM CONSOLE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide uppercase font-mono">
              Smart Logistics & Accessibility Intelligence
            </p>
          </div>
        </div>

        {/* Center: Search & State Filter */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2.5">
          {/* Recessed Tactical Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter corridors, passes (e.g. NH-6, Sonapur, Sela)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg neu-input text-slate-200 placeholder-slate-500 font-mono"
            />
          </div>

          {/* State Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => onSelectState(e.target.value)}
              aria-label="Filter by North East State"
              className="appearance-none neu-btn pl-3 pr-7 py-1.5 text-xs text-slate-200 rounded-lg focus:outline-none cursor-pointer font-mono"
            >
              {states.map((st) => (
                <option key={st} value={st} className="bg-[#0b0f17] text-slate-200">
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right Actions: Driver Siren Trigger, Incident Report, Mode Badge, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Driver Calamity Siren CTA */}
          {onOpenSirenModal && (
            <button
              onClick={onOpenSirenModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-mono font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all animate-pulse"
              title="Broadcast Driver Emergency Calamity Siren Alert"
            >
              <Radio className="w-3.5 h-3.5 text-rose-200" />
              <span className="hidden xl:inline">DRIVER SIREN</span>
            </button>
          )}

          {/* Report Incident CTA */}
          <button
            onClick={onOpenReportModal}
            className="neu-btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Hazard</span>
          </button>

          {/* Telemetry Mode Toggle */}
          <button
            onClick={onToggleDemoMode}
            title={isDemoMode ? "Running in Demo Mode (Seed Telemetry). Click to toggle." : "Connected to Open-Meteo & USGS Live APIs"}
            className="neu-btn px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Radio className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className="hidden lg:inline text-[11px] font-mono">
              {isDemoMode ? 'DEMO MODE' : 'LIVE API'}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'as' : 'en';
                setLanguage(nextLang);
              }}
              className="neu-btn px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 text-slate-300"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase font-mono text-[11px]">{language}</span>
            </button>
          </div>

          {/* User Profile / Sign In Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {currentUser.phoneNumber}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            onOpenSignIn && (
              <button
                onClick={onOpenSignIn}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors"
              >
                Sign In
              </button>
            )
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="neu-btn p-2 rounded-xl text-slate-300 relative"
              title="Disruption Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl neu-card p-4 shadow-neu-flat-lg z-50 border border-slate-700/60 animate-count-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-sm text-white">Live Disruption Feeds</span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white neu-btn text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 mt-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 hover:bg-slate-800/30 rounded-lg px-2 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-300">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span>AI Confidence: 94.8%</span>
                  <span className="text-cyan-400 cursor-pointer hover:underline">View All in Map →</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
