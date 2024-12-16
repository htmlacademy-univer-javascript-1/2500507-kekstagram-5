import {renderingThumbnails} from './pictures.js';
import { getData } from './api.js';
import { showingAlert } from './until.js';
import './upload-form.js';
import './gallery-filter.js';
const init = () => {
  getData()
    .then((photos) => {
      renderingThumbnails(photos); // данные с сервера
    })
    .catch((error) => {
      showingAlert(error.message); // Обработка ошибок
    });
};

init();
