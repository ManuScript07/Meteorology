import { showNotification } from "./floatingNotification.js";

function delayDecorator(fn, delay = 10000) {
  let isLocked = false;

  return function (...args) {
    if (isLocked) return;

    fn.apply(this, args);
    isLocked = true;

    setTimeout(() => {
      isLocked = false;
    }, delay);
  };
}

class NotificationManager {
  constructor(listSelector, badgeSelector, containerSelector = ".notification") {
    this.list = document.querySelector(listSelector);
    this.badge = document.querySelector(badgeSelector);
    this.container = document.querySelector(containerSelector);
    this.header = this.container?.querySelector(".header");
    this.maxItems = 10;
    this.paused = false;

    this.counter = this.list?.children.length || 0;
    this.updateNumbers();
    this.updateBadge();

    if (this.header) {
      this.header.addEventListener(
        "click",
        delayDecorator(() => this.pauseNotifications(), 10000)
      );
    }
  }

  get count() {
    return this.counter;
  }

  set count(value) {
    this.counter = Math.min(value, this.maxItems);
    this.updateBadge();
  }

  addNotification(text) {
    if (!this.list || this.paused) return;

    const li = document.createElement("li");
    li.textContent = text;

    setTimeout(() => li.classList.add("incoming"), 200);

    this.list.insertBefore(li, this.list.firstChild);

    if (this.list.children.length > this.maxItems) {
      const last = this.list.lastElementChild;
      last.classList.add("fade-out");
      setTimeout(() => {
        if (last.parentNode) last.remove();
        this.updateNumbers();
        this.count = this.list.children.length;
      }, 300);
    }

    this.count = this.list.children.length;
    this.updateNumbers();

    li.addEventListener("animationend", () => li.classList.remove("incoming"));

    showNotification({message: text, type: "info", duration: 1500})
  }

  updateBadge() {
    if (this.badge) this.badge.textContent = this.counter;
  }

  updateNumbers() {
    if (!this.list) return;
    const items = Array.from(this.list.children);
    const total = items.length;

    items.forEach((li, i) => {
      li.setAttribute("data-index", total - i);
    });
  }

  pauseNotifications() {
    if (this.paused) return;

    console.log("⏸️ Уведомления приостановлены на 10 секунд");
    this.paused = true;
    this.container?.classList.add("paused");

    setTimeout(() => {
      this.paused = false;
      this.container?.classList.remove("paused");
      console.log("▶️ Уведомления возобновлены");
    }, 10000);
  }

  start(interval = 3000) {
    if (!this.list || !this.badge) return;

    this.updateNumbers();
    this.updateBadge();

    setInterval(() => {
      const time = new Date().toLocaleTimeString();
      this.addNotification(`Новое уведомление (${time})`);
    }, interval);
  }
}

export function initNotifications() {
  const manager = new NotificationManager(".notification .list", ".notification .badge");
  manager.start(3000);
}
