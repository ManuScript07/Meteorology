// --- Функция проверки пустоты ---
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// --- Элементы формы ---
const captchaLabel = document.getElementById("captchaLabel");
const captchaInput = document.getElementById("captchaInput");
const checkCaptchaBtn = document.getElementById("checkCaptcha");
const captchaError = document.getElementById("captchaError");
const submitBtn = document.querySelector(".submit-element");

// --- Начальное состояние ---
let currentCaptcha = "";
let isLetterMode = true;

// Сразу блокируем кнопку "Войти" до прохождения капчи
submitBtn.disabled = true;
submitBtn.style.opacity = "0.6";
submitBtn.style.cursor = "not-allowed";

// --- Генерация буквенной капчи ---
function generateLetterCaptcha(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let captcha = "";
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

// --- Генерация числовой капчи ---
function generateNumberCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { text: `${a} + ${b} = ?`, answer: a + b };
}

// --- Отображение капчи ---
function showCaptcha() {
  captchaInput.value = "";
  captchaError.style.display = "none";

  if (isLetterMode) {
    currentCaptcha = generateLetterCaptcha();
    captchaLabel.textContent = `Введите текст: ${currentCaptcha}`;
  } else {
    const numericCaptcha = generateNumberCaptcha();
    currentCaptcha = numericCaptcha.answer;
    captchaLabel.textContent = `Решите пример: ${numericCaptcha.text}`;
  }
}

// --- Проверка капчи ---
checkCaptchaBtn.addEventListener("click", () => {
  const userValue = captchaInput.value.trim();

  // Проверка на пустой ввод (используем isEmpty)
  if (isEmpty({ value: userValue }) || userValue === "") {
    captchaError.textContent = "Поле не может быть пустым!";
    captchaError.style.display = "block";
    return;
  }

  if (isLetterMode) {
    if (userValue === currentCaptcha) {
      successCaptcha();
    } else {
      // Ошибка → переключаем на числовую капчу
      isLetterMode = false;
      captchaError.textContent = "Ошибка! Попробуйте решить пример:";
      captchaError.style.display = "block";
      showCaptcha();
    }
  } else {
    if (parseInt(userValue) === currentCaptcha) {
      successCaptcha();
    } else {
      captchaError.textContent = "Неверный ответ! Попробуйте снова.";
      captchaError.style.display = "block";
      showCaptcha();
    }
  }
});

// --- При успешной проверке ---
function successCaptcha() {
  captchaError.style.display = "none";
  captchaLabel.textContent = "✅ Проверка пройдена!";
  captchaInput.disabled = true;
  checkCaptchaBtn.disabled = true;

  // Разблокируем кнопку "Войти"
  submitBtn.disabled = false;
  submitBtn.style.opacity = "1";
  submitBtn.style.cursor = "pointer";
}

// --- Инициализация ---
showCaptcha();
