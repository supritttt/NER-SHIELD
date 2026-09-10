/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ner: {
          brand: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#0f172a',
          },
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          safe: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          ai: '#2563eb',
        },
        tactical: {
          bg: '#080b11',
          surface: '#0d111a',
          card: '#111622',
          cardElevated: '#151c2b',
          well: '#0a0d15',
          border: '#1c2436',
          borderLight: '#263147',
          borderHighlight: 'rgba(56, 189, 248, 0.25)',
        },
        cyber: {
          cyan: '#0ea5e9',
          cyanGlow: 'rgba(14, 165, 233, 0.25)',
          emerald: '#10b981',
          emeraldGlow: 'rgba(16, 185, 129, 0.25)',
          amber: '#f59e0b',
          amberGlow: 'rgba(245, 158, 11, 0.25)',
          rose: '#ef4444',
          roseGlow: 'rgba(239, 68, 68, 0.25)',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Courier New', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'clean-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'clean-card': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'clean-elevated': '0 10px 25px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'tactical-sm': '0 1px 3px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)',
        'tactical-md': '0 4px 16px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'tactical-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.07)',
        'glow-cyan': '0 0 20px rgba(14, 165, 233, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-rose': '0 0 20px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
