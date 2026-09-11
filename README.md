# NER-SHIELD: Smart Logistics & Disruption Intelligence Platform
### Smart India Hackathon 2026 Prototype — Problem Statement: SIH26002

This folder contains the complete, self-contained, working prototype and database for **NER-SHIELD**.

---

## 🚀 How to Run the Website

### Option 1: Development Server (Instant Live Reload)
`ash
npm run dev
`
Open your browser at: http://localhost:5173

### Option 2: Production Preview Build
`ash
npm run preview
`
Or view the pre-compiled production build inside the dist/ folder

---

## 📁 Project Structure

`
Final_Prototype_SIH26/
├── src/                    # Complete React + TypeScript + Tailwind source code
│   ├── components/         # Dashboard, GIS maps, Weather Radar, AI Route Optimizer, Incidents
│   ├── pages/              # Landing Page, Sign In Page (TextBee OTP)
│   ├── services/           # api.ts (Spatial intelligence & data service), authService.ts
│   ├── types/              # TypeScript interface definitions
│   └── index.css           # Custom styles, Leaflet map layers, animations
├── database/               # Complete Database Files
│   ├── districts.json      # 8 North Eastern States district telemetry & coordinates
│   ├── road_segments.json  # Highway corridors, risk ratings, and disruption probabilities
│   ├── fleets.json         # Real-time logistics supply convoys & vehicle tracking
│   ├── incidents.json      # Landslides, flash floods, and chokepoints
│   ├── weather.json        # Mountain weather telemetry & Doppler radar storm alerts
│   ├── routes.json         # Multimodal alternate bypass routes and AI recommendations
│   ├── kpis.json           # Accessibility indices and logistics operational KPIs
│   └── schema.sql          # Relational / PostgreSQL database schema
├── public/                 # Static assets and icons
├── dist/                   # Production-compiled bundle ready for deployment
├── Agent.md                # SIH Architecture, requirements & problem statement details
├── vite.config.ts          # Vite configuration with TextBee SMS API reverse proxy
├── tailwind.config.js      # Custom theme colors and layout extensions
└── package.json            # Project dependencies and run scripts
`

---

## 🔑 TextBee SMS OTP Connection
- **API Key**: 	xb_kfocljUl5G9bplOkm77nkLVi0jcB8qzJ
- **Configured in**: src/services/authService.ts & ite.config.ts
- **Fallback / Testing**: If no physical Android SMS device is connected in the TextBee dashboard, the system displays the generated OTP in a convenient dev card on screen, and universal demo code 123456 is also supported.

---

## 🗺️ Mapping & GIS Engine
- Powered by **OpenStreetMap** with custom mountain logistics overlays.
- Live radar simulation, geo-tagged hazard reporting, and road disruption bypass routing.
