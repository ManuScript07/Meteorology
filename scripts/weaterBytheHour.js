export function updateWeatherByTheHour(city){
    const container = document.getElementById("hourly-scroll");

    if (!container) return;
    container.innerHTML = "";

    const hoursBefore = 3;
    const hoursAfter = 12;

    const now = new Date();
    const startHour = now.getHours() - hoursBefore;

    let weatherIcons = Array.from({length: 26}, (_, i) => i+1);

    const getRandomTemp = () => Math.floor(Math.random() * 10) + 5;

    for (let i = -hoursBefore; i <= hoursAfter; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hourStr = hour.getHours().toString().padStart(2, "0") + ":00";
      
      const icon = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
      const temp = `+${getRandomTemp()}°`;

      const block = document.createElement("div");
      block.className = "hour-block";
      block.innerHTML = `
        <span class="time">${hourStr}</span>
        <div class="weather-icon" style="--icon: ${icon}"></div>
        <span class="temp">${temp}</span>
      `;
      
      if (i === 0) {
          block.style.width = "100px";
          block.style.transform = "scale(1.02)";
          block.style.background = "rgba(255, 255, 255, 0.1)";
          block.style.borderRadius = "10px";

      }

      container.appendChild(block);
    }

    setTimeout(() => {
      const current = container.querySelector(".hour-block:nth-child(4)");
      if (current) {
          const offset = current.offsetLeft - container.clientWidth / 2 + current.clientWidth / 2;
          container.scrollTo({ left: offset, behavior: "smooth" });
      }
      }, 300);

}

