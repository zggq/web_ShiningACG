<template>
  <div class="forecast-section">
    <!-- 温度折线图 -->
    <h1>7日天气折线图</h1>
    <div id="forecast-chart" class="chart-container"></div>
    <!-- 湿度折线图 -->
    <h1>7日湿度折线图</h1>
    <div id="forecast-humidity-chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { throttle } from "lodash-es";
const loading = ref(true);
const error = ref(null);
const location = ref(null);
// 新增预报数据响应式对象
const forecast = ref({
  dates: [],
  highs: [],
  lows: [],
  icons: [],
  conditions: [],
  humidity: [],
});
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
    cache: "force-cache", // 强制使用浏览器缓存
  });
  if (!response.ok) throw new Error("网络请求失败");
  return response.json();
};
// 获取数据
const getWeatherData = async (coords) => {
  try {
    const weatherRes = await Promise.all([
      fetchData(
        `https://ne7p3yctu4.re.qweatherapi.com/v7/weather/7d?location=${coords.longitude},${coords.latitude}`
      ),
    ]);
    processWeatherData(weatherRes);
  } catch (err) {
    error.value = `数据获取失败: ${err.message}`;
  }
};

// 在processWeatherData函数中添加：
const processWeatherData = (data) => {
  data = data[0]; // 处理数组数据
  if (data.code !== "200") {
    throw new Error("天气数据无效");
  }
  //   console.log(data);
  // 新增预报数据处理
  forecast.value = data.daily.reduce(
    (acc, day) => {
      const dateStr = day.fxDate ? day.fxDate.slice(5).replace("-", "/") : "--";
    //   console.log(dateStr);
      acc.dates.push(dateStr);
      acc.highs.push(day.tempMax || 0); // 防止空值
      acc.lows.push(day.tempMin || 0);
      acc.humidity.push(day.humidity || 0); // 添加这行
      acc.icons.push({
        day: day.iconDay
          ? `https://qweather.com/img/icon/${day.iconDay}.png`
          : "",
        night: day.iconNight
          ? `https://qweather.com/img/icon/${day.iconNight}.png`
          : "",
      });
      acc.conditions.push({
        day: day.textDay || "--",
        night: day.textNight || "--",
      });
      return acc;
    },
    { dates: [], highs: [], lows: [], icons: [], conditions: [], humidity: [] }
  );
  // 添加加载状态控制
  nextTick(() => {
    if (forecast.value.dates.length > 0) {
      initChart();
    }
  });
};
// 初始化
const init = async () => {
  try {
    loading.value = true;
    const coords = await getLocation();
    // console.log(coords);
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
const initChart = () => {
  // 初始化温度图表
  initTemperatureChart();
  // 初始化湿度图表
  initHumidityChart();
};
// 图表初始化
const initTemperatureChart = () => {
  const chartDom = document.getElementById("forecast-chart");
  if (!chartDom || forecast.value.dates.length === 0) return; // 添加数据检查
  // 销毁旧图表实例
  let chart = echarts.getInstanceByDom(chartDom);
  if (chart) chart.dispose();
  chart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: throttle(
        (params) => {
        const dataIndex = params[0].dataIndex;
        // console.log(forecast.value.conditions[dataIndex].day);
        return `
          最高: ${params[0].data}°C<br/>
          最低: ${params[1].data}°C<br/>
        ${forecast.value.conditions[dataIndex].day} 转
        ${forecast.value.conditions[dataIndex].night}<br/>
        `;
      },
        500,
        { leading: true }
      ),
    },
    xAxis: {
      type: "category",
      data: forecast.value.dates,
      axisLabel: {
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      name: "温度 (°C)",
      axisLabel: {
        formatter: "{value}°C",
      },
    },
    series: [
      {
        name: "最高温度",
        type: "line",
        data: forecast.value.highs,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: "#ff6b6b",
          width: 3,
        },
        itemStyle: {
          color: "#ff6b6b",
        },
      },
      {
        name: "最低温度",
        type: "line",
        data: forecast.value.lows,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: "#4dabf7",
          width: 3,
        },
        itemStyle: {
          color: "#4dabf7",
        },
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
  };
  chart.setOption(option);
  // 响应式调整
  window.addEventListener("resize", () => chart.resize());
};
// 新增湿度图表配置
const initHumidityChart = () => {
  const chartDom = document.getElementById("forecast-humidity-chart");
  if (!chartDom || forecast.value.dates.length === 0) return;
  let chart = echarts.getInstanceByDom(chartDom);
  if (chart) chart.dispose();
  chart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: throttle(
        (params) => {
          const dataIndex = params[0].dataIndex;      
          return `
          日期: ${forecast.value.dates[dataIndex]}<br/>
          湿度: ${params[0].data}%<br/>
        `;
        },
        500,
        { leading: true }
      ),
    },
    xAxis: {
      type: "category",
      data: forecast.value.dates,
      axisLabel: {
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      name: "湿度 (%)",
      axisLabel: {
        formatter: "{value}%",
      },
      max: 100,
      min: 0,
    },
    series: [
      {
        name: "湿度",
        type: "line",
        data: forecast.value.humidity,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: "#52c41a",
          width: 3,
        },
        itemStyle: {
          color: "#52c41a",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(82,196,26,0.6)" },
            { offset: 1, color: "rgba(82,196,26,0.1)" },
          ]),
        },
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
  };
  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
};
onMounted(init);
</script>

<style scoped>
/* 新增样式 */
.forecast-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  font-family: "Firstfont";
}

.chart-container {
  height: 300px;
  margin: 1rem 0;
  position: relative; /* 新增 */
  z-index: 0; /* 新增 */
}

@media (max-width: 768px) {
  .chart-container {
    height: 200px;
  }
}
</style>
