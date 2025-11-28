export function generateBars(containerId, data, levelNames, options = {}) {
  const { days, labels, startDate = new Date(), showDate = true } = options;
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const isMagnetOrUv = containerId.toLowerCase().includes("magnet") || containerId.toLowerCase().includes("uv");

  data.forEach((level, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const dateStr = d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });

    const labelText =
      labels?.[i] ??
      (days ? days[d.getDay()] : d.toLocaleDateString("ru-RU", { weekday: "short" }));

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.dataset.level = level;
    bar.style.animationDelay = `${i * 0.05}s`;

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = showDate
      ? `${dateStr} ${levelNames[level] || ""}`
      : `${levelNames[level] || ""}`;
    bar.appendChild(tooltip);

    if (isMagnetOrUv) {
      const value = document.createElement("div");
      value.className = "bar-value";
      value.textContent = level;
      bar.appendChild(value);
    }

    const label = document.createElement("div");
    label.className = "bar-label no-anim";
    label.textContent = labelText;
    bar.appendChild(label);

    container.appendChild(bar);
  });
}

