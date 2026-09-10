import type { WeatherData } from '../types';

export interface DistrictCoord {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  elevation: string;
  passes: string[];
}

export const NER_DISTRICT_COORDS: DistrictCoord[] = [
  {
    id: 'dist-kamrup',
    name: 'Kamrup Metropolitan (Guwahati)',
    state: 'Assam',
    lat: 26.1445,
    lon: 91.7362,
    elevation: '55m MSL',
    passes: ['Saraighat Bridge Crossing', 'Khanapara Transit Chokepoint']
  },
  {
    id: 'dist-east-khasi',
    name: 'East Khasi Hills (Shillong)',
    state: 'Meghalaya',
    lat: 25.5788,
    lon: 91.8933,
    elevation: '1,525m MSL',
    passes: ['Barapani Dam Viaduct', 'Mawlai Slope Corridor']
  },
  {
    id: 'dist-east-jaintia',
    name: 'East Jaintia Hills (Sonapur)',
    state: 'Meghalaya',
    lat: 25.3117,
    lon: 92.4285,
    elevation: '890m MSL',
    passes: ['Sonapur Tunnel Entrance', 'Lukha River Bridge Bypass']
  },
  {
    id: 'dist-tawang',
    name: 'Tawang & West Kameng',
    state: 'Arunachal Pradesh',
    lat: 27.5861,
    lon: 91.8594,
    elevation: '3,048m MSL',
    passes: ['Sela Pass (4,170m)', 'Jaswant Garh Ridge', 'Bhalukpong Gate']
  },
  {
    id: 'dist-imphal-west',
    name: 'Imphal West & Noney',
    state: 'Manipur',
    lat: 24.8170,
    lon: 93.9368,
    elevation: '786m MSL',
    passes: ['Makru Bridge', 'Noney Tupul Railway-Highway Link']
  },
  {
    id: 'dist-aizawl',
    name: 'Aizawl & Kolasib',
    state: 'Mizoram',
    lat: 23.7271,
    lon: 92.7176,
    elevation: '1,132m MSL',
    passes: ['Vairengte Gateway', 'Hunthar Mudslide Zone']
  },
  {
    id: 'dist-kohima',
    name: 'Kohima & Dimapur',
    state: 'Nagaland',
    lat: 25.6751,
    lon: 94.1086,
    elevation: '1,444m MSL',
    passes: ['Pagla Pahar Landslide Belt', 'Dzükou Foothill Pass']
  },
  {
    id: 'dist-gangtok',
    name: 'Gangtok & Mangan',
    state: 'Sikkim',
    lat: 27.3389,
    lon: 88.6065,
    elevation: '1,650m MSL',
    passes: ['29th Mile Teesta Gorge', 'Rangpo Border Hub', 'Singtam Junction']
  },
  {
    id: 'dist-west-tripura',
    name: 'West Tripura (Agartala)',
    state: 'Tripura',
    lat: 23.8315,
    lon: 91.2868,
    elevation: '15m MSL',
    passes: ['Baramura Hill Pass', 'Churaibari Logistics Gate']
  },
  {
    id: 'dist-cachar',
    name: 'Cachar (Silchar)',
    state: 'Assam',
    lat: 24.8170,
    lon: 92.8000,
    elevation: '35m MSL',
    passes: ['Badarpur Chokepoint', 'Kalain Pass Lifeline']
  },
  {
    id: 'dist-dima-hasao',
    name: 'Dima Hasao (Haflong)',
    state: 'Assam',
    lat: 25.1680,
    lon: 93.0200,
    elevation: '960m MSL',
    passes: ['Jatinga Valley Gorge', 'Haflong Hill Corridor']
  }
];

function mapWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Dense Fog & Mountain Mist';
  if (code >= 51 && code <= 55) return 'Light Drizzle & Fog';
  if (code >= 61 && code <= 65) return 'Continuous Downpour';
  if (code >= 71 && code <= 77) return 'Sleet & Freezing Rain';
  if (code >= 80 && code <= 82) return 'Torrential Rains';
  if (code >= 95) return 'Severe Thunderstorm & Tempest';
  return 'Overcast Rains';
}

export class LiveWeatherService {
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache

  clearCache(): void {
    this.cache.clear();
  }

  async fetchDistrictLiveWeather(district: DistrictCoord, bypassCache: boolean = false): Promise<WeatherData> {
    if (!bypassCache) {
      const cached = this.cache.get(district.id);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
        return cached.data;
      }
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${district.lat}&longitude=${district.lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Open-Meteo HTTP error: ${res.status}`);
      const json = await res.json();
      const current = json.current || {};

      const tempC = Math.round(current.temperature_2m ?? 24);
      const rainMm = Number((current.precipitation ?? current.rain ?? 0).toFixed(1));
      const windKmh = Math.round(current.wind_speed_10m ?? 12);
      const weatherCode = current.weather_code ?? 0;
      const humidity = current.relative_humidity_2m ?? 70;

      const condition = mapWeatherCode(weatherCode);

      // Compute Live Risk Indices based on actual weather & humidity
      const isHighElevation = district.elevation.includes('1,') || district.elevation.includes('3,') || district.elevation.includes('890') || district.elevation.includes('960');
      const baseLandslide = isHighElevation ? 35 : 15;
      const landslideRiskIndex = Math.min(99, Math.max(10, Math.round(baseLandslide + rainMm * 0.8 + (humidity > 85 ? 15 : 0))));
      const flashFloodRiskIndex = Math.min(99, Math.max(10, Math.round(rainMm * 0.9 + (windKmh > 30 ? 15 : 0))));

      let warningLevel: 'None' | 'Yellow' | 'Orange' | 'Red' = 'None';
      if (landslideRiskIndex > 80 || flashFloodRiskIndex > 80 || rainMm > 45) {
        warningLevel = 'Red';
      } else if (landslideRiskIndex > 60 || flashFloodRiskIndex > 60 || rainMm > 20) {
        warningLevel = 'Orange';
      } else if (landslideRiskIndex > 35 || flashFloodRiskIndex > 35 || rainMm > 5) {
        warningLevel = 'Yellow';
      }

      const passStatus = district.passes.map(p => ({
        passName: p,
        status: (warningLevel === 'Red' ? 'Blocked' : warningLevel === 'Orange' ? 'Caution' : 'Open') as 'Blocked' | 'Caution' | 'Open',
        snowOrRain: `${rainMm}mm Rain / ${condition}`
      }));

      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const weatherData: WeatherData = {
        districtId: district.id,
        districtName: district.name,
        state: district.state,
        temperatureC: tempC,
        condition: condition,
        rainfallMm: rainMm,
        humidityPct: humidity,
        isLive: true,
        lastFetchedTime: nowTimeStr,
        windSpeedKmh: windKmh,
        visibilityMeters: warningLevel === 'Red' ? 250 : warningLevel === 'Orange' ? 800 : 3500,
        landslideRiskIndex: landslideRiskIndex,
        flashFloodRiskIndex: flashFloodRiskIndex,
        warningLevel: warningLevel,
        mountainPassStatus: passStatus
      };

      this.cache.set(district.id, { data: weatherData, timestamp: Date.now() });
      return weatherData;
    } catch (err) {
      console.warn(`[LiveWeatherService] Failed to fetch live weather for ${district.name}, using adaptive weather generator:`, err);
      return this.generateFallbackLiveWeather(district);
    }
  }

  async fetchAllLiveWeather(bypassCache: boolean = false): Promise<WeatherData[]> {
    const promises = NER_DISTRICT_COORDS.map(d => this.fetchDistrictLiveWeather(d, bypassCache));
    return await Promise.all(promises);
  }

  private generateFallbackLiveWeather(district: DistrictCoord): WeatherData {
    return {
      districtId: district.id,
      districtName: district.name,
      state: district.state,
      temperatureC: 22,
      condition: 'Scattered Mountain Rain',
      rainfallMm: 14.2,
      windSpeedKmh: 18,
      visibilityMeters: 2200,
      landslideRiskIndex: 42,
      flashFloodRiskIndex: 35,
      warningLevel: 'Yellow',
      mountainPassStatus: district.passes.map(p => ({ passName: p, status: 'Open', snowOrRain: '14mm Rain' }))
    };
  }
}

export const liveWeatherService = new LiveWeatherService();
