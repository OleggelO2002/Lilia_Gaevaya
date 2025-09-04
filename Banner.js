document.addEventListener('DOMContentLoaded', function () {
  // ====== СОЗДАЁМ БАННЕР ======
  const img = document.createElement('img');
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    img.src = 'https://optim.tildacdn.pub/tild3439-3361-4565-a137-663462363365/-/resize/785x/-/format/webp/Frame_312.png';
  } else {
    img.src = 'https://static.tildacdn.com/tild3231-6535-4032-a430-396331383431/Frame_311.png';
  }

  img.alt = 'Banner Image';
  img.style.width = '100%';
  img.style.height = 'auto';

  const bannerWrapper = document.createElement('div');
  bannerWrapper.classList.add('custom-banner');
  bannerWrapper.appendChild(img);

  // ====== ДОБАВЛЯЕМ В DOM ======
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(bannerWrapper, container.firstChild);
  } else {
    const streamTable = document.querySelector('.xdget-root');
    if (streamTable) {
      streamTable.parentNode.insertBefore(bannerWrapper, streamTable);
    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const targetContainer = document.querySelector('.col-md-4');
  if (!targetContainer) return;

  if (targetContainer.querySelector('.xdget-lessonSchedule')) return;

  fetch('/teach/control/stream/index')
    .then(response => response.text())
    .then(htmlText => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const lessonSchedule = doc.querySelector('.xdget-lessonSchedule');

      if (lessonSchedule) {
        const clone = lessonSchedule.cloneNode(true);
        targetContainer.appendChild(clone);
      }
    })
    .catch(err => {
      console.error('Ошибка при загрузке расписания:', err);
    });
});
