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

    this.maxItems = Infinity;

    this.paused = false;

    this.counter = this.list?.children.length || 0;
    
    this.updateNumbers();

    this.list?.querySelectorAll("li").forEach(li => {
      if (!li.querySelector(".close-btn")) {
        const btn = document.createElement("button");
        btn.className = "close-btn";
        btn.innerHTML = "&times;";
        li.prepend(btn);
      }
    });

    this.updateBadge();

    this.list?.addEventListener("click", (event) => {
      const btn = event.target.closest(".close-btn");
      if (!btn) return;

      const li = btn.closest("li");
      if (!li) return;

      li.classList.add("fade-out");

      setTimeout(() => {
        li.remove();

        this.count = this.list.children.length;

        if (this.list.children.length === 0) {
          this.updateNumbers();
        }

      }, 300);
    });

    // if (this.header) {
    //   this.header.addEventListener(
    //     "click",
    //     delayDecorator(() => this.pauseNotifications(), 10000)
    //   );
    // }
  }

  get count() {
    return this.counter;
  }

  set count(value) {
    this.counter = value;
    this.updateBadge();
  }

  addNotification(text) {
    if (!this.list || this.paused) return;

    const li = document.createElement("li");

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "&times;";
    li.appendChild(closeBtn);

    const span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);

    setTimeout(() => li.classList.add("incoming"), 200);

   this.list.insertBefore(li, this.list.firstChild);

    this.count = this.list.children.length;

    this.updateNumbers();

    li.addEventListener("animationend", () => li.classList.remove("incoming"));

    showNotification({ message: text, type: "info", duration: 1500 });
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

    console.log("Уведомления приостановлены на 10 секунд");
    this.paused = true;
    this.container?.classList.add("paused");

    setTimeout(() => {
      this.paused = false;
      this.container?.classList.remove("paused");
      console.log("Уведомления возобновлены");
    }, 10000);
  }

  start(interval = 30000) {
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

  manager.start(10000);
}
