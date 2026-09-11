-- ============================================================================
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
('inc-001', 'Sonapur Tunnel Portal Mudflow & Rockfall', 'Landslide', 'Critical', 'NH-6 KM 132 near Sonapur', 'dist-east-jaintia', 'East Jaintia Hills (Sonapur)', '[25.3117, 92.4285]', true, 18, 'Massive torrential hill mudslide triggered by 88mm rain. Both carriageways completely blocked by 60m sludge. Heavy excavators on site.'),
('inc-002', 'Pagla Pahar Road Slump & Sinking Zone', 'Landslide', 'High', 'NH-29 KM 22 near Chümoukedima', 'dist-kohima', 'Kohima & Dimapur', '[25.78, 93.90]', true, 9, 'Gradual slope failure following continuous drizzle. Left carriageway cracked; single-lane alternating passage managed by SDRF.'),
('inc-003', 'Teesta River Embankment Washout at 29th Mile', 'Flash Flood', 'Critical', 'NH-10 near 29th Mile Gorge', 'dist-gangtok', 'Gangtok & Mangan', '[27.18, 88.52]', true, 27, 'Teesta water levels breached the river wall. 120m roadway washed away. All vehicular traffic suspended until further notice.'),
('inc-004', 'Sela Pass Frozen Slush & Zero Visibility', 'Weather Hazard', 'High', 'NH-13 Sela Pass Summit (4,170m)', 'dist-tawang', 'Tawang & West Kameng', '[27.50, 92.10]', true, 6, 'Sub-zero freezing fog combined with rock slippage. Military and civilian supply trucks requested to mount snow tire chains.'),
('inc-005', 'Makru Bridge Approach Landslip', 'Mudflow', 'Critical', 'NH-37 near Makru River Crossing', 'dist-noney', 'Noney & Tamenglong', '[24.78, 93.58]', true, 14, 'Slope collapse onto bridge abutment. Heavy multi-axle freight traffic halted; SDRF clearance underway.');

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
