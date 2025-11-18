
export function showNotification({ message = "", type = "info", duration = 1500 } = {}) {
  let container = document.querySelector(".floating-notifications");
  if (!container) {
    container = document.createElement("div");
    container.className = "floating-notifications";
    document.body.appendChild(container);
  }

  const notif = document.createElement("div");
  notif.className = `floating-notification ${type}`;
  notif.innerHTML = message;

  container.appendChild(notif);

  requestAnimationFrame(() => notif.classList.add("visible"));

  setTimeout(() => {
    notif.classList.remove("visible");
    notif.classList.add("hide");
    setTimeout(() => notif.remove(), 400);
  }, duration);
}
