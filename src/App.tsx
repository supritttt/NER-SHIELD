import { useState, useEffect } from 'react';
import { 
  apiService, 
  INITIAL_DISTRICTS, 
  INITIAL_ROAD_SEGMENTS, 
  INITIAL_FLEETS, 
  INITIAL_INCIDENTS, 
  INITIAL_WEATHER, 
  INITIAL_KPIS 
} from './services/api';
import type { 
  District, 
  RoadSegment, 
  VehicleFleet, 
  Incident, 
  WeatherData, 
  KPIData 
} from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import type { NavTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { KPICards } from './components/dashboard/KPICards';
import { OperationsOverview } from './components/dashboard/OperationsOverview';
import { WeatherCard } from './components/dashboard/WeatherCard';
import { LogisticsStats } from './components/dashboard/LogisticsStats';
import { PerformanceIndicators } from './components/dashboard/PerformanceIndicators';
import { DistrictIntelligence } from './components/districts/DistrictIntelligence';
import { FleetTrackingView } from './components/fleets/FleetTrackingView';
import { IncidentsView } from './components/incidents/IncidentsView';
import { WeatherRadarView } from './components/weather/WeatherRadarView';
import { RouteOptimizerModal } from './components/routes/RouteOptimizerModal';
import { RouteOptimizerView } from './components/routes/RouteOptimizerView';
import { IncidentReportModal } from './components/incidents/IncidentReportModal';
import { DistrictDetailModal } from './components/districts/DistrictDetailModal';
import { CalamitySirenBanner } from './components/siren/CalamitySirenBanner';
import { DriverSirenControlModal } from './components/siren/DriverSirenControlModal';
import { liveCalamityService, type CalamityAlert } from './services/liveCalamityService';
import { supabaseService } from './services/supabaseService';
import { Loader2 } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { authService } from './services/authService';
import type { AuthUser } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'platform' | 'signin'>('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedState, setSelectedState] = useState('All North East');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(apiService.getDemoMode());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core Datasets
  const [districts, setDistricts] = useState<District[]>(INITIAL_DISTRICTS);
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROAD_SEGMENTS);
  const [vehicles, setVehicles] = useState<VehicleFleet[]>(INITIAL_FLEETS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [weatherList, setWeatherList] = useState<WeatherData[]>(INITIAL_WEATHER);
  const [kpis, setKpis] = useState<KPIData>(INITIAL_KPIS);

  // Modals & Siren State
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [sirenControlModalOpen, setSirenControlModalOpen] = useState(false);
  const [activeCalamityAlert, setActiveCalamityAlert] = useState<CalamityAlert | null>(null);
  const [selectedDistrictModal, setSelectedDistrictModal] = useState<District | null>(null);
  const [routeOrigin, setRouteOrigin] = useState('Guwahati');
  const [routeDestination, setRouteDestination] = useState('Silchar');

  // Initial Data Fetch & Realtime Calamity Siren Listener
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [d, r, v, inc, w, k] = await Promise.all([
          apiService.getDistricts(),
          apiService.getRoadSegments(),
          apiService.getVehicles(),
          apiService.getIncidents(),
          apiService.getWeather(),
          apiService.getKPIs()
        ]);
        setDistricts(d);
        setRoads(r);
        setVehicles(v);
        setIncidents(inc);
        setWeatherList(w);
        setKpis(k);

        // Check for live calamity alerts (USGS Seismic & Weather Thresholds)
        const seismicAlerts = await liveCalamityService.fetchLiveSeismicCalamities();
        if (seismicAlerts.length > 0) {
          setActiveCalamityAlert(seismicAlerts[0]);
        } else {
          // Check for severe weather risk in fetched weather
          const severeDist = w.find(item => item.warningLevel === 'Red' || item.landslideRiskIndex > 85);
          if (severeDist) {
            const weatherCalamity = liveCalamityService.generateCalamityFromWeather(
              severeDist.districtName,
              severeDist.rainfallMm,
              severeDist.landslideRiskIndex
            );
            if (weatherCalamity) setActiveCalamityAlert(weatherCalamity);
          }
        }
      } catch (err) {
        console.error('Failed to load initial data, fallback to seed:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 400);
      }
    };

    loadData();

    // Subscribe to Supabase Realtime Siren Broadcasts
    const unsubscribe = supabaseService.subscribeToCalamityAlerts((alert) => {
      setActiveCalamityAlert(alert);
    });

    return () => {
      unsubscribe();
    };
  }, [isDemoMode]);

  const handleToggleDemoMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    apiService.setDemoMode(nextMode);
  };

  const handleOpenRouteOptimizerWithParams = (origin: string, destination: string) => {
    setRouteOrigin(origin);
    setRouteDestination(destination);
    setRouteModalOpen(false);
    setActiveTab('routes');
  };

  const handleComputeRouteFromModal = (origin: string, destination: string) => {
    setRouteOrigin(origin);
    setRouteDestination(destination);
    setRouteModalOpen(false);
    setActiveTab('routes');
  };

  const handleIncidentReported = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
    // update KPIs
    setKpis(prev => ({
      ...prev,
      criticalIncidentsCount: prev.criticalIncidentsCount + 1,
      disruptedSegmentsCount: prev.disruptedSegmentsCount + 1,
      networkAccessibilityPct: Math.max(prev.networkAccessibilityPct - 1.2, 50)
    }));
  };

  // Filter roads and districts according to selected state if any
  const displayedDistricts = districts.filter(d => 
    selectedState === 'All North East' || d.state.toLowerCase() === selectedState.toLowerCase()
  );

  // If user is on the Sign In Page
  if (currentView === 'signin') {
    return (
      <SignInPage
        onSuccessSignIn={(user) => {
          setCurrentUser(user);
          setCurrentView('platform');
          window.scrollTo(0, 0);
        }}
        onBackToLanding={() => {
          setCurrentView('landing');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  // If user is on the Public SaaS Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onOpenPlatform={() => {
          setCurrentView('platform');
          window.scrollTo(0, 0);
        }}
        onOpenSignIn={() => {
          setCurrentView('signin');
          window.scrollTo(0, 0);
        }}
        onOpenPlatformRouting={(origin, dest) => {
          setRouteOrigin(origin);
          setRouteDestination(dest);
          setActiveTab('routes');
          setCurrentView('platform');
          window.scrollTo(0, 0);
        }}
        onOpenFullGIS={() => {
          setActiveTab('gis-map');
          setCurrentView('platform');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neu-base text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        selectedState={selectedState}
        onSelectState={setSelectedState}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenSirenModal={() => setSirenControlModalOpen(true)}
        onBackToLanding={() => {
          setCurrentView('landing');
          window.scrollTo(0, 0);
        }}
        currentUser={currentUser}
        onOpenSignIn={() => {
          setCurrentView('signin');
          window.scrollTo(0, 0);
        }}
        onSignOut={() => {
          authService.signOut();
          setCurrentUser(null);
          setCurrentView('landing');
          window.scrollTo(0, 0);
        }}
      />

      {/* Emergency Calamity Siren Banner */}
      <CalamitySirenBanner
        alert={activeCalamityAlert}
        onDismiss={() => setActiveCalamityAlert(null)}
        onOpenRouteOptimizer={() => setActiveTab('routes')}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto pb-20 md:pb-8">
        {/* Desktop / Tablet Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-cyan-400 relative">
                <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-ping" />
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="text-center font-mono">
                <p className="text-sm font-bold text-slate-200">Initializing NER-SHIELD Spatial Intelligence...</p>
                <p className="text-xs text-slate-500 mt-1">Calibrating GIS seed vectors for 8 North Eastern States</p>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: MAIN DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-count-up">
                  {/* KPI Cards Row */}
                  <KPICards 
                    kpis={kpis} 
                    onCardClick={(key) => {
                      if (key === 'disruptions' || key === 'critical') setActiveTab('incidents');
                      if (key === 'accessibility') setActiveTab('districts');
                      if (key === 'fleets') setActiveTab('fleets');
                    }} 
                  />

                  {/* Operations Overview GIS Map */}
                  <OperationsOverview
                    roads={roads}
                    vehicles={vehicles}
                    incidents={incidents}
                    districts={displayedDistricts}
                    onSelectDistrict={(dist) => setSelectedDistrictModal(dist)}
                    onOpenRouteOptimizer={() => setRouteModalOpen(true)}
                  />

                  {/* 2-Column Split: Weather Radar & Fleet Statistics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WeatherCard weatherList={weatherList} />
                    <LogisticsStats 
                      fleets={vehicles} 
                      onOpenFleetTab={() => setActiveTab('fleets')} 
                    />
                  </div>

                  {/* Performance Indicators */}
                  <PerformanceIndicators />
                </div>
              )}

              {/* TAB 2: DISTRICT INTELLIGENCE */}
              {activeTab === 'districts' && (
                <div className="animate-count-up">
                  <DistrictIntelligence
                    districts={districts}
                    selectedState={selectedState}
                    onOpenRouteOptimizer={handleOpenRouteOptimizerWithParams}
                    onOpenReportIncident={(district) => {
                      setSelectedDistrictModal(district);
                      setReportModalOpen(true);
                    }}
                  />
                </div>
              )}

              {/* TAB 3: GIS OPERATIONS MAP (FULLPAGE) */}
              {activeTab === 'gis-map' && (
                <div className="animate-count-up space-y-4">
                  <div className="neu-card p-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                        Expanded Geographic Information System (GIS)
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Interactive telemetry overlay for North Eastern mountain highways & transport arteries
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('routes')}
                      className="neu-btn-primary px-4 py-2 rounded-lg text-xs font-semibold"
                    >
                      Open AI Route Solver
                    </button>
                  </div>
                  <OperationsOverview
                    roads={roads}
                    vehicles={vehicles}
                    incidents={incidents}
                    districts={displayedDistricts}
                    onSelectDistrict={(dist) => setSelectedDistrictModal(dist)}
                    onOpenRouteOptimizer={() => setActiveTab('routes')}
                    heightClass="h-[840px] lg:h-[900px]"
                  />
                </div>
              )}

              {/* TAB 4: ROUTE OPTIMIZER (FULL FIRST-CLASS SECTION) */}
              {activeTab === 'routes' && (
                <div className="animate-count-up">
                  <RouteOptimizerView
                    initialOrigin={routeOrigin}
                    initialDestination={routeDestination}
                  />
                </div>
              )}

              {/* TAB 5: FLEET TRACKING */}
              {activeTab === 'fleets' && (
                <div className="animate-count-up">
                  <FleetTrackingView 
                    fleets={vehicles} 
                    onOpenRouteOptimizer={handleOpenRouteOptimizerWithParams} 
                  />
                </div>
              )}

              {/* TAB 6: DISRUPTION INCIDENTS & HAZARDS */}
              {activeTab === 'incidents' && (
                <div className="animate-count-up">
                  <IncidentsView
                    incidents={incidents}
                    onOpenReportModal={() => setReportModalOpen(true)}
                  />
                </div>
              )}

              {/* TAB 7: MOUNTAIN WEATHER RADAR */}
              {activeTab === 'weather' && (
                <div className="animate-count-up">
                  <WeatherRadarView weatherList={weatherList} />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => setReportModalOpen(true)}
      />

      {/* Modals */}
      <DriverSirenControlModal
        isOpen={sirenControlModalOpen}
        onClose={() => setSirenControlModalOpen(false)}
        onBroadcastSiren={async (alert) => {
          const broadcasted = await supabaseService.broadcastCalamitySiren(alert);
          if (broadcasted) setActiveCalamityAlert(broadcasted);
        }}
      />

      <RouteOptimizerModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        initialOrigin={routeOrigin}
        initialDestination={routeDestination}
        onCompute={handleComputeRouteFromModal}
      />

      <IncidentReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        districts={districts}
        initialDistrict={selectedDistrictModal}
        onIncidentReported={handleIncidentReported}
      />

      {selectedDistrictModal && !reportModalOpen && (
        <DistrictDetailModal
          district={selectedDistrictModal}
          onClose={() => setSelectedDistrictModal(null)}
          onOpenRouteOptimizer={handleOpenRouteOptimizerWithParams}
          onOpenReportIncident={(d) => {
            setSelectedDistrictModal(d);
            setReportModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
