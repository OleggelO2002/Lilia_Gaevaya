document.querySelectorAll('tr.training-row').forEach(row => {
  const imgUrl = row.dataset.trainingImage; // Берем URL из data-training-image
  if (imgUrl) {
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('training-image-wrapper');

    const img = document.createElement('img');
    img.src = window.location.protocol + imgUrl; // добавляем https:
    img.alt = 'training image';
    img.classList.add('training-image');

    imgWrapper.appendChild(img);
    row.insertBefore(imgWrapper, row.firstChild);
  }
});
