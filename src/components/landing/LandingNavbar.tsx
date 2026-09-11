import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import type { AuthUser } from '../../types';

interface LandingNavbarProps {
  onOpenPlatform: () => void;
  onOpenSignIn?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  currentUser?: AuthUser | null;
  onSignOut?: () => void;
}

export function LandingNavbar({
  onOpenPlatform,
  onOpenSignIn,
  onNavigateSection,
  currentUser,
  onSignOut,
}: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Platform', href: '#platform-overview' },
    { label: 'AI Intelligence', href: '#ai-intelligence' },
    { label: 'Risk Map', href: '#risk-map' },
    { label: 'Smart Routing', href: '#smart-routing' },
    { label: 'Features', href: '#features' },
    { label: 'About NER', href: '#about-ner' },
    { label: 'Team', href: '#team' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#hero');
            }}
            className="flex flex-col group"
          >
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl text-slate-900 tracking-tight leading-none">
                NER-Logistics
              </span>
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                AI + GIS
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium tracking-wide mt-1">
              North East Intelligence Engine
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[130px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono font-medium">
                    {currentUser.role}
                  </span>
                </div>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                    title="Sign Out Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenSignIn || onOpenPlatform}
                className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={onOpenPlatform}
              className="ner-btn-primary px-4.5 py-2.5 text-sm font-semibold flex items-center gap-2 group shadow-sm"
            >
              <span>Platform Console</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            {currentUser ? (
              <span className="text-xs font-semibold px-2.5 py-1 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
                {currentUser.role.split(' ')[0]}
              </span>
            ) : (
              <button
                onClick={onOpenSignIn || onOpenPlatform}
                className="text-xs font-semibold px-2.5 py-1 text-slate-700 hover:text-blue-700"
              >
                Sign In
              </button>
            )}
            <button
              onClick={onOpenPlatform}
              className="ner-btn-primary px-3 py-1.5 text-xs font-medium sm:hidden"
            >
              Platform
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fade-in">
          <div className="grid grid-cols-2 gap-1 py-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-left px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-md"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-slate-800">{currentUser.fullName}</span>
                    <span className="text-[10px] text-blue-600 font-mono">{currentUser.phoneNumber}</span>
                  </div>
                </div>
                {onSignOut && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSignIn) onOpenSignIn();
                  else onOpenPlatform();
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlatform();
              }}
              className="w-full ner-btn-primary py-2.5 text-sm font-semibold text-center flex items-center justify-center gap-2"
            >
              <span>Platform Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
