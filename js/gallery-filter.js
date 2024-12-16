import { renderingThumbnails } from './pictures.js';
import { getData } from './api.js';
import { showingAlert, debounce } from './until.js';

const DEBOUNCE_DELAY = 500;
const RANDOM_PICTURE_COUNT = 10;
const ACTIVE_FILTER_CLASS = 'img-filters__button--active';
const DEFAULT_FILTER_ID = 'filter-default';
const RANDOM_FILTER_ID = 'filter-random';
const DISCUSSED_FILTER_ID = 'filter-discussed';

const filterButtons = document.body.querySelectorAll('.img-filters__button');
let currentFilterId = DEFAULT_FILTER_ID;
let activeFilterButton = document.getElementById(DEFAULT_FILTER_ID);
// Функция для получения случайных изображений
const getRandomImages = (imageArray, count) => {
  if (imageArray.length <= count) {
    return imageArray.slice();
  }
  const remainingImages = imageArray.slice();
  const randomImages = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * remainingImages.length);
    randomImages.push(remainingImages[randomIndex]);
    remainingImages.splice(randomIndex, 1);
  }
  return randomImages;
};
// Функция для фильтрации изображений
const filterImages = (images) => {
  switch (currentFilterId) {
    case DEFAULT_FILTER_ID:
      return images;
    case DISCUSSED_FILTER_ID:
      return images.slice().sort((a, b) => b.comments.length - a.comments.length);
    case RANDOM_FILTER_ID:
      return getRandomImages(images, RANDOM_PICTURE_COUNT);
    default:
      return images;
  }
};

// Функция для обновления списка изображений
const updateImageDisplay = (images) => {
  const filteredImages = filterImages(images);
  document.querySelectorAll('.picture').forEach((pic) => pic.remove());
  renderingThumbnails(filteredImages);
};

// Обработчик кликов на кнопки фильтров
const filterButtonClickHandler = (callback) => (evt) => {
  currentFilterId = evt.target.id;
  activeFilterButton.classList.remove(ACTIVE_FILTER_CLASS);
  activeFilterButton = evt.target;
  activeFilterButton.classList.add(ACTIVE_FILTER_CLASS);
  callback();
};

// Инициализация
getData()
  .then((images) => {
    renderingThumbnails(images);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    const onFilterClick = filterButtonClickHandler(debounce(() => updateImageDisplay(images), DEBOUNCE_DELAY));
    filterButtons.forEach((filterButton) => filterButton.addEventListener('click', onFilterClick));
  })
  .catch((error) => showingAlert(error.message));
