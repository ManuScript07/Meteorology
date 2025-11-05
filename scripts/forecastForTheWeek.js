export function updateForecastForTheWeek(city){
  const container = document.querySelector("#ForecastForTheWeek .forecast-container");

  if (!container) return;
  container.innerHTML = "";

  const DAYS = 7;
  const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const now = new Date();

  const formatDate = (date) => {
    const day = date.getDate();
    const monthNames = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${day} ${monthNames[date.getMonth()]}`;
  };

  const timesOfDay = ["Утро", "День", "Вечер", "Ночь"];

  for (let i = 0; i < DAYS; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayName = i === 0 ? "Сегодня" : i === 1 ? "Завтра" : dayNames[date.getDay()];
    const dateLabel = `${dayName}, ${formatDate(date)}`;

    const article = document.createElement("article");
    article.className = "forecast-article";
    if (i === 0)
      article.id = "Today"
    else if (i === 1)
      article.id = "Tomorrow"

    const table = document.createElement("div");
    table.className = "forecast-table";

    const header = document.createElement("div");
    header.className = "forecast-header";
    header.textContent = dateLabel;
    table.appendChild(header);

    const labels = document.createElement("div");
    labels.className = "forecast-row labels";
    labels.innerHTML = `
      <span>время</span>
      <span>температура, °С</span>
      <span>ветер, м/с</span>
      <span>влажность</span>
      <span>давление, мм рт. ст</span>
    `;
    table.appendChild(labels);

    timesOfDay.forEach((time) => {
        const temp = getRandom(5, 25) * (getRandom(0, 1) ? 1 : -1);
        const wind = getRandom(1, 10);
        const humidity = getRandom(40, 95);
        const pressure = getRandom(735, 760);
        const icon = getRandom(0, 26);

        const row = document.createElement("div");
        row.className = "forecast-row";
        row.innerHTML = `
            <span class="time">${time}</span>
            <span class="temp">
            <div class="weather-icon" style="--icon: ${icon}"></div>
            ${temp}°
            </span>
            <span class="wind">${wind} м/с</span>
            <span class="humidity">${humidity}%</span>
            <span class="pressure">${pressure}</span>
        `;
        table.appendChild(row);
});


    article.appendChild(table);
    container.appendChild(article);
  }
}
