#!/usr/bin/env python3
"""
NER-SHIELD: Live Data Model Trainer for SIH26002
Fetches live environmental telemetry (Open-Meteo & USGS APIs),
blends with historical terrain/disaster dataset, trains ML models,
serializes models with joblib, and runs live inference.
"""

import json
import os
import sys
import time
from datetime import datetime

# Configure UTF-8 for Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import joblib
import numpy as np
import pandas as pd
import requests
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# 1. District Corridors & Bounding Coordinates
# ---------------------------------------------------------------------------
NER_HUBS = [
    {
        "state": "Assam",
        "district": "Kamrup Metropolitan (Guwahati)",
        "highway": "NH-27",
        "segment_name": "Guwahati - Saraighat - Rangia Corridor",
        "lat": 26.1445,
        "lon": 91.7362,
        "elevation_m": 55,
        "slope_angle_deg": 8,
        "road_quality_index": 82,
        "drainage_capacity_index": 65,
        "historical_landslide_freq": 2,
        "terrain_type": "Valley River Basin"
    },
    {
        "state": "Assam",
        "district": "Cachar (Silchar)",
        "highway": "NH-37 / NH-6",
        "segment_name": "Silchar - Badarpur - Kalain Pass",
        "lat": 24.8170,
        "lon": 92.8000,
        "elevation_m": 35,
        "slope_angle_deg": 12,
        "road_quality_index": 68,
        "drainage_capacity_index": 45,
        "historical_landslide_freq": 4,
        "terrain_type": "Barak Valley Floodplain"
    },
    {
        "state": "Assam",
        "district": "Dima Hasao (Haflong)",
        "highway": "NH-27",
        "segment_name": "Haflong Hill Section - Jatinga Valley",
        "lat": 25.1680,
        "lon": 93.0200,
        "elevation_m": 960,
        "slope_angle_deg": 38,
        "road_quality_index": 55,
        "drainage_capacity_index": 35,
        "historical_landslide_freq": 9,
        "terrain_type": "Rugged Mountain Range"
    },
    {
        "state": "Meghalaya",
        "district": "East Khasi Hills (Shillong)",
        "highway": "NH-6",
        "segment_name": "Umiam - Mawlai - Shillong Peak Bypass",
        "lat": 25.5788,
        "lon": 91.8933,
        "elevation_m": 1525,
        "slope_angle_deg": 32,
        "road_quality_index": 75,
        "drainage_capacity_index": 50,
        "historical_landslide_freq": 6,
        "terrain_type": "Highland Plateau"
    },
    {
        "state": "Meghalaya",
        "district": "East Jaintia Hills (Sonapur)",
        "highway": "NH-6",
        "segment_name": "Sonapur Tunnel - Lukha River Gorge Lifeline",
        "lat": 25.3117,
        "lon": 92.4285,
        "elevation_m": 890,
        "slope_angle_deg": 48,
        "road_quality_index": 45,
        "drainage_capacity_index": 25,
        "historical_landslide_freq": 10,
        "terrain_type": "Severe Mudslide Karst Chokepoint"
    },
    {
        "state": "Arunachal Pradesh",
        "district": "Tawang & West Kameng",
        "highway": "NH-13",
        "segment_name": "Bhalukpong - Bomdila - Sela Pass (4,170m)",
        "lat": 27.5861,
        "lon": 91.8594,
        "elevation_m": 3048,
        "slope_angle_deg": 45,
        "road_quality_index": 58,
        "drainage_capacity_index": 40,
        "historical_landslide_freq": 8,
        "terrain_type": "Eastern Himalayan Alpine"
    },
    {
        "state": "Manipur",
        "district": "Imphal West (Imphal)",
        "highway": "NH-102",
        "segment_name": "Imphal - Thoubal - Moreh Trans-Asian Highway",
        "lat": 24.8170,
        "lon": 93.9368,
        "elevation_m": 786,
        "slope_angle_deg": 14,
        "road_quality_index": 68,
        "drainage_capacity_index": 50,
        "historical_landslide_freq": 3,
        "terrain_type": "Manipur Central Valley"
    },
    {
        "state": "Manipur",
        "district": "Noney & Tamenglong",
        "highway": "NH-37",
        "segment_name": "Noney Tupul - Makru Bridge Mountain Link",
        "lat": 24.7800,
        "lon": 93.5800,
        "elevation_m": 980,
        "slope_angle_deg": 42,
        "road_quality_index": 50,
        "drainage_capacity_index": 30,
        "historical_landslide_freq": 9,
        "terrain_type": "Steep Hillside Chokepoint"
    },
    {
        "state": "Mizoram",
        "district": "Aizawl & Kolasib",
        "highway": "NH-306",
        "segment_name": "Vairengte Gateway - Hunthar Slope - Aizawl",
        "lat": 23.7271,
        "lon": 92.7176,
        "elevation_m": 1132,
        "slope_angle_deg": 36,
        "road_quality_index": 60,
        "drainage_capacity_index": 38,
        "historical_landslide_freq": 8,
        "terrain_type": "North-South Structural Ridge"
    },
    {
        "state": "Nagaland",
        "district": "Kohima & Dimapur",
        "highway": "NH-29",
        "segment_name": "Dimapur Bypass - Pagla Pahar - Kohima Ridge",
        "lat": 25.6751,
        "lon": 94.1086,
        "elevation_m": 1444,
        "slope_angle_deg": 40,
        "road_quality_index": 52,
        "drainage_capacity_index": 32,
        "historical_landslide_freq": 9,
        "terrain_type": "Active Tectonic Sinking Zone"
    },
    {
        "state": "Sikkim",
        "district": "Gangtok & Mangan",
        "highway": "NH-10",
        "segment_name": "Rangpo Border - 29th Mile Teesta Gorge - Gangtok",
        "lat": 27.3389,
        "lon": 88.6065,
        "elevation_m": 1650,
        "slope_angle_deg": 50,
        "road_quality_index": 48,
        "drainage_capacity_index": 20,
        "historical_landslide_freq": 10,
        "terrain_type": "Teesta River Canyon Chokepoint"
    },
    {
        "state": "Tripura",
        "district": "West Tripura (Agartala)",
        "highway": "NH-8",
        "segment_name": "Churaibari Gate - Teliamura - Agartala Arterial",
        "lat": 23.8315,
        "lon": 91.2868,
        "elevation_m": 15,
        "slope_angle_deg": 10,
        "road_quality_index": 78,
        "drainage_capacity_index": 60,
        "historical_landslide_freq": 3,
        "terrain_type": "Tripura Plain / Low Hillocks"
    }
]

FEATURE_COLS = [
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
    "heavy_vehicle_volume_per_hr"
]


# ---------------------------------------------------------------------------
# 2. Live Data Ingestion (Open-Meteo & USGS)
# ---------------------------------------------------------------------------
def fetch_live_usgs_seismic():
    """Fetch live earthquake tremors around North-East India (Lat: 20-30°N, Lon: 88-97°E)"""
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&minlatitude=20&maxlatitude=30&minlongitude=88&maxlongitude=97&limit=5"
    try:
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            features = data.get("features", [])
            if features:
                top_mag = max(f["properties"]["mag"] for f in features if f.get("properties"))
                print(f"[USGS Live] Detected {len(features)} live seismic events. Max Magnitude: M{top_mag:.1f}")
                return float(top_mag)
        return 0.0
    except Exception as e:
        print(f"[USGS Live] Warning: Unable to reach USGS live feed ({e}), defaulting seismic factor to 0.0")
        return 0.0


def fetch_live_district_weather(hub):
    """Fetch live meteorological observations from Open-Meteo for a specific hub"""
    lat, lon = hub["lat"], hub["lon"]
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,weather_code,wind_speed_10m&timezone=Asia%2FKolkata"
    try:
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            cur = res.json().get("current", {})
            temp = float(cur.get("temperature_2m", 24.0))
            rain = float(cur.get("precipitation", cur.get("rain", 0.0)))
            hum = int(cur.get("relative_humidity_2m", 75))
            wind = int(cur.get("wind_speed_10m", 12))
            return {"temp_c": temp, "rain_mm": rain, "humidity": hum, "wind_kmh": wind, "status": "Live"}
    except Exception:
        pass
    return {"temp_c": 24.0, "rain_mm": 5.0, "humidity": 75, "wind_kmh": 12, "status": "Estimated"}


def ingest_live_telemetry():
    """Fetch all live streams across NER and build live observation rows"""
    print("\n" + "="*70)
    print("[LIVE INGESTION] FETCHING REAL-TIME TELEMETRY ACROSS NORTH-EAST INDIA")
    print("="*70)

    max_seismic = fetch_live_usgs_seismic()
    live_records = []
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for hub in NER_HUBS:
        w = fetch_live_district_weather(hub)
        # Compute realistic physical indices from live data
        rain_24h = w["rain_mm"]
        cum_rain_7d = round(rain_24h * 2.8 + (15.0 if w["humidity"] > 80 else 5.0), 1)
        soil_moisture = min(98.0, max(25.0, round(w["humidity"] * 0.7 + rain_24h * 0.4, 1)))
        visibility = 450 if w["rain_mm"] > 30 else (1200 if w["rain_mm"] > 10 else 4500)
        heavy_traffic = 110

        # Physical disruption logic for live ground truth calculation
        slope = hub["slope_angle_deg"]
        hist = hub["historical_landslide_freq"]
        road_qual = hub["road_quality_index"]
        drainage = hub["drainage_capacity_index"]

        raw_risk = (
            0.25 * min(100.0, (rain_24h / 150.0) * 100.0) +
            0.15 * min(100.0, (cum_rain_7d / 400.0) * 100.0) +
            0.20 * min(100.0, (slope / 55.0) * 100.0) +
            0.15 * soil_moisture +
            0.10 * (hist * 10.0) +
            0.10 * ((max_seismic / 6.0) * 100.0 if max_seismic > 0 else 0.0) +
            (100 - road_qual) * 0.05
        )
        risk_score = min(99, max(5, int(raw_risk)))

        if risk_score >= 80 or (rain_24h > 100 and slope > 35) or (max_seismic >= 4.5 and slope > 30):
            disruption_occurred = 1
            status = "Blocked"
            disruption_type = "Flash Flood" if (rain_24h > 120 and drainage < 40) else ("Mudflow" if slope > 40 else "Landslide")
            delay = int(180 + risk_score * 4)
        elif risk_score >= 55 or (rain_24h > 45 and slope > 25):
            disruption_occurred = 1
            status = "Caution"
            disruption_type = "Rockfall" if slope > 35 else ("Severe Waterlogging" if rain_24h > 50 else "Minor Slump & Slippage")
            delay = int(45 + risk_score * 1.5)
        else:
            disruption_occurred = 0
            status = "Open"
            disruption_type = "Clear"
            delay = 0

        row = {
            "record_id": f"LIVE-{hub['district'][:4].upper()}-{int(time.time())}",
            "timestamp": now_str,
            "state": hub["state"],
            "district": hub["district"],
            "highway_code": hub["highway"],
            "segment_name": hub["segment_name"],
            "terrain_type": hub["terrain_type"],
            "elevation_m": hub["elevation_m"],
            "slope_angle_deg": hub["slope_angle_deg"],
            "road_quality_index": hub["road_quality_index"],
            "drainage_capacity_index": hub["drainage_capacity_index"],
            "historical_landslide_freq": hub["historical_landslide_freq"],
            "rainfall_24h_mm": rain_24h,
            "cumulative_rainfall_7d_mm": cum_rain_7d,
            "soil_moisture_pct": soil_moisture,
            "temperature_c": w["temp_c"],
            "humidity_pct": w["humidity"],
            "visibility_m": visibility,
            "wind_speed_kmh": w["wind_kmh"],
            "seismic_magnitude_usgs": max_seismic,
            "heavy_vehicle_volume_per_hr": heavy_traffic,
            "disruption_occurred": disruption_occurred,
            "disruption_type": disruption_type,
            "risk_score": risk_score,
            "delay_minutes": delay,
            "accessibility_status": status
        }
        live_records.append(row)
        print(f"  * {hub['district']:<32} | Temp: {w['temp_c']}C | Rain: {rain_24h}mm | Hum: {w['humidity']}% | Wind: {w['wind_kmh']}km/h | Status: {w['status']}")

    return pd.DataFrame(live_records)


# ---------------------------------------------------------------------------
# 3. Model Training Pipeline
# ---------------------------------------------------------------------------
def train_models():
    # A. Fetch Live Data
    live_df = ingest_live_telemetry()

    # B. Load Historical Seed Dataset
    hist_csv_path = os.path.join(BASE_DIR, "ml_training_dataset.csv")
    if os.path.exists(hist_csv_path):
        hist_df = pd.read_csv(hist_csv_path)
        print(f"\nLoaded {len(hist_df)} historical training records from {hist_csv_path}")
    else:
        print(f"Error: {hist_csv_path} not found.")
        sys.exit(1)

    # C. Blend Live Telemetry into the Training Corpus (Weighting current live data)
    live_augmented = pd.concat([live_df] * 5, ignore_index=True)
    combined_df = pd.concat([hist_df, live_augmented], ignore_index=True)
    print(f"Total training corpus size after live data ingestion: {len(combined_df)} samples.")

    # Save live augmented dataset
    live_csv_path = os.path.join(BASE_DIR, "ml_live_training_dataset.csv")
    combined_df.to_csv(live_csv_path, index=False)
    print(f"Saved live-augmented training dataset -> {live_csv_path}")

    # D. Feature Matrix & Target Vectors
    X = combined_df[FEATURE_COLS]
    y_class = combined_df["disruption_type"]
    y_risk = combined_df["risk_score"]
    y_delay = combined_df["delay_minutes"]

    X_train, X_test, y_train_c, y_test_c, y_train_r, y_test_r, y_train_d, y_test_d = train_test_split(
        X, y_class, y_risk, y_delay, test_size=0.2, random_state=42
    )

    print("\n" + "="*70)
    print("[TRAINING] TRAINING MULTI-TASK MACHINE LEARNING MODELS WITH LIVE DATA")
    print("="*70)

    # 1. Model 1: Disruption Type Classifier (Random Forest)
    print("1. Training Disruption Classifier (RandomForest)...")
    clf = RandomForestClassifier(n_estimators=120, max_depth=14, min_samples_split=3, random_state=42)
    clf.fit(X_train, y_train_c)
    pred_c = clf.predict(X_test)
    acc_c = accuracy_score(y_test_c, pred_c)
    print(f"   [OK] Disruption Classifier Test Accuracy: {acc_c * 100:.2f}%")

    # 2. Model 2: Disruption Risk Score Regressor (Gradient Boosting)
    print("2. Training Risk Score Regressor (GradientBoosting)...")
    reg_risk = GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, max_depth=5, random_state=42)
    reg_risk.fit(X_train, y_train_r)
    pred_r = reg_risk.predict(X_test)
    mae_r = mean_absolute_error(y_test_r, pred_r)
    r2_r = r2_score(y_test_r, pred_r)
    print(f"   [OK] Risk Regressor MAE: {mae_r:.2f} points (R2 Score: {r2_r:.3f})")

    # 3. Model 3: Transit Delay Regressor (Random Forest)
    print("3. Training Logistics Delay Regressor (RandomForest)...")
    reg_delay = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    reg_delay.fit(X_train, y_train_d)
    pred_d = reg_delay.predict(X_test)
    mae_d = mean_absolute_error(y_test_d, pred_d)
    r2_d = r2_score(y_test_d, pred_d)
    print(f"   [OK] Delay Regressor MAE: {mae_d:.2f} mins (R2 Score: {r2_d:.3f})")

    # E. Feature Importances
    importances = clf.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    print("\nTop 5 Most Influential Risk Drivers (Feature Importance):")
    for i in range(5):
        idx = sorted_idx[i]
        print(f"   {i+1}. {FEATURE_COLS[idx]:<28}: {importances[idx]*100:.1f}%")

    # F. Save Models
    clf_path = os.path.join(MODELS_DIR, "disruption_classifier.joblib")
    risk_path = os.path.join(MODELS_DIR, "risk_regressor.joblib")
    delay_path = os.path.join(MODELS_DIR, "delay_regressor.joblib")

    joblib.dump(clf, clf_path)
    joblib.dump(reg_risk, risk_path)
    joblib.dump(reg_delay, delay_path)

    metadata = {
        "training_timestamp": datetime.now().isoformat(),
        "total_training_samples": len(combined_df),
        "live_samples_ingested": len(live_df),
        "feature_columns": FEATURE_COLS,
        "metrics": {
            "disruption_classifier_accuracy": round(float(acc_c), 4),
            "risk_regressor_mae": round(float(mae_r), 2),
            "risk_regressor_r2": round(float(r2_r), 3),
            "delay_regressor_mae_minutes": round(float(mae_d), 2),
            "delay_regressor_r2": round(float(r2_d), 3)
        },
        "target_classes": list(clf.classes_)
    }
    meta_path = os.path.join(MODELS_DIR, "model_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nModels successfully saved to '{MODELS_DIR}/':")
    print(f"  * {clf_path}")
    print(f"  * {risk_path}")
    print(f"  * {delay_path}")
    print(f"  * {meta_path}")

    # G. Run Live Real-Time Inference on CURRENT conditions
    print("\n" + "="*70)
    print("[INFERENCE] LIVE PREDICTION RESULTS ON CURRENT REAL-TIME TELEMETRY")
    print("="*70)

    X_live = live_df[FEATURE_COLS]
    live_preds_class = clf.predict(X_live)
    live_preds_risk = reg_risk.predict(X_live)
    live_preds_delay = reg_delay.predict(X_live)

    print(f"{'District':<30} | {'Weather (Rain/Temp)':<20} | {'Predicted Hazard':<18} | {'Risk':<6} | {'Delay':<8} | {'Status'}")
    print("-" * 105)
    for idx, hub in enumerate(NER_HUBS):
        w_rain = live_df.iloc[idx]["rainfall_24h_mm"]
        w_temp = live_df.iloc[idx]["temperature_c"]
        p_class = live_preds_class[idx]
        p_risk = round(float(live_preds_risk[idx]))
        p_delay = max(0, round(float(live_preds_delay[idx])))
        status = "[BLOCKED]" if p_risk >= 75 else ("[CAUTION]" if p_risk >= 45 else "[OPEN]")

        print(f"{hub['district'][:28]:<30} | {w_rain}mm / {w_temp}C{'':<9} | {p_class:<18} | {p_risk:<6} | +{p_delay}m{'':<3} | {status}")

    print("="*105)
    return metadata


if __name__ == "__main__":
    train_models()
