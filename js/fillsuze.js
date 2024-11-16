const bigPictureElement = document.querySelector('.big-picture');
const bodyElement = document.body;
const renderingBigPicture = ({url, likes, comments, description}) => {
  bigPictureElement.querySelector('.big-picture__img').src = url;
  bigPictureElement.querySelector('.likes-count').textContent = likes;
  bigPictureElement.querySelector('.comments-count').textContent = comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = description;

  // Обновление комментариев
  const commentsContainer = bigPictureElement.querySelector('.social__comments');
  commentsContainer.innerHTML = '';
  comments.forEach(({avatar, name, message }) => {
    const commentElement = document.createElement('li');
    commentElement.className = 'social__picture';
    commentElement.innerHTML = `<img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
            <p class="social__text">${message}</p>`;
    commentsContainer.append(commentElement);
  });
  // Открыть окно
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  // Скрываем дополнительные элементы
  bigPictureElement.querySelector('.social__comment-count').classList.add('hidden');
  bigPictureElement.querySelector('.comments-loader').classList.add('hidden');
};
// Функция для закрытия окна
const closeBigPicture = () =>{
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
};
// Обработчики событий
bigPictureElement.querySelector('.big-picture__cancel').addEventListener('click', closeBigPicture);
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
});
export const openBigPicture = (photo) => {
  renderingBigPicture(photo);
};
