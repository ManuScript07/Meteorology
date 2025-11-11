import { setupCityModal } from "./changeRegion.js";
import { generateBars } from "./generateBars.js";
import { loadNews } from "./loadNews.js";
import { loadFAQ } from "./faqGenerator.js";
import { buttonTop } from "./buttonTop.js";



document.addEventListener("DOMContentLoaded", () => {
  const currentCity = document.getElementById("currentCity");
  const savedCity = localStorage.getItem("selectedCity") || "Москва";

  currentCity.textContent = savedCity;

  setupCityModal();
  updateUVData(savedCity);
  loadNews("/source/data/main-news.json");
  loadFAQ("faq-uv", "/source/data/faq-uv.json");
  buttonTop();
});


export function updateUVData(city) {
  if (!document.querySelector(".uv-day")) return;

  updateUvDates();

  const buttons = document.querySelectorAll(".uv-day");
  buttons.forEach(btn => btn.classList.remove("active"));

  const firstBtn = buttons[0];
  if (firstBtn) firstBtn.classList.add("active");

  const todayData = uvForecast.today || [];
  const initHourIdx = nearestHourIndex();
  const initRep = todayData[initHourIdx] ?? Math.max(...todayData);
  updateUvUIForDay(0, initRep);
  buildUvChartForKey(0);

  onDayClickSetup();
}

const hours = ["09","10","11","12","13","14","15","16","17","18","19"];
const levelNames = [
  "Низкий","Низкий","Низкий","Умеренный","Умеренный",
  "Умеренный","Высокий","Высокий","Очень высокий",
  "Очень высокий","Очень высокий","Экстремальный"
];

const uvLevels = [
  { min: 0, max: 2,  name: "Низкий",       color: "rgb(51, 193, 21)",  class: "low",       desc: "Солнце доброе, защита не нужна" },
  { min: 3, max: 5,  name: "Умеренный",    color: "rgb(255, 212, 0)",  class: "moderate",  desc: "Можно гулять, но не забывай про очки" },
  { min: 6, max: 7,  name: "Высокий",      color: "rgb(255, 126, 1)",  class: "high",      desc: "Пора надеть панаму" },
  { min: 8, max: 10, name: "Очень высокий",color: "rgb(195, 1, 1)",    class: "very-high", desc: "Солнце агрессивное, нужна защита!" },
  { min: 11, max: 50,name: "Экстремальный",color: "rgb(87, 52, 141)",  class: "extreme",   desc: "Лучше не выходи без защиты" }
];

const uvForecast = {
  today:    [0,1,2,1,2,2,1,1,1,0,0],
  tomorrow: [1,2,3,3,3,4,4,4,3,2,2],
  day3:     [2,3,4,4,5,6,5,4,3,2,2],
  day4:     [3,4,5,6,6,8,5,4,3,3,2],
  day5:     [4,5,6,7,7,11,7,6,5,4]
};

const dayKeys = ["today","tomorrow","day3","day4","day5"];
const shortDays = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];

function pickLevelByValue(value) {
  if (value == null || Number.isNaN(value)) return uvLevels[0];
  return uvLevels.find(l => value >= l.min && value <= l.max) || uvLevels[uvLevels.length - 1];
}

function nearestHourIndex() {
  const now = new Date();
  const hh = now.getHours();
  for (let i = 0; i < hours.length; i++) {
    const h = Number(hours[i]);
    if (hh <= h) return i;
  }
  return hours.length - 1;
}

function updateUvDates() {
  const buttons = document.querySelectorAll(".uv-day");
  const today = new Date();

  buttons.forEach((btn, i) => {
    const existingDot = btn.querySelector(".uv-dot");
    const dotStyleBg = existingDot ? getComputedStyle(existingDot).backgroundColor : "";
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayNum = d.getDate();
    const weekday = shortDays[d.getDay()];

    if (i === 0) btn.innerHTML = `<span class="uv-dot" style="background:${dotStyleBg}"></span>Сегодня`;
    else if (i === 1) btn.innerHTML = `<span class="uv-dot" style="background:${dotStyleBg}"></span>Завтра`;
    else btn.innerHTML = `<span class="uv-dot" style="background:${dotStyleBg}"></span>${weekday}, ${dayNum}`;
  });
}

function updateUvUIForDay(dayIndex, representativeValue) {
  const level = pickLevelByValue(representativeValue);
  const header = document.querySelector(".uv-header");
  const statusEl = document.querySelector(".uv-status");
  const descEl = document.querySelector(".uv-description");
  const bigCircle = document.querySelector(".uv-circle-indicator");

  if (header) {
    header.classList.remove("low","moderate","high","very-high","extreme");
    header.classList.add(level.class);
  }

  if (statusEl) {
    const prefix = dayIndex === 0 ? "Сегодня" : "Будет";
    statusEl.innerHTML = `${prefix} ${level.name.toLocaleLowerCase()} <span class="uv-level-circle ${level.class}">${representativeValue}</span>`;
  }

  if (descEl) descEl.textContent = level.desc;
  if (bigCircle) {
    bigCircle.className = `uv-circle-indicator ${level.class}`;
  }

  const buttons = document.querySelectorAll(".uv-day");
  buttons.forEach((btn, idx) => {
    const data = uvForecast[dayKeys[idx]] || uvForecast.today;
    const rep = idx === 0 ? data[nearestHourIndex()] ?? Math.max(...data) : Math.max(...data);
    const lvl = pickLevelByValue(rep);
    const dot = btn.querySelector(".uv-dot");
    if (dot) dot.style.background = lvl.color;
  });
}

function buildUvChartForKey(keyIndex) {
  const key = dayKeys[keyIndex] || "today";
  const data = uvForecast[key];
  if (!Array.isArray(data)) return;
  generateBars("uvBars", data, levelNames, { labels: hours, showDate: false });
}

function onDayClickSetup() {
  const buttons = document.querySelectorAll(".uv-day");
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const data = uvForecast[dayKeys[i]] || uvForecast.today;
      const idx = nearestHourIndex();
      const rep = i === 0 
      ? (data[idx] !== undefined && data[idx] > 0 ? data[idx] : Math.max(...data)) 
      : Math.max(...data);

      updateUvUIForDay(i, rep);
      buildUvChartForKey(i);
    });
  });
}







