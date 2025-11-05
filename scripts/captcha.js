function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const captchaLabel = document.getElementById("captchaLabel");
const captchaInput = document.getElementById("captchaInput");
const checkCaptchaBtn = document.getElementById("checkCaptcha");
const captchaError = document.getElementById("captchaError");
const submitBtn = document.querySelector(".submit-element");

let currentCaptcha = "";
let isLetterMode = true;

submitBtn.disabled = true;
submitBtn.style.opacity = "0.6";
submitBtn.style.cursor = "not-allowed";

function generateLetterCaptcha(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let captcha = "";
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}


function generateNumberCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { text: `${a} + ${b} = ?`, answer: a + b };
}


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


checkCaptchaBtn.addEventListener("click", () => {
  const userValue = captchaInput.value.trim();

  if (isEmpty({ value: userValue }) || userValue === "") {
    captchaError.textContent = "Поле не может быть пустым!";
    captchaError.style.display = "block";
    return;
  }

  if (isLetterMode) {
    if (userValue === currentCaptcha) {
      successCaptcha();
    } else {
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


function successCaptcha() {
  captchaError.style.display = "none";
  captchaLabel.textContent = "✅ Проверка пройдена!";
  captchaInput.disabled = true;
  checkCaptchaBtn.disabled = true;

  submitBtn.disabled = false;
  submitBtn.style.opacity = "1";
  submitBtn.style.cursor = "pointer";
}

showCaptcha();
