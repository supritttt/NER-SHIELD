#!/usr/bin/env python3
"""
NER-SHIELD: Synthetic Dataset & Seed Generator for SIH26002
Problem Statement: AI-Based Smart Logistics & Accessibility Intelligence Platform for the North Eastern Region (NER)

This script generates:
1. ml_training_dataset.csv (1,200+ samples with physically realistic weather, terrain, and disruption correlations)
2. seed_data.sql (Ready for PostgreSQL / Supabase)
3. complete_ner_dataset.json (Unified multi-state regional data)
"""

import csv
import json
import math
import os
import random
from datetime import datetime, timedelta

# Fix seed for reproducibility
random.seed(42)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# 1. North Eastern Region (NER) Geographic Master Data (All 8 States)
# ---------------------------------------------------------------------------
NER_LOCATIONS = [
    # Assam
    {
        "state": "Assam",
        "district": "Kamrup Metropolitan (Guwahati)",
        "district_id": "dist-kamrup",
        "highway": "NH-27",
        "segment_name": "Guwahati - Saraighat - Rangia Corridor",
        "elevation_base": 55,
        "slope_base": 8,
        "landslide_freq": 2,
        "drainage_base": 65,
        "road_quality": 82,
        "lat": 26.1445,
        "lon": 91.7362,
        "terrain_type": "Valley River Basin"
    },
    {
        "state": "Assam",
        "district": "Cachar (Silchar)",
        "district_id": "dist-cachar",
        "highway": "NH-37 / NH-6",
        "segment_name": "Silchar - Badarpur - Kalain Pass",
        "elevation_base": 35,
        "slope_base": 12,
        "landslide_freq": 4,
        "drainage_base": 45,
        "road_quality": 68,
        "lat": 24.8170,
        "lon": 92.8000,
        "terrain_type": "Barak Valley Floodplain"
    },
    {
        "state": "Assam",
        "district": "Dima Hasao (Haflong)",
        "district_id": "dist-dima-hasao",
        "highway": "NH-27",
        "segment_name": "Haflong Hill Section - Jatinga Valley",
        "elevation_base": 960,
        "slope_base": 38,
        "landslide_freq": 9,
        "drainage_base": 35,
        "road_quality": 55,
        "lat": 25.1680,
        "lon": 93.0200,
        "terrain_type": "Rugged Mountain Range"
    },
    # Meghalaya
    {
        "state": "Meghalaya",
        "district": "East Khasi Hills (Shillong)",
        "district_id": "dist-east-khasi",
        "highway": "NH-6",
        "segment_name": "Umiam - Mawlai - Shillong Peak Bypass",
        "elevation_base": 1525,
        "slope_base": 32,
        "landslide_freq": 6,
        "drainage_base": 50,
        "road_quality": 75,
        "lat": 25.5788,
        "lon": 91.8933,
        "terrain_type": "Highland Plateau"
    },
    {
        "state": "Meghalaya",
        "district": "East Jaintia Hills (Sonapur)",
        "district_id": "dist-east-jaintia",
        "highway": "NH-6",
        "segment_name": "Sonapur Tunnel - Lukha River Gorge Lifeline",
        "elevation_base": 890,
        "slope_base": 48,
        "landslide_freq": 10,
        "drainage_base": 25,
        "road_quality": 45,
        "lat": 25.3117,
        "lon": 92.4285,
        "terrain_type": "Severe Mudslide Karst Chokepoint"
    },
    # Arunachal Pradesh
    {
        "state": "Arunachal Pradesh",
        "district": "Tawang & West Kameng",
        "district_id": "dist-tawang",
        "highway": "NH-13",
        "segment_name": "Bhalukpong - Bomdila - Sela Pass (4,170m)",
        "elevation_base": 3048,
        "slope_base": 45,
        "landslide_freq": 8,
        "drainage_base": 40,
        "road_quality": 58,
        "lat": 27.5861,
        "lon": 91.8594,
        "terrain_type": "Eastern Himalayan Alpine"
    },
    {
        "state": "Arunachal Pradesh",
        "district": "Papum Pare (Itanagar)",
        "district_id": "dist-papum-pare",
        "highway": "NH-415",
        "segment_name": "Holongi - Itanagar - Naharlagun Arterial",
        "elevation_base": 320,
        "slope_base": 24,
        "landslide_freq": 5,
        "drainage_base": 55,
        "road_quality": 70,
        "lat": 27.0844,
        "lon": 93.6053,
        "terrain_type": "Sub-Himalayan Foothills"
    },
    # Manipur
    {
        "state": "Manipur",
        "district": "Imphal West (Imphal)",
        "district_id": "dist-imphal-west",
        "highway": "NH-102",
        "segment_name": "Imphal - Thoubal - Moreh Trans-Asian Highway",
        "elevation_base": 786,
        "slope_base": 14,
        "landslide_freq": 3,
        "drainage_base": 50,
        "road_quality": 68,
        "lat": 24.8170,
        "lon": 93.9368,
        "terrain_type": "Manipur Central Valley"
    },
    {
        "state": "Manipur",
        "district": "Noney & Tamenglong",
        "district_id": "dist-noney",
        "highway": "NH-37",
        "segment_name": "Noney Tupul - Makru Bridge Mountain Link",
        "elevation_base": 980,
        "slope_base": 42,
        "landslide_freq": 9,
        "drainage_base": 30,
        "road_quality": 50,
        "lat": 24.7800,
        "lon": 93.5800,
        "terrain_type": "Steep Hillside Chokepoint"
    },
    # Mizoram
    {
        "state": "Mizoram",
        "district": "Aizawl & Kolasib",
        "district_id": "dist-aizawl",
        "highway": "NH-306",
        "segment_name": "Vairengte Gateway - Hunthar Slope - Aizawl",
        "elevation_base": 1132,
        "slope_base": 36,
        "landslide_freq": 8,
        "drainage_base": 38,
        "road_quality": 60,
        "lat": 23.7271,
        "lon": 92.7176,
        "terrain_type": "North-South Structural Ridge"
    },
    {
        "state": "Mizoram",
        "district": "Lunglei",
        "district_id": "dist-lunglei",
        "highway": "NH-54",
        "segment_name": "Thenzawl - Lunglei Southern Lifeline",
        "elevation_base": 1222,
        "slope_base": 34,
        "landslide_freq": 6,
        "drainage_base": 42,
        "road_quality": 58,
        "lat": 22.8800,
        "lon": 92.7300,
        "terrain_type": "Rugged Mountain Escarpment"
    },
    # Nagaland
    {
        "state": "Nagaland",
        "district": "Kohima & Dimapur",
        "district_id": "dist-kohima",
        "highway": "NH-29",
        "segment_name": "Dimapur Bypass - Pagla Pahar - Kohima Ridge",
        "elevation_base": 1444,
        "slope_base": 40,
        "landslide_freq": 9,
        "drainage_base": 32,
        "road_quality": 52,
        "lat": 25.6751,
        "lon": 94.1086,
        "terrain_type": "Active Tectonic Sinking Zone"
    },
    {
        "state": "Nagaland",
        "district": "Mokokchung",
        "district_id": "dist-mokokchung",
        "highway": "NH-702",
        "segment_name": "Amguri - Tuli - Mokokchung Industrial Corridor",
        "elevation_base": 1325,
        "slope_base": 28,
        "landslide_freq": 5,
        "drainage_base": 48,
        "road_quality": 62,
        "lat": 26.3200,
        "lon": 94.5200,
        "terrain_type": "Hilly Ridge Crest"
    },
    # Sikkim
    {
        "state": "Sikkim",
        "district": "Gangtok & Mangan",
        "district_id": "dist-gangtok",
        "highway": "NH-10",
        "segment_name": "Rangpo Border - 29th Mile Teesta Gorge - Gangtok",
        "elevation_base": 1650,
        "slope_base": 50,
        "landslide_freq": 10,
        "drainage_base": 20,
        "road_quality": 48,
        "lat": 27.3389,
        "lon": 88.6065,
        "terrain_type": "Teesta River Canyon Chokepoint"
    },
    {
        "state": "Sikkim",
        "district": "Pakyong (Airport Corridor)",
        "district_id": "dist-pakyong",
        "highway": "NH-717A",
        "segment_name": "Rorathang - Pakyong Multi-Modal Link",
        "elevation_base": 1350,
        "slope_base": 35,
        "landslide_freq": 7,
        "drainage_base": 40,
        "road_quality": 65,
        "lat": 27.2400,
        "lon": 88.6000,
        "terrain_type": "Hill Slope Terraces"
    },
    # Tripura
    {
        "state": "Tripura",
        "district": "West Tripura (Agartala)",
        "district_id": "dist-west-tripura",
        "highway": "NH-8",
        "segment_name": "Churaibari Gate - Teliamura - Agartala Arterial",
        "elevation_base": 15,
        "slope_base": 10,
        "landslide_freq": 3,
        "drainage_base": 60,
        "road_quality": 78,
        "lat": 23.8315,
        "lon": 91.2868,
        "terrain_type": "Tripura Plain / Low Hillocks"
    }
]


# ---------------------------------------------------------------------------
# 2. Generator Logic for ML Training Dataset
# ---------------------------------------------------------------------------
def generate_ml_training_dataset(filename="ml_training_dataset.csv", num_samples=1250):
    filepath = os.path.join(BASE_DIR, filename)
    headers = [
        "record_id",
        "timestamp",
        "state",
        "district",
        "highway_code",
        "segment_name",
        "terrain_type",
        "elevation_m",
        "slope_angle_deg",
        "road_quality_index",
        "drainage_capacity_index",
        "historical_landslide_freq",
        "rainfall_24h_mm",
        "cumulative_rainfall_7d_mm",
        "soil_moisture_pct",
        "temperature_c",
        "humidity_pct",
        "visibility_m",
        "wind_speed_kmh",
        "seismic_magnitude_usgs",
        "heavy_vehicle_volume_per_hr",
        "disruption_occurred",
        "disruption_type",
        "risk_score",
        "delay_minutes",
        "accessibility_status"
    ]

    start_date = datetime(2025, 4, 1)
    records = []

    for i in range(1, num_samples + 1):
        loc = random.choice(NER_LOCATIONS)
        
        # Random date between April 2025 and October 2026 (spanning 2 monsoons)
        day_offset = random.randint(0, 560)
        curr_time = start_date + timedelta(days=day_offset, hours=random.randint(0, 23), minutes=random.randint(0, 59))
        month = curr_time.month

        # Monsoon effect: June to September has extreme rainfall
        is_monsoon = month in [6, 7, 8, 9]
        is_pre_monsoon = month in [4, 5]
        is_winter = month in [11, 12, 1, 2]

        if is_monsoon:
            rain_24h = max(0.0, round(random.gauss(65.0, 45.0), 1))
            cum_rain_7d = max(rain_24h, round(rain_24h * random.uniform(2.5, 5.5), 1))
            soil_moisture = min(99.0, max(45.0, round(random.gauss(82.0, 10.0), 1)))
            humidity = min(99, max(65, int(random.gauss(88, 8))))
        elif is_pre_monsoon:
            rain_24h = max(0.0, round(random.gauss(25.0, 25.0), 1))
            cum_rain_7d = max(rain_24h, round(rain_24h * random.uniform(1.8, 3.2), 1))
            soil_moisture = min(90.0, max(30.0, round(random.gauss(60.0, 15.0), 1)))
            humidity = min(95, max(45, int(random.gauss(72, 12))))
        else: # Dry / Winter
            rain_24h = max(0.0, round(random.expovariate(0.3), 1)) if random.random() < 0.25 else 0.0
            cum_rain_7d = max(rain_24h, round(rain_24h * random.uniform(1.0, 2.0), 1))
            soil_moisture = min(70.0, max(15.0, round(random.gauss(35.0, 10.0), 1)))
            humidity = min(90, max(30, int(random.gauss(55, 12))))

        # Elevation and slope variation around base
        elevation = max(15, int(loc["elevation_base"] + random.gauss(0, loc["elevation_base"] * 0.08)))
        slope = max(2, min(65, int(loc["slope_base"] + random.gauss(0, 4))))
        
        # Temperature is inverse to elevation
        lapse_rate = (elevation / 1000.0) * 6.5
        base_temp = 32.0 if is_monsoon else (26.0 if is_pre_monsoon else 18.0)
        temp_c = round(base_temp - lapse_rate + random.gauss(0, 2.5), 1)

        # Fog during winter in high altitude or valleys
        if is_winter and (elevation > 1200 or elevation < 100) and random.random() < 0.35:
            visibility = random.randint(40, 250)
            fog_event = True
        else:
            visibility = random.randint(800, 10000)
            fog_event = False

        wind_kmh = max(2, int(random.gauss(14, 8)))

        # Seismic activity (occasional tremors in NER Zone V)
        if random.random() < 0.08:
            seismic_mag = round(random.uniform(2.5, 5.4), 1)
        else:
            seismic_mag = 0.0

        heavy_traffic = max(5, int(random.gauss(120, 60)))
        drainage = max(10, min(95, int(loc["drainage_base"] + random.gauss(0, 5))))
        road_qual = max(15, min(95, int(loc["road_quality"] + random.gauss(0, 5))))
        hist_landslide = loc["landslide_freq"]

        # Physics-driven Disruption & Risk Calculation
        # Risk factors: Rain (weight 0.35), Slope (0.25), Soil Moisture (0.20), Seismic (0.10), Hist Freq (0.10)
        rain_norm = min(100.0, (rain_24h / 150.0) * 100.0)
        cum_rain_norm = min(100.0, (cum_rain_7d / 400.0) * 100.0)
        slope_norm = min(100.0, (slope / 55.0) * 100.0)
        soil_norm = soil_moisture
        seismic_contrib = (seismic_mag / 6.0) * 100.0 if seismic_mag > 0 else 0.0
        hist_norm = hist_landslide * 10.0

        raw_risk = (
            0.25 * rain_norm +
            0.15 * cum_rain_norm +
            0.20 * slope_norm +
            0.15 * soil_norm +
            0.10 * hist_norm +
            0.10 * seismic_contrib +
            (100 - road_qual) * 0.05
        )

        risk_score = min(99, max(5, int(raw_risk + random.gauss(0, 3))))

        # Determine Disruption Type and Status
        disruption_occurred = 0
        disruption_type = "Clear"
        delay_mins = 0
        status = "Open"

        if risk_score >= 82 or (rain_24h > 120 and slope > 35) or (seismic_mag >= 4.5 and slope > 30):
            disruption_occurred = 1
            status = "Blocked"
            if rain_24h > 140 and drainage < 40:
                disruption_type = "Flash Flood"
                delay_mins = random.randint(240, 720)
            elif slope > 40 and (rain_24h > 90 or cum_rain_7d > 250):
                disruption_type = "Mudflow"
                delay_mins = random.randint(300, 840)
            elif slope > 30:
                disruption_type = "Landslide"
                delay_mins = random.randint(180, 600)
            else:
                disruption_type = "Road Washout"
                delay_mins = random.randint(360, 960)

        elif risk_score >= 58 or (rain_24h > 60 and slope > 25) or fog_event:
            disruption_occurred = 1 if not (random.random() < 0.3) else 0
            status = "Caution" if disruption_occurred else "Open"
            if fog_event and visibility < 100:
                disruption_type = "Dense Fog Blockage"
                delay_mins = random.randint(45, 150)
            elif slope > 35 and (rain_24h > 40 or seismic_mag > 3.0):
                disruption_type = "Rockfall"
                delay_mins = random.randint(60, 240)
            elif rain_24h > 70:
                disruption_type = "Severe Waterlogging"
                delay_mins = random.randint(45, 180)
            else:
                disruption_type = "Minor Slump & Slippage" if disruption_occurred else "Clear"
                delay_mins = random.randint(30, 90) if disruption_occurred else 0

        else:
            disruption_occurred = 0
            disruption_type = "Clear"
            status = "Open"
            delay_mins = random.randint(0, 15)

        records.append([
            f"REC-{i:05d}",
            curr_time.strftime("%Y-%m-%d %H:%M:%S"),
            loc["state"],
            loc["district"],
            loc["highway"],
            loc["segment_name"],
            loc["terrain_type"],
            elevation,
            slope,
            road_qual,
            drainage,
            hist_landslide,
            rain_24h,
            cum_rain_7d,
            soil_moisture,
            temp_c,
            humidity,
            visibility,
            wind_kmh,
            seismic_mag,
            heavy_traffic,
            disruption_occurred,
            disruption_type,
            risk_score,
            delay_mins,
            status
        ])

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(records)

    print(f"Generated {len(records)} ML training records -> {filepath}")
    return filepath


# ---------------------------------------------------------------------------
# 3. Generator Logic for SQL Database Seed (`seed_data.sql`)
# ---------------------------------------------------------------------------
def generate_sql_seed(filename="seed_data.sql"):
    filepath = os.path.join(BASE_DIR, filename)

    sql_content = """-- ============================================================================
-- NER-SHIELD: Complete Seed Dataset for SIH26002
-- Covers all 8 North Eastern States (Assam, Meghalaya, Arunachal Pradesh, 
-- Manipur, Mizoram, Nagaland, Sikkim, Tripura)
-- Compatible with PostgreSQL & Supabase
-- ============================================================================

-- Clean existing seed data (optional, preserves schema)
TRUNCATE TABLE calamity_alerts CASCADE;
TRUNCATE TABLE weather_telemetry CASCADE;
TRUNCATE TABLE incidents CASCADE;
TRUNCATE TABLE vehicle_fleets CASCADE;
TRUNCATE TABLE road_segments CASCADE;
TRUNCATE TABLE districts CASCADE;

-- ---------------------------------------------------------------------------
-- 1. DISTRICTS TELEMETRY & LOGISTICS HUBS
-- ---------------------------------------------------------------------------
INSERT INTO districts (id, name, state, accessibility_score, risk_level, active_incidents, major_highway, elevation, weather_summary, rainfall_mm, road_status, latitude, longitude) VALUES
('dist-kamrup', 'Kamrup Metropolitan (Guwahati)', 'Assam', 92, 'Low', 1, 'NH-27 / AH-1', '55m MSL', 'Light Drizzle, 28°C', 12.4, 'Open', 26.1445, 91.7362),
('dist-cachar', 'Cachar (Silchar)', 'Assam', 74, 'Moderate', 2, 'NH-37 / NH-6', '35m MSL', 'Cloudy Rains, 27°C', 38.0, 'Caution', 24.8170, 92.8000),
('dist-dima-hasao', 'Dima Hasao (Haflong)', 'Assam', 42, 'Severe', 3, 'NH-27', '960m MSL', 'Torrential Mountain Showers, 22°C', 78.4, 'Blocked', 25.1680, 93.0200),
('dist-east-khasi', 'East Khasi Hills (Shillong)', 'Meghalaya', 78, 'Moderate', 2, 'NH-6', '1,525m MSL', 'Heavy Mist & Mountain Rains, 18°C', 45.8, 'Caution', 25.5788, 91.8933),
('dist-east-jaintia', 'East Jaintia Hills (Sonapur)', 'Meghalaya', 36, 'Severe', 4, 'NH-6', '890m MSL', 'Torrential Downpour, 21°C', 88.2, 'Blocked', 25.3117, 92.4285),
('dist-ri-bhoi', 'Ri-Bhoi (Nongpoh)', 'Meghalaya', 84, 'Low', 1, 'NH-6', '485m MSL', 'Intermittent Rain, 24°C', 22.0, 'Open', 25.9000, 91.8800),
('dist-tawang', 'Tawang & West Kameng', 'Arunachal Pradesh', 54, 'High', 3, 'NH-13', '3,048m MSL', 'Freezing Fog & Rockfall Alert, 8°C', 31.0, 'Caution', 27.5861, 91.8594),
('dist-papum-pare', 'Papum Pare (Itanagar)', 'Arunachal Pradesh', 72, 'Moderate', 1, 'NH-415', '320m MSL', 'Scattered Downpour, 26°C', 34.5, 'Open', 27.0844, 93.6053),
('dist-imphal-west', 'Imphal West (Imphal)', 'Manipur', 68, 'Moderate', 2, 'NH-102', '786m MSL', 'Overcast & Humidity, 24°C', 18.5, 'Open', 24.8170, 93.9368),
('dist-noney', 'Noney & Tamenglong', 'Manipur', 38, 'Severe', 4, 'NH-37', '980m MSL', 'Heavy Thunderstorm & Mudflow, 21°C', 84.0, 'Blocked', 24.7800, 93.5800),
('dist-aizawl', 'Aizawl & Kolasib', 'Mizoram', 62, 'High', 2, 'NH-306', '1,132m MSL', 'Continuous Drizzle, 20°C', 42.1, 'Caution', 23.7271, 92.7176),
('dist-lunglei', 'Lunglei', 'Mizoram', 66, 'Moderate', 1, 'NH-54', '1,222m MSL', 'Scattered Showers, 22°C', 28.0, 'Open', 22.8800, 92.7300),
('dist-kohima', 'Kohima & Dimapur', 'Nagaland', 48, 'High', 3, 'NH-29', '1,444m MSL', 'Active Mudslide Alert, 17°C', 52.4, 'Caution', 25.6751, 94.1086),
('dist-mokokchung', 'Mokokchung', 'Nagaland', 70, 'Moderate', 1, 'NH-702', '1,325m MSL', 'Passing Showers, 19°C', 24.0, 'Open', 26.3200, 94.5200),
('dist-gangtok', 'Gangtok & Mangan', 'Sikkim', 40, 'Severe', 5, 'NH-10', '1,650m MSL', 'Teesta Flash Flood Warning, 15°C', 96.4, 'Blocked', 27.3389, 88.6065),
('dist-west-tripura', 'West Tripura (Agartala)', 'Tripura', 88, 'Low', 0, 'NH-8', '15m MSL', 'Clear Skies, 30°C', 4.2, 'Open', 23.8315, 91.2868);

-- ---------------------------------------------------------------------------
-- 2. STRATEGIC HIGHWAY CORRIDORS & ROAD SEGMENTS
-- ---------------------------------------------------------------------------
INSERT INTO road_segments (id, name, code, state, status, risk_score, disruption_reason, detour_available, detour_route_name, length_km, lanes, avg_speed_kmh, clearance_eta, traffic_volume, coordinates) VALUES
('seg-nh6-sonapur', 'NH-6 Guwahati - Sonapur - Silchar Lifeline', 'NH-6', 'Meghalaya', 'Blocked', 94, 'Massive mudslide & rockfall blocking both carriageways at Sonapur Tunnel portal (KM 132). 60m sludge.', true, 'Alternate Haflong-Umrangso bypass (NH-27 / SH-19)', 312.0, '2-Lane Hill Corridor', 0, 'Est. Clearance: 6h 30m', '8,450 PCU/day', '[[26.1445, 91.7362], [25.9, 91.82], [25.5788, 91.8933], [25.43, 92.15], [25.3117, 92.4285], [25.05, 92.65], [24.817, 92.8]]'),
('seg-nh27-east-west', 'NH-27 East-West Expressway (Guwahati - Nagaon - Lumding)', 'NH-27', 'Assam', 'Open', 18, 'Pavement resurfacing near Jagiroad bypass. Traffic moving at normal hill speeds.', false, NULL, 185.0, '4-Lane Divided Highway', 68, 'All Clear', '18,200 PCU/day', '[[26.1445, 91.7362], [26.19, 92.15], [26.34, 92.68], [25.75, 93.18]]'),
('seg-nh10-teesta', 'NH-10 Siliguri - Teesta Gorge - Gangtok Lifeline', 'NH-10', 'Sikkim', 'Blocked', 96, 'Teesta River flash flood breached 120m roadway at 29th Mile. BRO Heavy Earthmovers deployed.', true, 'Melli - Jorethang - Namchi High-Ridge bypass', 114.0, '2-Lane Mountain Defile', 0, 'Est. Clearance: 14h', '6,800 PCU/day', '[[26.7271, 88.3953], [27.05, 88.48], [27.18, 88.52], [27.3389, 88.6065]]'),
('seg-nh13-sela', 'NH-13 Trans-Arunachal Highway (Bhalukpong - Sela Pass)', 'NH-13', 'Arunachal Pradesh', 'Caution', 72, 'Dense fog reducing visibility below 30m; minor rockfalls between Jaswant Garh and Sela Tunnel portal.', false, NULL, 180.0, '2-Lane BRO Strategic Link', 28, 'Slow Traffic (Convoys Only)', '2,900 PCU/day', '[[27.01, 92.63], [27.25, 92.42], [27.5, 92.1], [27.5861, 91.8594]]'),
('seg-nh29-pagla', 'NH-29 Dimapur - Pagla Pahar - Kohima Lifeline', 'NH-29', 'Nagaland', 'Caution', 68, 'Active sinking zone at Pagla Pahar (KM 22); single-lane staggered convoy movement enforced by traffic police.', true, 'Niuland - Kohima Rural Bypass (Light Vehicles Only)', 74.0, '2-Lane Mountain Corridor', 22, 'Delay: +90 mins', '7,100 PCU/day', '[[25.9, 93.73], [25.78, 93.9], [25.6751, 94.1086]]'),
('seg-nh37-noney', 'NH-37 Imphal - Jiribam - Silchar Lifeline', 'NH-37', 'Manipur', 'Blocked', 91, 'Major mudflow near Makru Bridge approach. 80 loaded freight trucks stranded.', true, 'Reroute via Churachandpur - Tipaimukh border track (4WD Only)', 220.0, '2-Lane Hill Road', 0, 'Est. Clearance: 10h 30m', '4,300 PCU/day', '[[24.8, 93.15], [24.78, 93.58], [24.817, 93.9368]]'),
('seg-nh306-hunthar', 'NH-306 Silchar - Vairengte - Aizawl Lifeline', 'NH-306', 'Mizoram', 'Caution', 64, 'Hunthar sinking zone road depression; heavy multi-axle trailers restricted.', false, NULL, 130.0, '2-Lane Lifeline', 32, 'Controlled Movement', '3,800 PCU/day', '[[24.5, 92.76], [24.18, 92.75], [23.7271, 92.7176]]'),
('seg-nh8-tripura', 'NH-8 Churaibari - Teliamura - Agartala Corridor', 'NH-8', 'Tripura', 'Open', 15, 'All bridges cleared. Toll gates automated and fast moving.', false, NULL, 198.0, '2-Lane National Highway', 62, 'Normal', '9,400 PCU/day', '[[24.4, 92.2], [24.0, 91.7], [23.8315, 91.2868]]');

-- ---------------------------------------------------------------------------
-- 3. LOGISTICS VEHICLE FLEETS (DRIVER TRACKING)
-- ---------------------------------------------------------------------------
INSERT INTO vehicle_fleets (id, vehicle_number, driver_name, cargo_type, origin, destination, status, latitude, longitude, speed_kmh, eta_min, risk_level, driver_phone) VALUES
('flt-101', 'AS-01-GC-4921', 'Pranab Kalita', 'Medical & Vaccines', 'Guwahati Logistics Hub', 'Silchar Civil Depot', 'Rerouted', 25.78, 92.75, 34, 180, 'High', '+91-98640-11223'),
('flt-102', 'ML-05-D-8824', 'Banteilang Khongwir', 'Fresh Produce / FMCG', 'Shillong Wholesale', 'Guwahati Mandi', 'On Schedule', 25.90, 91.82, 52, 55, 'Low', '+91-94361-44556'),
('flt-103', 'AR-01-T-3109', 'Dorjee Thongdok', 'Telecom Infrastructure', 'Tezpur Base', 'Tawang Station', 'Delayed', 27.32, 92.22, 22, 290, 'High', '+91-97740-77889'),
('flt-104', 'MN-01-AA-7210', 'Thoiba Singh', 'Petroleum Tanker (IOCL)', 'Numaligarh Refinery', 'Imphal Fuel Depot', 'Halted', 24.80, 93.45, 0, 420, 'Severe', '+91-98561-22334'),
('flt-105', 'SK-01-P-5541', 'Tenzing Bhutia', 'PDS Rice & Grain Rations', 'Siliguri FCI Godown', 'Gangtok Central Store', 'Rerouted', 27.12, 88.50, 26, 210, 'Severe', '+91-94750-99887'),
('flt-106', 'NL-07-B-6312', 'Kezhavituo Angami', 'Hardware & Steel Rods', 'Dimapur Railhead', 'Kohima Smart City Site', 'Delayed', 25.75, 93.88, 18, 110, 'Moderate', '+91-94360-33221'),
('flt-107', 'MZ-01-L-4490', 'Lalrintluanga', 'Emergency Blood Bank Bags', 'Silchar Medical College', 'Aizawl Civil Hospital', 'On Schedule', 24.15, 92.74, 44, 95, 'Moderate', '+91-98623-66554'),
('flt-108', 'TR-01-X-1980', 'Debasish Debbarma', 'Industrial LPG Cylinders', 'Dharmanagar Depot', 'Agartala Bottling Plant', 'On Schedule', 23.95, 91.50, 58, 65, 'Low', '+91-94364-88776');

-- ---------------------------------------------------------------------------
-- 4. DISRUPTION INCIDENTS (GEOTAGGED)
-- ---------------------------------------------------------------------------
INSERT INTO incidents (id, title, type, severity, location, district_id, district_name, coordinates, verified_by_ai, reports_count, description) VALUES
('inc-001', 'Sonapur Tunnel Portal Mudflow & Rockfall', 'Landslide', 'Critical', 'NH-6 KM 132 near Sonapur', 'dist-east-jaintia', 'East Jaintia Hills (Sonapur)', '{"lat": 25.3117, "lon": 92.4285}', true, 18, 'Massive torrential hill mudslide triggered by 88mm rain. Both carriageways completely blocked by 60m sludge. Heavy excavators on site.'),
('inc-002', 'Pagla Pahar Road Slump & Sinking Zone', 'Landslide', 'High', 'NH-29 KM 22 near Chümoukedima', 'dist-kohima', 'Kohima & Dimapur', '{"lat": 25.78, "lon": 93.90}', true, 9, 'Gradual slope failure following continuous drizzle. Left carriageway cracked; single-lane alternating passage managed by SDRF.'),
('inc-003', 'Teesta River Embankment Washout at 29th Mile', 'Flash Flood', 'Critical', 'NH-10 near 29th Mile Gorge', 'dist-gangtok', 'Gangtok & Mangan', '{"lat": 27.18, "lon": 88.52}', true, 27, 'Teesta water levels breached the river wall. 120m roadway washed away. All vehicular traffic suspended until further notice.'),
('inc-004', 'Sela Pass Frozen Slush & Zero Visibility', 'Weather Hazard', 'High', 'NH-13 Sela Pass Summit (4,170m)', 'dist-tawang', 'Tawang & West Kameng', '{"lat": 27.50, "lon": 92.10}', true, 6, 'Sub-zero freezing fog combined with rock slippage. Military and civilian supply trucks requested to mount snow tire chains.'),
('inc-005', 'Makru Bridge Approach Landslip', 'Mudflow', 'Critical', 'NH-37 near Makru River Crossing', 'dist-noney', 'Noney & Tamenglong', '{"lat": 24.78, "lon": 93.58}', true, 14, 'Slope collapse onto bridge abutment. Heavy multi-axle freight traffic halted; SDRF clearance underway.');

-- ---------------------------------------------------------------------------
-- 5. WEATHER TELEMETRY STATIONS
-- ---------------------------------------------------------------------------
INSERT INTO weather_telemetry (district_id, district_name, state, temperature_c, condition, rainfall_mm, wind_speed_kmh, visibility_meters, landslide_risk_index, flash_flood_risk_index, warning_level) VALUES
('dist-kamrup', 'Kamrup Metropolitan (Guwahati)', 'Assam', 28.0, 'Light Drizzle', 12.4, 14, 4500, 22, 18, 'None'),
('dist-cachar', 'Cachar (Silchar)', 'Assam', 27.0, 'Continuous Rains', 38.0, 18, 2800, 52, 48, 'Yellow'),
('dist-dima-hasao', 'Dima Hasao (Haflong)', 'Assam', 22.0, 'Torrential Downpour', 78.4, 28, 600, 88, 79, 'Red'),
('dist-east-khasi', 'East Khasi Hills (Shillong)', 'Meghalaya', 18.0, 'Dense Fog & Mountain Mist', 45.8, 22, 900, 64, 55, 'Orange'),
('dist-east-jaintia', 'East Jaintia Hills (Sonapur)', 'Meghalaya', 21.0, 'Torrential Rains & Tempests', 88.2, 34, 350, 94, 91, 'Red'),
('dist-tawang', 'Tawang & West Kameng', 'Arunachal Pradesh', 8.0, 'Freezing Fog & Sleet', 31.0, 38, 250, 72, 40, 'Orange'),
('dist-imphal-west', 'Imphal West (Imphal)', 'Manipur', 24.0, 'Overcast Showers', 18.5, 12, 5000, 32, 28, 'None'),
('dist-noney', 'Noney & Tamenglong', 'Manipur', 21.0, 'Severe Thunderstorm', 84.0, 32, 400, 91, 86, 'Red'),
('dist-aizawl', 'Aizawl & Kolasib', 'Mizoram', 20.0, 'Heavy Rain', 42.1, 20, 1800, 68, 52, 'Orange'),
('dist-kohima', 'Kohima & Dimapur', 'Nagaland', 17.0, 'Continuous Mountain Rain', 52.4, 24, 850, 76, 68, 'Orange'),
('dist-gangtok', 'Gangtok & Mangan', 'Sikkim', 15.0, 'Torrential Downpour', 96.4, 40, 200, 96, 94, 'Red'),
('dist-west-tripura', 'West Tripura (Agartala)', 'Tripura', 30.0, 'Clear Sky', 4.2, 8, 8000, 12, 10, 'None');

-- ---------------------------------------------------------------------------
-- 6. CALAMITY SIREN BROADCASTS (USGS & SEVERE INCIDENTS)
-- ---------------------------------------------------------------------------
INSERT INTO calamity_alerts (id, title, calamity_type, severity, location, district_id, affected_highway, latitude, longitude, active, sound_siren, message, instructions) VALUES
('calamity-001', 'CRITICAL NATURAL CALAMITY: Sonapur Mudflow & Mountain Collapse', 'Landslide', 'Critical', 'NH-6 Sonapur Tunnel Corridor', 'dist-east-jaintia', 'NH-6 Lifeline', 25.3117, 92.4285, true, true, 'Massive mudslide triggered by 88.2mm torrential downpour. Highway impassable. Extreme structural risk of further collapse.', 'PULL OVER TO DESIGNATED OPEN SAFE ZONE. DO NOT PARK BENEATH ROCK OVERHANGS. WAIT FOR SDRF CLEARANCE.'),
('calamity-002', 'USGS Seismic Alert: Tremor M4.2 Recorded in Cachar-Barak Valley', 'Earthquake', 'Severe', 'Cachar-Meghalaya Border Fault', 'dist-cachar', 'NH-37 / NH-6 Corridor', 24.82, 92.78, true, true, 'Tremor of magnitude M4.2 recorded at depth 12km. Drivers on mountain highways check road pavement for fissures.', 'REDUCE SPEED IMMEDIATELY. INSPECT BRIDGES AND TUNNEL APPROACHES FOR CRACKS BEFORE CROSSING.');
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_content)

    print(f"Generated SQL seed file -> {filepath}")
    return filepath


# ---------------------------------------------------------------------------
# 4. Generator Logic for Master Unified JSON Dataset
# ---------------------------------------------------------------------------
def generate_master_json(filename="complete_ner_dataset.json"):
    filepath = os.path.join(BASE_DIR, filename)

    master_data = {
        "metadata": {
            "title": "NER-SHIELD Unified Master Dataset",
            "problemStatement": "SIH26002: AI-Based Smart Logistics & Accessibility Intelligence for the North Eastern Region",
            "statesCovered": [
                "Assam", "Meghalaya", "Arunachal Pradesh", "Manipur", 
                "Mizoram", "Nagaland", "Sikkim", "Tripura"
            ],
            "totalDistricts": len(NER_LOCATIONS),
            "generatedAt": datetime.now().isoformat(),
            "version": "2.0-SIH26"
        },
        "districts": NER_LOCATIONS,
        "strategicHighways": [
            {"code": "NH-6", "name": "Guwahati - Shillong - Silchar - Agartala Lifeline", "keyChokepoints": ["Sonapur Tunnel", "Barapani Dam", "Lukha Bridge"]},
            {"code": "NH-27", "name": "East-West Corridor (Siliguri - Guwahati - Silchar)", "keyChokepoints": ["Saraighat Bridge", "Jatinga Valley"]},
            {"code": "NH-10", "name": "Siliguri - Teesta Gorge - Gangtok Lifeline", "keyChokepoints": ["29th Mile", "Rangpo Checkpost", "Singtam Junction"]},
            {"code": "NH-13", "name": "Trans-Arunachal Highway", "keyChokepoints": ["Sela Pass (4170m)", "Jaswant Garh", "Bhalukpong"]},
            {"code": "NH-29", "name": "Dimapur - Kohima - Imphal Lifeline", "keyChokepoints": ["Pagla Pahar", "Dzükou Foothills"]},
            {"code": "NH-37", "name": "Jiribam - Noney - Imphal Lifeline", "keyChokepoints": ["Makru Bridge", "Tupul Railway Link"]},
            {"code": "NH-306", "name": "Silchar - Vairengte - Aizawl Lifeline", "keyChokepoints": ["Hunthar Mudslide Zone", "Vairengte Gate"]},
            {"code": "NH-8", "name": "Assam-Tripura Lifeline", "keyChokepoints": ["Churaibari Gate", "Baramura Hills"]}
        ],
        "emergencyProtocols": {
            "SDRF_Assam": "1079",
            "SDRF_Meghalaya": "1070",
            "SDRF_Arunachal": "1077",
            "SDRF_Manipur": "1070",
            "SDRF_Mizoram": "1070",
            "SDRF_Nagaland": "1070",
            "SDRF_Sikkim": "1077",
            "SDRF_Tripura": "1070",
            "NHAI_Regional_Control": "+91-361-2234001"
        }
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(master_data, f, indent=2)

    print(f"Generated unified JSON dataset -> {filepath}")
    return filepath


# ---------------------------------------------------------------------------
# Main Execution
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("Generating NER-SHIELD SIH26002 Dataset Bundle...")
    generate_ml_training_dataset("ml_training_dataset.csv", num_samples=1250)
    generate_sql_seed("seed_data.sql")
    generate_master_json("complete_ner_dataset.json")
    print("Dataset generation completed successfully!")
