export async function loadNews(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Не удалось загрузить новости');
        const data = await response.json();

        const newsItems = (data.news || []).sort(() => Math.random() - 0.5);

        const reviewItems = document.querySelectorAll('.review-item');

        newsItems.forEach((item, index) => {
            if (index >= reviewItems.length) return;

            const el = reviewItems[index];
            const img = el.querySelector('img');
            const title = el.querySelector('h3');
            const text = el.querySelector('p');

            if (img && item.image) img.src = item.image;
            if (title && item.title) title.textContent = item.title;
            if (text && item.text) text.textContent = item.text;
        });
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
    }
}
