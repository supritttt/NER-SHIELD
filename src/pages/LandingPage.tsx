import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../sections/HeroSection';
import { CapabilitiesSection } from '../sections/CapabilitiesSection';
import { BentoGridSection } from '../sections/BentoGridSection';
import { AIIntelligenceSection } from '../sections/AIIntelligenceSection';
import { SmartRoutingSection } from '../sections/SmartRoutingSection';
import { RiskMapSection } from '../sections/RiskMapSection';
import { DashboardSection } from '../sections/DashboardSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { ImpactSection } from '../sections/ImpactSection';
import { TechStackSection } from '../sections/TechStackSection';
import { AboutNERSection } from '../sections/AboutNERSection';
import { TeamSection } from '../sections/TeamSection';
import { FinalCTASection } from '../sections/FinalCTASection';
import { FooterSection } from '../sections/FooterSection';
import type { AuthUser } from '../types';

interface LandingPageProps {
  onOpenPlatform: () => void;
  onOpenSignIn?: () => void;
  onOpenPlatformRouting?: (origin: string, dest: string) => void;
  onOpenFullGIS?: () => void;
  currentUser?: AuthUser | null;
  onSignOut?: () => void;
}

export function LandingPage({
  onOpenPlatform,
  onOpenSignIn,
  onOpenPlatformRouting,
  onOpenFullGIS,
  currentUser,
  onSignOut,
}: LandingPageProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-blue-600/20 selection:text-blue-900">
      {/* Sticky Clean Navbar */}
      <LandingNavbar
        onOpenPlatform={onOpenPlatform}
        onOpenSignIn={onOpenSignIn}
        onNavigateSection={scrollToSection}
        currentUser={currentUser}
        onSignOut={onSignOut}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenPlatform={onOpenPlatform}
          onExploreMap={() => scrollToSection('risk-map')}
        />

        {/* 2. Platform Capabilities Cards */}
        <CapabilitiesSection />

        {/* 3. Bento Grid - Platform Overview */}
        <BentoGridSection
          onOpenPlatform={onOpenPlatform}
          onOpenRiskMap={() => scrollToSection('risk-map')}
        />

        {/* 4. AI Intelligence Pipeline */}
        <AIIntelligenceSection />

        {/* 5. Smart Routing Demonstration (Route A vs Route B) */}
        <SmartRoutingSection onOpenPlatformRouting={onOpenPlatformRouting} />

        {/* 6. NER Digital GIS Risk Map */}
        <RiskMapSection onOpenFullGIS={onOpenFullGIS || onOpenPlatform} />

        {/* 7. Real-Time Analytics Dashboard Preview */}
        <DashboardSection onOpenPlatform={onOpenPlatform} />

        {/* 8. Operational Lifecycle (How it Works) */}
        <HowItWorksSection />

        {/* 9. Regional Impact */}
        <ImpactSection />

        {/* 10. Technology Stack */}
        <TechStackSection />

        {/* 11. About North East Region Story */}
        <AboutNERSection />

        {/* 12. Multidisciplinary Team Section */}
        <TeamSection />

        {/* 13. Final CTA */}
        <FinalCTASection
          onOpenPlatform={onOpenPlatform}
          onExploreRiskMap={() => scrollToSection('risk-map')}
        />
      </main>

      {/* Footer */}
      <FooterSection
        onOpenPlatform={onOpenPlatform}
        onNavigateSection={scrollToSection}
      />
    </div>
  );
}
