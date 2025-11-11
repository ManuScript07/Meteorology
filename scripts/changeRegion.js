import { updateWeatherData } from "./weatherUpdater.js";
import { updatePollenData } from "./pollen.js";
import { updateMagnetData } from "./magnet.js";
import { updateUVData } from "./uv.js";
import { updateMoonData } from "./moon.js";

export function setupCityModal() {
  const modal = document.getElementById("regionModal");
  const openModal = document.getElementById("openRegionModal");
  const closeModal = document.getElementById("closeRegionModal");
  const cancelBtn = document.getElementById("cancelCityBtn");
  const saveBtn = document.getElementById("saveCityBtn");
  const autoDetect = document.getElementById("autoDetect");
  const manualInput = document.getElementById("manualInput");
  const cityInput = document.getElementById("cityInput");
  const suggestionsList = document.getElementById("suggestionsList");
  const currentCity = document.getElementById("currentCity");

  const citySuggestions = [
    "Москва",
    "Санкт-Петербург",
    "Казань",
    "Новосибирск",
    "Екатеринбург",
    "Сочи",
    "Ростов-на-Дону"
  ];

  if (!modal || !openModal) {
    console.error("Не найдены элементы модального окна!");
    return;
  }

  
  openModal.addEventListener("click", () => {
    const city = currentCity.textContent.trim();

    if (city === "Москва") {
      autoDetect.checked = true;
      manualInput.checked = false;
      cityInput.disabled = true;
      cityInput.value = "";
      saveBtn.disabled = true;
    } else {
      autoDetect.checked = false;
      manualInput.checked = true;
      cityInput.disabled = false;
      cityInput.value = city;
      saveBtn.disabled = false;
    }

    modal.classList.add("active");
  });

  closeModal.addEventListener("click", closeModalWindow);
  cancelBtn.addEventListener("click", closeModalWindow);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModalWindow();
  });

  autoDetect.addEventListener("change", () => {
    if (autoDetect.checked) {
      cityInput.disabled = true;
      cityInput.value = "";
      suggestionsList.innerHTML = "";
      suggestionsList.classList.remove("visible");
      saveBtn.disabled = false;
    }
  });

  manualInput.addEventListener("change", () => {
    cityInput.disabled = !manualInput.checked;
    saveBtn.disabled = cityInput.value.trim() === "";
  });

  cityInput.addEventListener("input", () => {
    const query = cityInput.value.toLowerCase().trim();
    suggestionsList.innerHTML = "";
    saveBtn.disabled = true;

    if (query.length > 0) {
      const matches = citySuggestions.filter(c =>
        c.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        suggestionsList.classList.add("visible");
        matches.forEach(city => {
          const li = document.createElement("li");
          li.textContent = city;
          li.addEventListener("click", () => {
            cityInput.value = city;
            suggestionsList.classList.remove("visible");
            saveBtn.disabled = false;
          });
          suggestionsList.appendChild(li);
        });
      } else {
        suggestionsList.classList.remove("visible");
      }
    } else {
      suggestionsList.classList.remove("visible");
    }
  });

  saveBtn.addEventListener("click", () => {
    const newCity = autoDetect.checked ? "Москва" : cityInput.value.trim();
    console.log("Нажата кнопка сохранить. Новый город:", newCity);

    currentCity.textContent = newCity;
    localStorage.setItem("selectedCity", newCity);

    const path = window.location.pathname;

    if (path.includes("pollen")) {
      console.log("Обновляем данные пыльцы");
      updatePollenData?.(newCity);
    } else if (path.includes("magnet")) {
      console.log("Обновляем данные магнитного поля");
      updateMagnetData?.(newCity);
    } else if (path.includes("uv")) {
      console.log("Обновляем данные уф-индекса");
      updateUVData?.(newCity);
    
    } else if (path.includes("moon")) {
      console.log("Обновляем данные луны");
      updateMoonData?.(newCity);
    }
    else {
      console.log("Обновляем данные погоды");
      updateWeatherData?.(newCity);
    }

    closeModalWindow();
  });


  function closeModalWindow() {
    modal.classList.remove("active");
    suggestionsList.innerHTML = "";
    suggestionsList.classList.remove("visible");
  }
}
