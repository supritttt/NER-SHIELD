-- NER-SHIELD: AI-Based Smart Logistics & Disruption Prediction Database Schema
-- SIH Problem Statement: SIH26002
-- Database: PostgreSQL / PostGIS / SQLite compatible

-- 1. Districts Telemetry & Regional Strategic Hubs
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Strategic Mountain Highways & Transport Corridors
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
    avg_speed_kmh INT DEFAULT 45,
    clearance_eta VARCHAR(100),
    traffic_volume VARCHAR(50),
    coordinates JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Commercial & Essential Logistics Fleets (Driver Tracking)
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Disruption Incidents & Hazards (Geotagged SDRF / Crowd-sourced Logs)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Weather Telemetry & Mountain Pass Monitoring Stations
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
    warning_level VARCHAR(20) DEFAULT 'None',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Calamity Alerts & Driver Siren Emergency Broadcast System
CREATE TABLE IF NOT EXISTS calamity_alerts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    calamity_type VARCHAR(100) NOT NULL, -- e.g. 'Earthquake', 'Landslide', 'Flash Flood', 'Severe Tempest'
    severity VARCHAR(20) NOT NULL DEFAULT 'Critical', -- 'Critical', 'Severe', 'High'
    location VARCHAR(200) NOT NULL,
    district_id VARCHAR(50),
    affected_highway VARCHAR(100),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    active BOOLEAN DEFAULT TRUE,
    sound_siren BOOLEAN DEFAULT TRUE,
    message TEXT NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
