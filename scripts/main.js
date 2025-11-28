import { setupCityModal } from "./changeRegion.js";
import { updateWeatherData } from "./weatherUpdater.js";
import { buttonTop } from "./buttonTop.js";
import { loadNews } from "./loadNews.js";
import { initNotifications } from "./notificationManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentCity = document.getElementById("currentCity");
  const savedCity = localStorage.getItem("selectedCity") || "Москва";
  
  currentCity.textContent = savedCity || "Москва";
  
  initNotifications();
  updateWeatherData(savedCity);
  setupCityModal();
  loadNews("/source/data/main-news.json");
  buttonTop();
});
