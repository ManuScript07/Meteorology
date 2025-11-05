export function updateMagnetBars() {
  const levelNames = [
    "Спокойное", "Спокойное", "Спокойное", "Спокойное",
    "Спокойное", "Слабая буря", "Умеренная буря",
    "Сильная буря", "Очень сильная буря", "Экстремальная буря"
  ];

  const hours = ["6", "9", "12", "15", "18", "21", "0", "3"];
  
  // Пример данных
  const dataToday = [3, 4, 4, 5, 6, 5, 4, 3];
  const dataTomorrow = [4, 5, 6, 6, 7, 6, 5, 4];
  const dataAfter = [5, 6, 7, 7, 8, 7, 6, 5];

  function generateBars(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    data.forEach((level, i) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.dataset.level = level;
      bar.style.height = `${(level + 1) * 18}px`;
      bar.style.animationDelay = `${i * 0.05}s`;

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = `${hours[i]}:00 — ${levelNames[level]}`;
      bar.appendChild(tooltip);

      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = hours[i];
      bar.appendChild(label);

      container.appendChild(bar);
    });
  }

  generateBars("magnetBarsToday", dataToday);
  generateBars("magnetBarsTomorrow", dataTomorrow);
  generateBars("magnetBarsAfter", dataAfter);
}

updateMagnetBars();
