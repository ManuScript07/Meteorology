import { buttonTop } from "./buttonTop.js";
import { setupCityModal } from "./changeRegion.js";
import { loadFAQ } from "./faqGenerator.js";
import { generateBars } from "./generateBars.js";
import { loadNews } from "./loadNews.js";


document.addEventListener("DOMContentLoaded", () => {
  const currentCity = document.getElementById("currentCity");
  const savedCity = localStorage.getItem("selectedCity") || "Москва";

  currentCity.textContent = savedCity;

  setupCityModal();
  updateMagnetData(savedCity);
  loadNews("source/data/main-news.json");
  loadFAQ("faq-magnet", "source/data/faq-magnet.json");
  buttonTop();
});

export function updateMagnetData(city){
  updateMagnetScale(city, 5);
  updateMagnetDates();
  updateMagnetBars(city);
}

export function updateMagnetBars(city) {
  const levelNames = [
    "Спокойное", "Спокойное", "Спокойное", "Спокойное",
    "Спокойное", "Слабая буря", "Умеренная буря",
    "Сильная буря", "Очень сильная буря", "Экстремально сильная буря"
  ];

  const hours = ["6", "9", "12", "15", "18", "21", "0", "3"];

  const dataToday = [1, 2, 3, 4, 5, 6, 8, 9];
  const dataTomorrow = [4, 5, 6, 6, 7, 6, 5, 4];
  const dataAfter = [5, 6, 7, 7, 8, 7, 6, 5];

  generateBars("magnetBarsToday", dataToday, levelNames, { labels: hours, showDate: false });
  generateBars("magnetBarsTomorrow", dataTomorrow, levelNames, { labels: hours, showDate: false });
  generateBars("magnetBarsAfter", dataAfter, levelNames, { labels: hours, showDate: false });
}

export function updateMagnetScale(city, level = 2) {
  const scaleFill = document.querySelector(".scale-fill");
  const scaleValue = document.querySelector(".scale-value");

  if (!scaleFill || !scaleValue) return;
  
  const clamped = Math.max(0, Math.min(9, level));

  const fullLength = 210;

  const fillLength = (clamped / 9) * fullLength;

  scaleFill.style.strokeDasharray = `${fillLength}, ${fullLength - fillLength}`;

  let color = "#00ff85";
  if (clamped >= 4 && clamped <= 5) color = "#ffd166";
  else if (clamped >= 6 && clamped <= 7) color = "#ff8c42";
  else if (clamped >= 8) color = "#ff5c5c";

  scaleFill.style.stroke = color;

  scaleValue.textContent = clamped;

  const header = document.querySelector(".magnet-info h2");
  header.textContent = `Геомагнитное поле в городе ${city}`;
}

function updateMagnetDates() {
  const daysOfWeek = [
    "воскресенье", "понедельник", "вторник",
    "среда", "четверг", "пятница", "суббота"
  ];

  const today = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long"
    });
  };

  const magnetDays = document.querySelectorAll(".magnet-day");

  magnetDays.forEach((dayBlock, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const title = dayBlock.querySelector("h4");
    const dateSpan = dayBlock.querySelector(".date");

    if (index === 0) {
      title.childNodes[0].textContent = "Сегодня ";
    } else if (index === 1) {
      title.childNodes[0].textContent = "Завтра ";
    } else {
      const weekday = daysOfWeek[date.getDay()];
      title.childNodes[0].textContent =
        weekday.charAt(0).toUpperCase() + weekday.slice(1) + " ";
    }

    dateSpan.textContent = formatDate(date);
  });
}

