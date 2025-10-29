export function updateIndicatorLevel(city){

  const icons = document.querySelectorAll(".metric-icon");

  const fills = [0.2, 0.6, 1];

  icons.forEach((icon, i) => {
    const fill = fills[i] ?? Math.random().toFixed(2);
    icon.style.setProperty("--fill", fill);
  });

}
