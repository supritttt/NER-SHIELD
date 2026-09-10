-- NER-SHIELD: AI-Based Smart Logistics & Disruption Prediction Database Schema
-- SIH Problem Statement: SIH26002
-- Database: PostgreSQL / SQLite compatible

CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    state VARCHAR(50) NOT NULL,
    accessibility_score INT NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
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

CREATE TABLE IF NOT EXISTS road_segments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    highway_code VARCHAR(50) NOT NULL,
    from_district VARCHAR(100) NOT NULL,
    to_district VARCHAR(100) NOT NULL,
    distance_km NUMERIC(8, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    risk_factor VARCHAR(20) NOT NULL,
    disruption_probability NUMERIC(5, 2) NOT NULL,
    current_hazards TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_fleets (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    cargo_type VARCHAR(150) NOT NULL,
    driver_name VARCHAR(100),
    driver_contact VARCHAR(20),
    speed_kmh NUMERIC(5, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    highway VARCHAR(100),
    reported_at TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    clearance_eta_hours INT,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    description TEXT,
    reporter VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS weather_telemetry (
    id VARCHAR(50) PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    temperature_c NUMERIC(4, 1),
    humidity_pct INT,
    rainfall_24h_mm NUMERIC(6, 2),
    forecast VARCHAR(100),
    radar_storm_alert BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
