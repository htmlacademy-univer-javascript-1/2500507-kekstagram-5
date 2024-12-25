import {addEventListenerToScaleElemets, removeEventListenerFromScaleElemets, init, reset} from './imageEffects.js';
import {isEscape} from './until.js';
import {sendData} from './api.js';
import {showError, showSuccess} from './notification.js';

const MAX_HASHTAGS = 5;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const FORM_ERRORS = {
  COUNT_EXCEEDED: `Максимальное количество хэш-тегов — ${MAX_HASHTAGS}`,
  UNIQUE_HASTAGS: 'Хэш-теги повторяются',
  INCORRECT_HASHTAG: 'Некорректный хэш-тег. Хэш-тег начинается #, содержит только буквы и цифры'
};
const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const TEXT_SUBMIT = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...'
};
const body = document.body;
const uploadForm = document.querySelector('.img-upload__form');
const modalOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const uploadSubmit = document.querySelector('.img-upload__submit');
const uploadInput = document.querySelector('.img-upload__input');
const uploadPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');
const pristineValidator = new Pristine (uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const resetFormAndCloseModal = () => {
  uploadForm.reset();
  pristineValidator.reset();
  removeEventListenerFromScaleElemets();
  reset();
  modalOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleKeydown);
};

const isValidType = (file) => FILE_TYPES.some((it) => file.name.toLowerCase().endsWith(it));
const isInFocus = () => document.activeElement === hashtagInput || document.activeElement === descriptionInput;

const setupImagePreview = () => {
  const file = uploadInput.files[0];
  if (file && isValidType(file)) {
    uploadPreview.src = URL.createObjectURL(file);
    effectsPreviews.forEach((value) => {
      value.style.backgroundImage = `url('${uploadPreview.src}')`;
    });
  }
  addEventListenerToScaleElemets();
  init();
  modalOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', handleKeydown);
};

function handleKeydown(evt) {
  if (isEscape(evt) && !isInFocus()) {
    evt.preventDefault();
    resetFormAndCloseModal();
  }
}

const closeFormOnCancel = () => resetFormAndCloseModal();
const parseHashtagString = (tagString) => tagString.trim().split(/\s+/).filter((tag) => tag.length > 0);

const validateHashtags = (value) => {
  const tags = parseHashtagString(value);
  const isValidCount = tags.length <= MAX_HASHTAGS;
  const isValidTags = tags.every((tag) => HASHTAG_REGEX.test(tag));
  const isUniqueTags = tags.length === new Set(tags.map((tag) => tag.toLowerCase())).size;
  return { isValidCount, isValidTags, isUniqueTags };
};

const validateCorrectHashtag = (value) => {
  const { isValidCount, isValidTags, isUniqueTags } = validateHashtags(value);
  return isValidCount && isValidTags && isUniqueTags;
};

const validateHashtagInput = (value) => {
  const { isValidCount, isValidTags, isUniqueTags } = validateHashtags(value);
  if (!isValidTags) {
    return FORM_ERRORS.INCORRECT_HASHTAG;
  } else if (!isUniqueTags) {
    return FORM_ERRORS.UNIQUE_HASTAGS;
  } else if (!isValidCount) {
    return FORM_ERRORS.COUNT_EXCEEDED;
  }
  return true;
};

const toggleSubmitButton = (isDisabled, buttonText) => {
  uploadSubmit.disabled = isDisabled;
  uploadSubmit.textContent = buttonText;
};
const disableSubmitButton = () => {
  toggleSubmitButton(true, TEXT_SUBMIT.SENDING);
};
const enableSubmitButton = () => {
  toggleSubmitButton(false, TEXT_SUBMIT.IDLE);
};

const setupUserFormSubmit = (onSuccess) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristineValidator.validate()) {
      disableSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          showSuccess();
          onSuccess();
        })
        .catch(() => {
          showError();
        })
        .finally(enableSubmitButton);
    }
  });
};

pristineValidator.addValidator(hashtagInput, validateCorrectHashtag, validateHashtagInput);
uploadForm.addEventListener('change', setupImagePreview);
uploadCancel.addEventListener('click', closeFormOnCancel);
export { setupUserFormSubmit, resetFormAndCloseModal };
