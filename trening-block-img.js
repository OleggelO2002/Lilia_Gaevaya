document.querySelectorAll('tr.training-row').forEach(row => {
  const imgUrl = row.dataset.trainingImage; // Берем URL из data-training-image
  if (imgUrl) {
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
