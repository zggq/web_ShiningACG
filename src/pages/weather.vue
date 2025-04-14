<template>
  <div class="weather-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="weather-card">
      <!-- 头部信息 -->
      <div class="header">
        <h2>{{ airQuality.station }}</h2>
        <div class="update-time">更新于：{{ weather.updateTime }}</div>
      </div>

      <!-- 主要天气信息 -->
      <div class="main-weather">
        <div class="temperature-group">
          <div class="current-temp">{{ weather.temp }}°C</div>
          <div class="condition">{{ weather.condition }}</div>
        </div>
        <div class="feels-like">体感 {{ weather.feelsLike }}°C</div>
      </div>

      <!-- 详细数据网格 -->
      <div class="detail-grid">
        <div class="detail-item">
          <label>湿度</label>
          <span class="value">{{ weather.humidity }}%</span>
        </div>
        <div class="detail-item">
          <label>风速</label>
          <span class="value">{{ weather.wind }}</span>
        </div>
        <div class="detail-item">
          <label>气压</label>
          <span class="value">{{ weather.pressure }}</span>
        </div>
        <div class="detail-item">
          <label>能见度</label>
          <span class="value">{{ weather.visibility }}</span>
        </div>
      </div>

      <!-- 空气质量板块 -->
      <div class="air-quality" :style="{ backgroundColor: airQuality.color }">
        <h1>空气质量指数</h1>
        <div class="aqi-main">{{ airQuality.aqi }}</div>
        <div class="aqi-info">
          <span class="level">{{ airQuality.level }}级</span>
          <span class="category">{{ airQuality.category }}</span>
        </div>
        <div class="pollutants-grid">
          <div
            v-for="(value, key) in {
              'PM2.5': airQuality.pm2p5,
              PM10: airQuality.pm10,
              二氧化氮: airQuality.no2,
              臭氧: airQuality.o3,
              二氧化硫: airQuality.so2,
            }"
            :key="key"
            class="pollutant-item"
          >
            <label>{{ key }} : </label>
            <span class="value">{{ value }}</span>
          </div>
        </div>
        <div class="health-advice">{{ airQuality.advice }}</div>
      </div>
      <Echars></Echars>
      <button class="refresh-btn" @click="init">
        <span class="icon">🔄</span> 
        <span class="text">刷新数据</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Echars from "../components/Echars.vue";
// 响应式数据
const location = ref(null);
const weather = ref({
  temp: "--",
  feelsLike: "--",
  humidity: "--",
  wind: "--",
  pressure: "--",
  visibility: "--",
  condition: "--",
  icon: "",
  updateTime: "--",
});
const airQuality = ref({
  aqi: "--",
  level: "--",
  category: "--",
  color: "#ccc",
  pm2p5: "--",
  pm10: "--",
  no2: "--",
  o3: "--",
  so2: "--",
  advice: "--",
  station: "--",
  updateTime: "--",
});
const loading = ref(true);
const error = ref(null);

// 浏览器定位
const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
};

// API 请求封装
const fetchData = async (url) => {
  const response = await fetch(url, {
    headers: {
      "X-QW-Api-Key": "890ecac1fa274af0bd24955077eaf4c9",
      "Cache-Control": "max-age=7200, stale-while-revalidate=3600",
    },
    // cache: "force-cache",  // 强制使用浏览器缓存
  });
  if (!response.ok) throw new Error("网络请求失败");
  return response.json();
};

// 处理天气数据
const processWeatherData = (data) => {
  if (data.code !== "200") throw new Error("天气数据无效");

  weather.value = {
    temp: data.now.temp,
    feelsLike: data.now.feelsLike,
    humidity: data.now.humidity,
    wind: `${data.now.windDir} ${data.now.windScale}级`,
    pressure: `${data.now.pressure} hPa`,
    visibility: `${data.now.vis} 公里`,
    condition: data.now.text,
    updateTime: data.updateTime.replace("T", " ").split("+")[0],
  };
};

// 处理空气质量数据
const processAirData = (data) => {
  const primary = data.indexes[0];
  airQuality.value = {
    aqi: primary.aqiDisplay,
    level: primary.level,
    category: primary.category,
    color: `rgba(${primary.color.red},${primary.color.green},${primary.color.blue},${primary.color.alpha})`,
    pm2p5: data.pollutants[0].concentration.value,
    pm10: data.pollutants[1].concentration.value,
    no2: data.pollutants[2].concentration.value,
    o3: data.pollutants[3].concentration.value,
    so2: data.pollutants[4].concentration.value,
    advice: primary.health.advice.generalPopulation,
    station: data.stations[0].name,
    updateTime: data.metadata.tag.slice(0, 16), // 使用tag前16位作为模拟时间
  };
};

// 获取数据
const getWeatherData = async (coords) => {
  try {
    const [weatherRes, airRes] = await Promise.all([
      fetchData(
        `https://ne7p3yctu4.re.qweatherapi.com/v7/weather/now?location=${coords.longitude},${coords.latitude}`
      ),
      fetchData(
        `https://ne7p3yctu4.re.qweatherapi.com/airquality/v1/current/${coords.latitude}/${coords.longitude}`
      ),
    ]);

    processWeatherData(weatherRes);
    processAirData(airRes);
  } catch (err) {
    error.value = `数据获取失败: ${err.message}`;
  }
};

// 初始化
const init = async () => {
  try {
    loading.value = true;
    const coords = await getLocation();
    await getWeatherData({
      longitude: coords.longitude.toFixed(2),
      latitude: coords.latitude.toFixed(2),
    });
  } catch (err) {
    error.value = `定位失败: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

onMounted(init);
</script>

<style scoped>
/* 基础样式 */
.weather-container {
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  padding-top: 15vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Firstfont', sans-serif;
  width: 80%;
}
.loading {
  text-align: center;
  font-size: 1.8rem;
  color: #1364cd;
  width: 50%;
  margin: 20px auto;
}
.header {
  text-align: center;
  margin-bottom: 20px;
}
.header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}
.update-time {
  color: #666;
  font-size: 0.9rem;
}

/* 主要天气信息 */
.main-weather {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 20px 0;
}
.weather-icon {
  width: 80px;
  height: 80px;
}
.temperature-group {
  text-align: center;
}
.current-temp {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
}
.condition {
  color: #666;
  margin-top: -8px;
}
.feels-like {
  color: #666;
  font-size: 0.95rem;
}

/* 详细数据网格 */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin: 20px 0;
}
.detail-item {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}
.detail-item label {
  display: block;
  color: #666;
  font-size: 0.9rem;
}
.detail-item .value {
  display: block;
  font-weight: bold;
  margin-top: 4px;
}

/* 空气质量板块 */
.air-quality {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  color: white;
  /* color: rgb(170, 160, 160); */
  margin: 20px 0;
}
.aqi-main {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}
.aqi-info {
  text-align: center;
  margin-bottom: 15px;
}
.level {
  margin-right: 10px;
}
.pollutants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
  margin: 15px 0;
}
.pollutant-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 6px;
  text-align: center;
}
.health-advice {
  font-size: 0.9rem;
  margin-top: 15px;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .weather-container {
    width: 99vw;
    border-radius: 12px;
    padding: 0;
    padding-top: 15vh;
  }
  .current-temp {
    font-size: 2rem;
  }
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .pollutants-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.refresh-btn {
  display: flex;
  /* position: relative;
  left: 50%;
  transform: translateX(-50%); */
  min-width: 120px;
  padding: 12px;
  background: #a1c7ed;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 auto ;
  text-align: center;
}
.refresh-btn:hover {
  background: #79b1e9;
}
.icon {
  margin-right: 8px;
}
</style>
