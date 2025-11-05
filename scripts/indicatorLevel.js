export function updateIndicatorLevel(city){

  const icons = document.querySelectorAll(".metric-icon");

  const fills = [0.3, 0.6, 0.9];

  icons.forEach((icon, i) => {
    const fill = fills[i] ?? Math.random().toFixed(2);
    icon.style.setProperty("--fill", fill);
  });

}
