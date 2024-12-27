import {renderThumbnails} from './pictures.js';
import { getData } from './api.js';
import { showAlert } from './until.js';
import { onSetupUserFormSubmit, resetFormAndCloseModal } from'./upload-form.js';
import './gallery-filter.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);
  })
  .catch((error) => {
    showAlert(error.message);
  });
onSetupUserFormSubmit(resetFormAndCloseModal);
