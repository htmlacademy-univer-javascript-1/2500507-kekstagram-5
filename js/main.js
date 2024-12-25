import {renderingThumbnails} from './pictures.js';
import { getData } from './api.js';
import { showingAlert } from './until.js';
import { setupUserFormSubmit, resetFormAndCloseModal } from'./upload-form.js';
import './gallery-filter.js';

getData()
  .then((photos) => {
    renderingThumbnails(photos);
  })
  .catch((error) => {
    showingAlert(error.message);
  });
setupUserFormSubmit(resetFormAndCloseModal);
