import { setupCityModal } from "./changeRegion.js";
import { loadFAQ } from "./faqGenerator.js";
import { loadNews } from "./loadNews.js";
import { buttonTop } from "./buttonTop.js";

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];


let moonData = [];
let moonRawData = {};


let currentMonthKey = "";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const weekday = d.toLocaleDateString("ru-RU", { weekday: "long" });
  const dayMonth = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dayMonth}`;
}

function getMoonIcon(phase) {
  const icons = {
    "Новолуние": "new-moon.svg",
    "Молодая Луна": "waxing-crescent.svg",
    "Первая четверть": "first-quarter.svg",
    "Растущая Луна": "waxing-gibbous.svg",
    "Полнолуние": "full-moon.svg",
    "Убывающая Луна": "waning-gibbous.svg",
    "Последняя четверть": "third-quarter.svg",
    "Старая Луна": "waning-crescent.svg"
  };
  console.log(phase);
  return `/source/moon/${icons[phase] || "new-moon.svg"}`;
}

function renderCurrentMoon() {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayData = moonData.find(d => d.date === todayStr) || moonData[0];


  if (!todayData) {
    console.warn("Нет данных о луне на сегодня");
    return;
  }

  document.querySelector(".moon-now").src = getMoonIcon(todayData.phase);
  document.querySelector(".moon-description-now .moon-date").textContent = formatDate(todayData.date);
  document.querySelector(".moon-description-now .moon-type").textContent = todayData.phase;
  

  const params = document.querySelector(".moon-parameters-now");
  params.querySelector(".visibility .title").textContent = "Видимость";
  params.querySelector(".visibility .value").textContent = `${todayData.visibility}%`;

  params.querySelector(".age .title").textContent = "Возраст";
  params.querySelector(".age .value").textContent = `${todayData.age} дн.`;

  params.querySelector(".moonrise .title").textContent = "Восход";
  params.querySelector(".moonrise .value").textContent = todayData.rise || "—";

  params.querySelector(".moonset .title").textContent = "Заход";
  params.querySelector(".moonset .value").textContent = todayData.set || "—";

  // document.querySelector(".moon-loop-description").textContent =
  //   `Текущий лунный цикл начался ${todayData.cycle_star}. Новолуние наступит ${todayData.new_moon}, а полнолуние ${todayData.full_moon}.`;
}

function renderMonthButtons() {
  const container = document.createElement("div");
  container.className = "month-buttons";
  

  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthName = monthNames[date.getMonth()];
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const btn = document.createElement("button");
    btn.textContent = monthName;
    btn.className = "month-btn";
    btn.dataset.key = monthKey;
    btn.style.scrollSnapAlign = "center";

    if (i === 0) btn.classList.add("active");

    btn.addEventListener("click", () => {
      document.querySelectorAll(".month-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCalendar(monthKey);

      const parent = container;
      const hasHorizontalScroll = parent.scrollWidth > parent.clientWidth;
      if (hasHorizontalScroll) {
        btn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    });

    container.appendChild(btn);
  }

  document.querySelector(".moon-section").insertBefore(container, document.querySelector(".moon-container-on"));
}


function renderCalendar(monthKey) {
  const calendarContainer = document.querySelector(".calendar-grid");
  if (calendarContainer) calendarContainer.remove();

  const container = document.createElement("div");
  container.className = "calendar-grid";

  const weekdayNames = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
  weekdayNames.forEach(d => {
    const dayLabel = document.createElement("div");
    dayLabel.className = "weekdays";
    dayLabel.textContent = d;
    container.appendChild(dayLabel);
  });

  const monthData = moonRawData[monthKey] || [];

  if (!monthData.length) {
    const noData = document.createElement("div");
    noData.textContent = "Нет данных для этого месяца";
    noData.style.gridColumn = "1 / -1";
    container.appendChild(noData);
    document.querySelector(".moon-section").insertBefore(container, document.querySelector(".moon-container-on"));
    return;
  }

  const firstDay = (new Date(monthData[0].date).getDay() || 7);
  for (let i = 1; i < firstDay; i++) {
    container.appendChild(document.createElement("div"));
  }

  const todayStr = new Date().toISOString().split("T")[0];

  monthData.forEach(d => {
    const cell = document.createElement("div");
    cell.className = "day";

    const img = document.createElement("img");
    img.src = getMoonIcon(d.phase);

    const num = document.createElement("div");
    num.textContent = new Date(d.date).getDate();

    cell.appendChild(num);
    cell.appendChild(img);

    cell.addEventListener("click", () => {
      document.querySelectorAll(".calendar-grid .day").forEach(day => day.classList.remove("active"));
      cell.classList.add("active");
      renderMoonDetails(d);
    });

    if (d.date === todayStr) {
      cell.classList.add("active");
      renderMoonDetails(d);
    }

    container.appendChild(cell);
  });

  document.querySelector(".moon-section").insertBefore(container, document.querySelector(".moon-container-on"));
}



function renderMoonDetails(data) {
  const img = document.querySelector(".moon-on");
  const dateEl = document.querySelector(".moon-description-on .date");
  const typeEl = document.querySelector(".moon-description-on .type");
  const params = document.querySelector(".moon-parameters-on");

  img.src = getMoonIcon(data.phase);
  dateEl.textContent = formatDate(data.date);
  typeEl.textContent = data.phase;

  params.querySelector(".visibility .title").textContent = "Видимость";
  params.querySelector(".visibility .value").textContent = `${data.visibility}%`;

  params.querySelector(".age .title").textContent = "Возраст";
  params.querySelector(".age .value").textContent = `${data.age} дн.`;

  params.querySelector(".moonrise .title").textContent = "Восход";
  params.querySelector(".moonrise .value").textContent = data.rise || "—";

  params.querySelector(".moonset .title").textContent = "Заход";
  params.querySelector(".moonset .value").textContent = data.set || "—";
}

export async function updateMoonData(city) {
  const res = await fetch("/source/moon/moon_data.json");
  moonRawData = await res.json();

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  currentMonthKey = monthKey;

  moonData = moonRawData[monthKey] || [];

  console.log("Загружены данные:", moonRawData);

  renderCurrentMoon();
  renderMonthButtons();
  renderCalendar(currentMonthKey);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentCity = document.getElementById("currentCity");
  const savedCity = localStorage.getItem("selectedCity") || "Москва";

  currentCity.textContent = savedCity;

  setupCityModal();
  updateMoonData(savedCity);
  loadNews("/source/data/main-news.json");
  loadFAQ("faq-moon", "/source/data/faq-moon.json");
  buttonTop();
});
