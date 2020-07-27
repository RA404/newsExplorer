import '../pages/newsPage/index.css';

// импортируем классы
import Header from './components/Header';

// импортируем вспомогательные функции
import getCurrentUser from './utils/auth/getCurrentUser';
import signout from './utils/auth/signout';

// загрузим api конфигурации
import {
  apiLinkLogin,
  apiLinkSignout
} from './config';

// переменные страницы
let currentUser = {};

// найдем элементы управления на странице
const logoutHeaderButton = document.querySelectorAll('.authorization-button__text_status_logged-out');
const loginImg = document.querySelectorAll('.authorization-button__image');
const loginHeaderButton = document.querySelectorAll('.authorization-button__text_status_logged-in');
const authorizationButtonsList = document.querySelectorAll('.authorization-button');

// найдем блоки и элементы на странице
const menuSavedArticles = document.querySelectorAll('.menu__item_saved_articles');

// создадим экземпляры классов
const header = new Header();

// authorization button
// клик по кнопке авторизация
authorizationButtonsList.forEach(function (item) {
  item.addEventListener('click', () => {
    event.preventDefault();
    if (!currentUser.name) {
      // если пользователь не залогинен, то мы не должны находиться на странице сохраненных статей
      // если разлогинились занулим переменную currentUser
      currentUser = {};
      // перерисуем хэдэр
      header.setNonAuthorizedHeader('', logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
      // сделаем редирект на главную
      document.location.href = '/';
      // перезагрузим страницу
      Locate.reload();
    } else {
      // если пользователь залогинен и его имя нам известно, то кнопка выполняет функцию signout
      let promiseSignout = signout(apiLinkSignout);
      promiseSignout
        .then((result) => {
          // если разлогинились занулим переменную currentUser
          currentUser = {};
          // перерисуем хэдэр
          header.setNonAuthorizedHeader('', logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
          // сделаем редирект на главную
          document.location.href = '/';
          // перезагрузим страницу
          Locate.reload();
        })
        .catch((err) => {
          currentUser = {};
          // перерисуем хэдэр
          header.setNonAuthorizedHeader('', logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
          // сделаем редирект на главную
          document.location.href = '/';
          // перезагрузим страницу
          Locate.reload();
        })
    }
  })
});


// проверим, не залогинен ли пользователь
if (!currentUser.name) {
  // если в куках лежит не просроченный jwt ключ залогинимся
  let currentUserPromise = getCurrentUser(apiLinkLogin);
  currentUserPromise
    .then((user) => {
      currentUser.name = user.data.name;
      currentUser.email = user.data.email;
      currentUser._id = user.data._id;
      // перерисуем хэдэр
      header.setAuthorizedHeader(currentUser.name, logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
    })
    .catch((err) => {
      //в куках нет действующего ключа
      currentUser = {};
      // перерисуем хэдэр
      header.setNonAuthorizedHeader('', logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
      // более того, мы не можем находиться на этой странице не залогинившись
      // сделаем редирект на главную
      document.location.href = '/';
      // перезагрузим страницу
      Locate.reload();
    })
}