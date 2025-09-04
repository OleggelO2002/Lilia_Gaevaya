// Глобальные переменные для проверки типа платформы
let appCheckComplete = false;
let isAppResult = false;

// HTML-шаблоны для поиска
const searchContainerHTMLMobileTemplate = `
  <div id="searchContainerMobile" style="position: relative; z-index: 1000; display: flex; align-items: center; background-color: white; border-radius: 20px; overflow: hidden; width: {{width}}; transition: width 0.3s ease;">
    <img src="https://static.tildacdn.info/tild3764-3665-4662-b664-373066626139/Search_Magnifying_Gl.svg" alt="Search" style="width: 20px; height: 20px; margin: 10px; cursor: pointer;">
    <input type="text" id="searchInputMobile" placeholder="Введите название тренинга или урока" style="border: none; outline: none; flex-grow: 1; padding: 5px; display: {{inputDisplay}};">
    <div id="searchResultsMobile" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: white; border: 1px solid #ccc; border-radius: 5px; max-height: 200px; overflow-y: auto; z-index: 1001;"></div>
  </div>
`;

const searchWrapperHTMLDesktop = `
  <div id="searchWrapper" style="width: 100%; background-color: #f8f8f8; padding: 10px; box-sizing: border-box;"></div>
`;

const searchContainerHTMLDesktop = `
  <div id="searchContainer" style="position: relative; z-index: 1000; display: flex; align-items: center; background-color: white; border-radius: 20px; padding: 0 10px;">
    <img src="https://static.tildacdn.info/tild3764-3665-4662-b664-373066626139/Search_Magnifying_Gl.svg" alt="Search" style="width: 20px; height: 20px; margin-right: 10px;">
    <input type="text" id="searchInput" placeholder="Введите название тренинга или урока" style="border: none; outline: none; flex-grow: 1;">
    <div id="searchResults" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: white; border: 1px solid #ccc; border-radius: 5px; max-height: 200px; overflow-y: auto; z-index: 1001;"></div>
  </div>
`;

// Функция для генерации HTML мобильного поиска
function getSearchContainerHTMLMobile(isApp) {
  return searchContainerHTMLMobileTemplate
    .replace('{{width}}', isApp ? '72vw' : '40px')
    .replace('{{inputDisplay}}', isApp ? 'block' : 'none');
}

// ======= Функции для определения типа платформы =======
function checkIsApp(callback) {
  if (appCheckComplete) {
    callback(isAppResult);
    return;
  }

  let attempts = 0;
  const maxAttempts = 20;
  const interval = setInterval(() => {
    attempts++;
    const leftBar = document.querySelector('.gc-account-leftbar');
    const xdgetRoot = document.querySelector('div.xdget-root');
    
    if (leftBar) {
      clearInterval(interval);
      appCheckComplete = true;
      isAppResult = false;
      callback(false);
    }
    else if (xdgetRoot) {
      clearInterval(interval);
      appCheckComplete = true;
      isAppResult = true;
      callback(true);
    }
    else if (attempts >= maxAttempts) {
      clearInterval(interval);
      appCheckComplete = true;
      isAppResult = false;
      callback(false);
    }
  }, 100);
}

function isApp(callback) {
  checkIsApp(callback);
}

// ======= Функция для добавления поиска =======
function addSearchContainer() {
  const isMobile = window.innerWidth <= 768;
  const isTrainingPage = window.location.href.includes('/teach/control/stream/view/id/');
  const isLessonPage = window.location.href.includes('/pl/teach/control/lesson/view/');

  if (isMobile) {
    isApp(function(isApp) {
      const html = getSearchContainerHTMLMobile(isApp);
      
      if (isApp) {
        // Для приложения - вставляем в xdget-root
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
          attempts++;
          const xdgetRoot = document.querySelector('div.xdget-root');

          if (xdgetRoot) {
            clearInterval(interval);
            if (!xdgetRoot.querySelector('#searchContainerMobile')) {
              xdgetRoot.insertAdjacentHTML('afterbegin', html);
              setupMobileSearchHandlers(true);
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            if (!document.querySelector('#searchContainerMobile')) {
              document.body.insertAdjacentHTML('afterbegin', html);
              setupMobileSearchHandlers(true);
            }
          }
        }, 100);
      } else {
        // Для мобильного браузера - вставляем в левую панель
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
          attempts++;
          const leftBar = document.querySelector('.gc-account-leftbar');

          if (leftBar) {
            clearInterval(interval);
            if (!leftBar.querySelector('#searchContainerMobile')) {
              leftBar.insertAdjacentHTML('afterbegin', html);
              setupMobileSearchHandlers(false);
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
      }
    });
  } else {
    // Десктопная версия
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;
      const breadcrumbs = document.querySelector('.breadcrumbs, .empty-breadcrumbs');
      const mainContentUser = document.querySelector('.gc-main-content.gc-both-main-content.no-menu.account-page-content.with-left-menu.gc-user-logined.gc-user-user');
      const mainContentAdmin = document.querySelector('.gc-main-content.gc-both-main-content.wide.account-page-content.with-left-menu.gc-user-logined.gc-user-admin');
      const targetMainContent = mainContentUser || mainContentAdmin;

      if (targetMainContent) {
        clearInterval(interval);
        if (!document.querySelector('#searchWrapper')) {
          targetMainContent.insertAdjacentHTML('afterbegin', searchWrapperHTMLDesktop);
          if (breadcrumbs) {
            breadcrumbs.insertAdjacentHTML('afterbegin', searchContainerHTMLDesktop);
          }
          setupDesktopSearchHandlers();
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }
}

// ======= Обработчики для мобильного поиска =======
function setupMobileSearchHandlers(isApp) {
  const searchContainer = document.getElementById('searchContainerMobile');
  const searchInput = document.getElementById('searchInputMobile');
  const searchIcon = searchContainer.querySelector('img');
  const searchResults = document.getElementById('searchResultsMobile');

  if (!isApp) {
    // Для браузера - добавляем обработчик клика по иконке
    searchIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      const isExpanded = searchContainer.style.width === '72vw';
      searchContainer.style.width = isExpanded ? '40px' : '72vw';
      searchInput.style.display = isExpanded ? 'none' : 'block';
      searchResults.style.display = 'none';
      if (!isExpanded) searchInput.focus();
    });

    document.addEventListener('click', (event) => {
      if (!searchContainer.contains(event.target)) {
        searchContainer.style.width = '40px';
        searchInput.style.display = 'none';
        searchResults.style.display = 'none';
      }
    });
  } else {
    // Для приложения - сразу фокусируемся на поле ввода
    setTimeout(() => {
      searchInput.focus();
    }, 300);
  }

  searchInput.addEventListener('input', () => {
    searchResults.style.display = 'block';
    searchResults.innerHTML = `<p>Результаты для "${searchInput.value}"</p>`;
  });
}

// ======= Обработчики для десктопного поиска =======
function setupDesktopSearchHandlers() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchResults.style.display = 'block';
      searchResults.innerHTML = `<p>Результаты для "${searchInput.value}"</p>`;
    });
  }
}

// ======= Основная логика поиска =======
$(document).ready(function () {
  let typingTimer;
  const typingDelay = 1000;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getData(searchStr, callback) {
    $.getJSON('/c/sa/search', { searchStr }, function (response) {
      if (response.success === true && Array.isArray(response.data.blocks)) {
        const results = response.data.blocks
          .filter(block => block.onClick?.url)
          .map(function (block) {
            const domain = window.location.origin;
            const fullUrl = domain + block.onClick.url;
            const isLesson = fullUrl.includes('lesson');
            return {
              isLesson,
              title: block.title || "Без названия",
              description: block.description || "Нет описания",
              image: block.logo?.image || null,
              url: fullUrl
            };
          });
        callback(results);
      } else {
        callback([]);
      }
    });
  }

  function renderResults(results, searchResults) {
    if (results.length > 0) {
      const lessons = results.filter(result => result.isLesson);
      const trainings = results.filter(result => !result.isLesson);

      let resultItems = '';

      if (trainings.length > 0) {
        resultItems += '<h2>Тренинги</h2>';
        resultItems += trainings.map(result => `
          <div class="result-item training-item">
            ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}">Перейти к тренингу</a>
          </div>
        `).join('');
      }

      if (lessons.length > 0) {
        resultItems += '<h2>Уроки</h2>';
        resultItems += lessons.map(result => `
          <div class="result-item lesson-item">
            ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}">Перейти к уроку</a>
          </div>
        `).join('');
      }

      searchResults.innerHTML = resultItems;
      searchResults.style.display = 'block';
    } else {
      searchResults.innerHTML = '<p>Результаты не найдены</p>';
      searchResults.style.display = 'block';
    }
  }

  function onSearchInput(inputElement, searchResultsElement) {
    const query = inputElement.value.trim();
    if (query.length < 2) {
      searchResultsElement.style.display = 'none';
      return;
    }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      getData(query, function (results) {
        renderResults(results, searchResultsElement);
      });
    }, typingDelay);
  }

  function initSearchHandlers() {
    if (isMobile()) {
      const inputMobile = document.getElementById('searchInputMobile');
      const resultsMobile = document.getElementById('searchResultsMobile');
      if (inputMobile && resultsMobile) {
        inputMobile.addEventListener('input', () => onSearchInput(inputMobile, resultsMobile));
      }
    } else {
      const inputDesktop = document.getElementById('searchInput');
      const resultsDesktop = document.getElementById('searchResults');
      if (inputDesktop && resultsDesktop) {
        inputDesktop.addEventListener('input', () => onSearchInput(inputDesktop, resultsDesktop));
      }
    }
  }

  // Запуск
  addSearchContainer();

  // Инициализация обработчиков после загрузки
  setTimeout(() => {
    initSearchHandlers();
  }, 1500);
});
