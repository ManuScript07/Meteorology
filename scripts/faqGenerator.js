export async function loadFAQ(sectionId, jsonPath) {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`Ошибка загрузки FAQ: ${response.status}`);
    
    const data = await response.json();
    renderFAQ(sectionId, data);
  } catch (error) {
    console.error("Ошибка загрузки FAQ:", error);
  }
}

function renderFAQ(sectionId, data) {
  const section = document.getElementById(sectionId);
  if (!section || !data) return;

  section.classList.add("faq-section");

  const title = document.createElement("h2");
  title.textContent = data.title || "FAQ";
  section.appendChild(title);

  const container = document.createElement("div");
  container.classList.add("faq-grid");

  const columnCount = 2;
  const columns = Array.from({ length: columnCount }, () => {
    const col = document.createElement("div");
    col.classList.add("faq-column");
    container.appendChild(col);
    return col;
  });

  data.items.forEach((item, index) => {
    const col = columns[index % columnCount];

    const details = document.createElement("details");
    details.classList.add("faq-item");

    const summary = document.createElement("summary");
    summary.classList.add("faq-summary");

    const question = document.createElement("span");
    question.classList.add("faq-question");
    question.textContent = item.question;

    const icon = document.createElement("span");
    icon.classList.add("faq-icon");
    icon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    `;

    summary.appendChild(question);
    summary.appendChild(icon);

    const answer = document.createElement("p");
    answer.classList.add("faq-answer");
    answer.textContent = item.answer;

    details.appendChild(summary);
    details.appendChild(answer);
    col.appendChild(details);
  });

  section.appendChild(container);
}
