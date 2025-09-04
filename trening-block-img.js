(function addTrainingImages() {
  let attempts = 0;
  const maxAttempts = 20; // максимальное количество проверок
  const intervalTime = 200; // интервал в мс

  const interval = setInterval(() => {
    attempts++;

    const trainingRows = document.querySelectorAll('tr.training-row');
    if (trainingRows.length > 0) {
      clearInterval(interval);

      trainingRows.forEach(row => {
        const imgUrl = row.dataset.trainingImage; // Берем URL из data-training-image
        if (imgUrl && !row.querySelector('.training-image-wrapper')) {
          // Заменяем 200x200 на 700x700 в ссылке
          const highResUrl = imgUrl.replace(/\/s\/\d+x\d+\//, '/s/700x700/');

          const imgWrapper = document.createElement('div');
          imgWrapper.classList.add('training-image-wrapper');

          const img = document.createElement('img');
          img.src = window.location.protocol + highResUrl; // добавляем https:
          img.alt = 'training image';
          img.classList.add('training-image');

          imgWrapper.appendChild(img);
          row.insertBefore(imgWrapper, row.firstChild);
        }
      });

    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn('Training images not found after multiple attempts');
    }

  }, intervalTime);
})();
