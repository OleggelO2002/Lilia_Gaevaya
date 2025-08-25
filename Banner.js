document.addEventListener('DOMContentLoaded', function () {
  console.log('=== Banner script started ===');

  // Проверяем, есть ли уже баннер
  const existingBanner = document.querySelector('.custom-banner');
  if (existingBanner) {
    console.log('Баннер уже есть, добавление отменено');
    return;
  }

  console.log('Баннера нет, создаём...');

  // ====== СОЗДАЁМ БАННЕР ======
  const img = document.createElement('img');
  const isMobile = window.innerWidth <= 768;

  img.src = isMobile
    ? 'https://optim.tildacdn.pub/tild3439-3361-4565-a137-663462363365/-/resize/785x/-/format/webp/Frame_312.png'
    : 'https://static.tildacdn.com/tild3231-6535-4032-a430-396331383431/Frame_311.png';

  img.alt = 'Banner Image';
  img.style.width = '100%';
  img.style.height = 'auto';

  const bannerWrapper = document.createElement('div');
  bannerWrapper.classList.add('custom-banner');
  bannerWrapper.appendChild(img);

  // ====== ДОБАВЛЯЕМ В DOM ======
  const container = document.querySelector('.container');
  if (container) {
    console.log('Вставляем баннер в .container');
    container.insertBefore(bannerWrapper, container.firstChild);
  } else {
    const streamTable = document.querySelector('.xdget-root');
    if (streamTable) {
      console.log('Вставляем баннер перед .xdget-root');
      streamTable.parentNode.insertBefore(bannerWrapper, streamTable);
    } else {
      console.log('Не найдено место для вставки баннера');
    }
  }

  console.log('=== Banner script finished ===');
});
