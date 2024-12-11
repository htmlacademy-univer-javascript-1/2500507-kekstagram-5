import { initEffectSlider, updateEffect } from './imageEffects.js';
import { isEscape } from './until.js';
import { sendData } from './api.js';
const MAX_HASHTAGS = 5;
const HASHTAG_REGEX = /^#[A-Za-z0-9а-яё]{1,19}$/i;

const FORM_ERRORS = {
  DESCRIPTION_ERROR: 'Описание до 140 символов',
  COUNT_EXCEEDED: `Максимальное количество хэштегов — ${MAX_HASHTAGS}`,
  UNIQUE_HASTAGS: 'Хэш-теги повторяются',
  INCORRECT_HASHTAG: 'Некорректный хэштег'
};

const body = document.querySelector('body');
const uploadForm = document.querySelector('.img-upload__form');
const modalOverlay = uploadForm.querySelector('.img-upload__overlay');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const pristineValidator = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

// Отображение формы
const showForm = () => {
  modalOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', handleKeydown);
};

// Скрытие формы
const closeForm = () => {
  uploadForm.reset();
  pristineValidator.reset();
  modalOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleKeydown);
};

// Разделение хэштегов
const splitHashtags = (inputString) => inputString.trim().split(' ').filter((tag) => Boolean(tag.length));

// Проверка фокуса на полях ввода
const isInFocus = () => document.activeElement === hashtagInput || document.activeElement === descriptionInput;

// Валидация количества хэштегов
const validateHashtagCount = (value) => splitHashtags(value).length <= MAX_HASHTAGS;

// Валидация корректных хэштегов
const validateHashtags = (value) => splitHashtags(value).every((tag) => HASHTAG_REGEX.test(tag));

// Валидация уникальности хэштегов
const validateUniqueHashtags = (value) => {
  const hashtags = splitHashtags(value).map((tag) => tag.toLowerCase());
  return hashtags.length === new Set(hashtags).size;
};

// Обработка нажатия клавиш
function handleKeydown(event) {
  if (isEscape(event) && !isInFocus()) {
    event.preventDefault();
    closeForm();
  }
}

// Обработчик события на изменение поля
function handleInputChange(event) {
  if (event.target.files.length) {
    showForm();
  }
}

// Добавление валидаторов
pristineValidator.addValidator(hashtagInput, validateUniqueHashtags, FORM_ERRORS.UNIQUE_HASTAGS);
pristineValidator.addValidator(hashtagInput, validateHashtags, FORM_ERRORS.INCORRECT_HASHTAG);
pristineValidator.addValidator(hashtagInput, validateHashtagCount, FORM_ERRORS.COUNT_EXCEEDED);
pristineValidator.addValidator(descriptionInput, (value) => value.length <= 140, FORM_ERRORS.DESCRIPTION_ERROR);

// События
uploadForm.querySelector('.img-upload__input').addEventListener('change', handleInputChange);
uploadForm.querySelector('.img-upload__cancel').addEventListener('click', closeForm);

// Блокировка Esc при фокусе
document.addEventListener('keydown', (event) => {
  if (isEscape(event) && isInFocus()) {
    event.stopPropagation();
  }
});

// Инициализация слайдера для эффектов
initEffectSlider();

// Обработчик переключения эффектов
const effectRadios = document.querySelectorAll('.effects__radio');
effectRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    const selectedEffect = radio.value;
    updateEffect(selectedEffect);
  });
});
// Валидация хэштегов и описания
const validateForm = () => {
  const isValid = pristineValidator.validate();
  return isValid;
};

// Блокировка и разблокировка кнопки отправки
const blockSubmitButton = () => {
  const submitButton = uploadForm.querySelector('.img-upload__submit');
  submitButton.disabled = true;
};

const unblockSubmitButton = () => {
  const submitButton = uploadForm.querySelector('.img-upload__submit');
  submitButton.disabled = false;
};

// Отображение сообщения об успехе
const showSuccessMessage = () => {
  // Реализуйте функцию показа сообщения об успехе
};

// Отображение сообщения об ошибке
const showErrorMessage = () => {
  // Реализуйте функцию показа сообщения об ошибке
};

const setUserFormSubmit = (onSuccess) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (validateForm()) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          showSuccessMessage();
          onSuccess();
        })
        .catch(() => {
          showErrorMessage();
        })
        .finally(unblockSubmitButton);
    }
  });
};

// Ваши другие обработчики, такие как закрытие формы, валидация
uploadForm.querySelector('.img-upload__cancel').addEventListener('click', () => {
  // Код для закрытия формы
});

// Экспорт функции
export { setUserFormSubmit, closeForm };
