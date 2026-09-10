-- NER-SHIELD: Supabase Realtime Database Schema & Calamity Siren Integration
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    state VARCHAR(50) NOT NULL,
    accessibility_score INT NOT NULL DEFAULT 80,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'Low',
    active_incidents INT DEFAULT 0,
    major_highway VARCHAR(100),
    elevation VARCHAR(50),
    weather_summary VARCHAR(150),
    rainfall_mm NUMERIC(6, 2) DEFAULT 0.0,
    road_status VARCHAR(50) DEFAULT 'Open',
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Road Segments Table
CREATE TABLE IF NOT EXISTS road_segments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    risk_score INT NOT NULL DEFAULT 20,
    disruption_reason TEXT,
    detour_available BOOLEAN DEFAULT FALSE,
    detour_route_name VARCHAR(150),
    length_km NUMERIC(8, 2) NOT NULL,
    lanes VARCHAR(50),
    avg_speed_kmh INT,
    clearance_eta VARCHAR(100),
    traffic_volume VARCHAR(50),
    coordinates JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vehicle Fleets Table (Driver Tracking)
CREATE TABLE IF NOT EXISTS vehicle_fleets (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    cargo_type VARCHAR(150) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'On Schedule',
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    speed_kmh INT DEFAULT 45,
    eta_min INT DEFAULT 120,
    risk_level VARCHAR(20) DEFAULT 'Low',
    driver_phone VARCHAR(20),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Disruption Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    location VARCHAR(200) NOT NULL,
    district_id VARCHAR(50),
    district_name VARCHAR(100),
    coordinates JSONB NOT NULL,
    verified_by_ai BOOLEAN DEFAULT TRUE,
    reports_count INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Weather Telemetry Table
CREATE TABLE IF NOT EXISTS weather_telemetry (
    id SERIAL PRIMARY KEY,
    district_id VARCHAR(50) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    temperature_c NUMERIC(4, 1),
    condition VARCHAR(100),
    rainfall_mm NUMERIC(6, 2),
    wind_speed_kmh INT,
    visibility_meters INT,
    landslide_risk_index INT,
    flash_flood_risk_index INT,
    warning_level VARCHAR(20),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Calamity Alerts & Driver Siren System Table
CREATE TABLE IF NOT EXISTS calamity_alerts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    calamity_type VARCHAR(100) NOT NULL, -- e.g. 'Earthquake', 'Landslide', 'Flash Flood', 'Severe Tempest'
    severity VARCHAR(20) NOT NULL DEFAULT 'Critical', -- 'Critical', 'High', 'Moderate'
    location VARCHAR(200) NOT NULL,
    district_id VARCHAR(50),
    affected_highway VARCHAR(100),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    active BOOLEAN DEFAULT TRUE,
    sound_siren BOOLEAN DEFAULT TRUE,
    message TEXT NOT NULL,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Supabase Realtime for Calamity Alerts and Incidents
ALTER PUBLICATION supabase_realtime ADD TABLE calamity_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_fleets;

-- Row Level Security (RLS) setup (Public access for hackathon demo)
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_fleets ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE calamity_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on road_segments" ON road_segments FOR SELECT USING (true);
CREATE POLICY "Allow public read access on vehicle_fleets" ON vehicle_fleets FOR SELECT USING (true);
CREATE POLICY "Allow public all access on vehicle_fleets" ON vehicle_fleets FOR ALL USING (true);
CREATE POLICY "Allow public read access on incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on incidents" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on weather_telemetry" ON weather_telemetry FOR SELECT USING (true);
CREATE POLICY "Allow public all access on calamity_alerts" ON calamity_alerts FOR ALL USING (true);
