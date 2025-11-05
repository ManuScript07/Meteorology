import { buttonTop } from "./buttonTop.js";
import { setupCityModal } from "./changeRegion.js";
import { loadFAQ } from "./faqGenerator.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentCity = document.getElementById("currentCity");
  const savedCity = localStorage.getItem("selectedCity") || "Москва";
  
  currentCity.textContent = savedCity;

  setupCityModal();
  updatePollenData(savedCity);
  loadFAQ("faq-section", "/source/data/faq-pollen.json");
  buttonTop();
});

export function updatePollenData(city) {
  const allergenData = {
    weeds: [1, 2, 2, 1, 1, 0, 0, 1, 2, 3],
    mugwort: [1, 1, 2, 2, 3, 3, 2, 2, 1, 1],
    birch: [0, 1, 2, 3, 3, 2, 2, 1, 1, 0],
    alder: [0, 1, 2, 2, 2, 1, 1, 0, 0, 0],
    ragweed: [0, 0, 1, 1, 2, 3, 3, 3, 2, 2]
  };

  const levelNames = ["Нет активности", "Низкая", "Умеренная", "Высокая"];
  const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const today = new Date();

  function generateBars(data) {
    const container = document.getElementById("pollenBars");
    container.innerHTML = "";

    data.forEach((level, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toLocaleDateString("ru-RU", {
        day: "2-digit", month: "2-digit"
      });
      const dayName = days[d.getDay()];

      const bar = document.createElement("div");
      bar.className = "bar";
      bar.dataset.level = level;
      bar.style.animationDelay = `${i * 0.05}s`;

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = `${dateStr} ${levelNames[level]}`;
      bar.appendChild(tooltip);

      const label = document.createElement("div");
      label.className = "bar-label no-anim";
      label.textContent = dayName;
      bar.appendChild(label);

      container.appendChild(bar);
    });
  }

  generateBars(allergenData.weeds);

  const allergenName = document.getElementById("allergen-name");
  const allergenStatus = document.querySelector("#allergen-status .status");

  allergenName.textContent = "Сорняки";
  allergenStatus.textContent = "низкая активность";
  

  const mainAllergenStatus = document.querySelector(".pollen-title .status");
  mainAllergenStatus.className = "status low";

  const description = document.querySelector(".pollen-description");
  description.textContent = `Сегодня и завтра низкая активность пыльцы в городе ${city}`;

  const buttons = document.querySelectorAll(".pollen-btn");

  buttons.forEach(btn => {
    btn.onclick = () => {
      if (btn.classList.contains("active")) return;
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.type;
      const avg = allergenData[key].reduce((a, b) => a + b, 0) / allergenData[key].length;

      allergenName.textContent = btn.textContent;
      allergenStatus.textContent =
        avg < 1 ? "низкая активность" :
        avg < 2 ? "умеренная активность" : "высокая активность";

      generateBars(allergenData[key]);
    };
  });
}
