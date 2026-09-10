# NER-SHIELD Dataset Documentation
### Smart India Hackathon 2026 — Problem Statement: SIH26002
**Theme:** Smart Automation | **Category:** Software  
**Domain:** AI-Based Smart Logistics & Disruption Intelligence Platform for the North Eastern Region (NER)

---

## 📁 Dataset Bundle Overview

The dataset bundle has been tailored specifically to the geographical, meteorological, geological, and logistical realities of the **8 North Eastern States** (Assam, Meghalaya, Arunachal Pradesh, Manipur, Mizoram, Nagaland, Sikkim, Tripura).

```
database/
├── ml_training_dataset.csv       # 1,250+ structured observations for ML training
├── seed_data.sql                 # Complete SQL seed for PostgreSQL / Supabase
├── complete_ner_dataset.json     # Master unified JSON dataset for frontend/backend
├── generate_dataset.py           # Parametric Python script to regenerate/scale data
├── schema.sql                    # Base relational schema definition
└── supabase_schema.sql           # Supabase Realtime & RLS schema definition
```

---

## 📊 1. Machine Learning Training Dataset (`ml_training_dataset.csv`)

### Data Dictionary (26 Features)

| # | Column Name | Data Type | Range / Values | Description |
|---|---|---|---|---|
| 1 | `record_id` | String | `REC-00001` to `REC-01250` | Unique observation identifier |
| 2 | `timestamp` | Datetime | `2025-04-01` to `2026-10-31` | Observation timestamp across monsoon & dry cycles |
| 3 | `state` | String | 8 NER States | Indian State |
| 4 | `district` | String | 16 Hubs | Administrative District / Logistics Hub |
| 5 | `highway_code` | String | `NH-6`, `NH-27`, `NH-10`, `NH-13`, `NH-29`, etc. | National Highway designation |
| 6 | `segment_name` | String | Text | Critical mountain corridor or chokepoint |
| 7 | `terrain_type` | String | Alpine, Karst, Valley Basin, Ridge, etc. | Geomorphic terrain classification |
| 8 | `elevation_m` | Integer | `15` to `4,200` m MSL | Elevation above mean sea level |
| 9 | `slope_angle_deg` | Integer | `2°` to `65°` | Incline angle of mountain slopes along roadway |
| 10 | `road_quality_index` | Integer | `15` to `95` | Pavement Condition Index (higher = better) |
| 11 | `drainage_capacity_index` | Integer | `10` to `95` | Highway culvert and runoff drainage efficiency |
| 12 | `historical_landslide_freq` | Integer | `1` to `10` | Vulnerability ranking based on GSI hazard maps |
| 13 | `rainfall_24h_mm` | Float | `0.0` to `280.0` mm | 24-hour precipitation telemetry |
| 14 | `cumulative_rainfall_7d_mm` | Float | `0.0` to `650.0` mm | 7-day rolling precipitation (soil saturation indicator) |
| 15 | `soil_moisture_pct` | Float | `15.0%` to `99.0%` | Volumetric soil moisture percentage |
| 16 | `temperature_c` | Float | `-2.0°C` to `36.0°C` | Ambient atmospheric temperature |
| 17 | `humidity_pct` | Integer | `30%` to `99%` | Relative humidity percentage |
| 18 | `visibility_m` | Integer | `40` to `10,000` m | Optical visibility distance |
| 19 | `wind_speed_kmh` | Integer | `2` to `85` km/h | Anemometer wind velocity |
| 20 | `seismic_magnitude_usgs` | Float | `0.0` to `5.4` | Richter scale tremor recorded in NER Zone V |
| 21 | `heavy_vehicle_volume_per_hr` | Integer | `5` to `450` | Freight convoy & multi-axle truck density |
| 22 | **`disruption_occurred`** | Integer (Binary) | `0` or `1` | **Target:** Whether road passage was disrupted |
| 23 | **`disruption_type`** | String (Multiclass) | `Clear`, `Landslide`, `Flash Flood`, `Mudflow`, `Rockfall`, `Road Washout`, `Dense Fog Blockage` | **Target:** Primary natural or weather hazard |
| 24 | **`risk_score`** | Integer (Continuous) | `5` to `99` | **Target:** Composite Disruption Risk Score |
| 25 | **`delay_minutes`** | Integer (Continuous) | `0` to `960` mins | **Target:** Logistics transit delay duration |
| 26 | **`accessibility_status`** | String | `Open`, `Caution`, `Blocked` | **Target:** Operational corridor status |

---

## 🤖 2. Machine Learning Training Example (Python / Scikit-learn)

Here is a ready-to-run script to train both a **Classification Model** (predicting Disruption Type) and a **Regression Model** (predicting Delay in minutes):

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.metrics import classification_report, mean_absolute_error, r2_score

# 1. Load Dataset
df = pd.read_csv('database/ml_training_dataset.csv')

# 2. Select Features
feature_cols = [
    'elevation_m', 'slope_angle_deg', 'road_quality_index',
    'drainage_capacity_index', 'historical_landslide_freq',
    'rainfall_24h_mm', 'cumulative_rainfall_7d_mm', 'soil_moisture_pct',
    'temperature_c', 'humidity_pct', 'visibility_m', 'wind_speed_kmh',
    'seismic_magnitude_usgs', 'heavy_vehicle_volume_per_hr'
]

X = df[feature_cols]

# -------------------------------------------------------------
# TASK A: Classify Disruption Type (Landslide, Flash Flood, etc.)
# -------------------------------------------------------------
y_class = df['disruption_type']
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_class, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train_c, y_train_c)
y_pred_c = clf.predict(X_test_c)

print("=== Disruption Type Classification Report ===")
print(classification_report(y_test_c, y_pred_c))

# -------------------------------------------------------------
# TASK B: Predict Transit Delay (ETA Minutes)
# -------------------------------------------------------------
y_reg = df['delay_minutes']
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_reg, test_size=0.2, random_state=42)

reg = GradientBoostingRegressor(n_estimators=100, random_state=42)
reg.fit(X_train_r, y_train_r)
y_pred_r = reg.predict(X_test_r)

print(f"Delay Prediction MAE: {mean_absolute_error(y_test_r, y_pred_r):.2f} minutes")
print(f"Delay Prediction R²: {r2_score(y_test_r, y_pred_r):.2f}")
```

---

## 🗄️ 3. Relational Database Seed (`seed_data.sql`)

### Tables Populated:
1. `districts`: 16 logistics hubs across all 8 states with accessibility index, SDRF numbers, and elevation.
2. `road_segments`: 8 strategic hill lifelines (`NH-6`, `NH-27`, `NH-10`, `NH-13`, `NH-29`, `NH-37`, `NH-306`, `NH-8`) with bypass detour availability.
3. `vehicle_fleets`: 8 active logistics supply trucks (Medical supplies, petroleum tankers, PDS rations, FMCG, civil infrastructure).
4. `incidents`: 5 verified high-severity incident logs (Sonapur mudflow, Pagla Pahar slump, 29th Mile Teesta washout, Sela Pass freezing fog, Makru bridge landslip).
5. `weather_telemetry`: Mountain weather telemetry for all hubs.
6. `calamity_alerts`: Emergency seismic & torrential downpour sirens.

### How to Import into Supabase or PostgreSQL:
- **Supabase SQL Editor:** Open your [Supabase Dashboard](https://app.supabase.com) -> SQL Editor -> paste and run [`database/supabase_schema.sql`](file:///c:/projects/Final_Prototype_SIH26/database/supabase_schema.sql), then paste and run [`database/seed_data.sql`](file:///c:/projects/Final_Prototype_SIH26/database/seed_data.sql).
- **psql CLI:**
  ```bash
  psql -h <host> -U <user> -d <dbname> -f database/seed_data.sql
  ```

---

## ⚙️ 4. Regenerating or Scaling the Dataset

You can dynamically scale the dataset to any number of samples (e.g., 10,000 or 50,000 rows) by modifying and executing [`database/generate_dataset.py`](file:///c:/projects/Final_Prototype_SIH26/database/generate_dataset.py):

```bash
# In your terminal
python database/generate_dataset.py
```

To adjust the number of generated ML rows, edit the `num_samples` argument in `generate_dataset.py`:
```python
generate_ml_training_dataset("ml_training_dataset.csv", num_samples=10000)
```
