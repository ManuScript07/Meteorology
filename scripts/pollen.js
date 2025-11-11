import { buttonTop } from "./buttonTop.js";
import { setupCityModal } from "./changeRegion.js";
import { loadNews } from "./loadNews.js";
import { loadFAQ } from "./faqGenerator.js";
import { generateBars } from "./generateBars.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentCity = document.getElementById("currentCity");
  const savedCity = localStorage.getItem("selectedCity") || "Москва";

  currentCity.textContent = savedCity;

  setupCityModal();
  updatePollenData(savedCity);
  loadNews("/source/data/main-news.json");
  loadFAQ("faq-pollen", "/source/data/faq-pollen.json");
  buttonTop();
});

export function updatePollenData(city) {
  const allergenData = {
    weeds: [1, 2, 2, 1, 1, 0, 0, 1, 2, 3],
    mugwort: [1, 1, 2, 2, 3, 3, 2, 2, 1, 1],
    birch: [0, 1, 2, 3, 3, 2, 2, 1, 1, 0],
    alder: [0, 1, 2, 2, 2, 1, 1, 0, 0, 0],
    ragweed: [0, 0, 1, 1, 2, 3, 3, 3, 2, 2],
  };

  const levelNames = ["Нет активности", "Низкая", "Умеренная", "Высокая"];
  const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const today = new Date();

  generateBars("pollenBars", allergenData.weeds, levelNames, { days, startDate: today });

  const allergenName = document.getElementById("allergen-name");
  const allergenStatus = document.querySelector("#allergen-status .status");
  const mainAllergenStatus = document.querySelector(".pollen-title .status");
  const description = document.querySelector(".pollen-description");
  const buttons = document.querySelectorAll(".pollen-btn");

  allergenName.textContent = "Сорняки";
  allergenStatus.textContent = "низкая активность";
  mainAllergenStatus.className = "status low";
  description.textContent = `Сегодня и завтра низкая активность пыльцы в городе ${city}`;

  buttons.forEach(btn => {
    btn.onclick = () => {
      if (btn.classList.contains("active")) return;
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.type;
      const data = allergenData[key];
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      allergenName.textContent = btn.textContent;
      allergenStatus.textContent =
        avg < 1 ? "низкая активность" :
        avg < 2 ? "умеренная активность" : "высокая активность";


      generateBars("pollenBars", data, levelNames, { days, startDate: today });
    };
  });
}
