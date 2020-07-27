// импортируем стили
import '../pages/mainPage/index.css';

// импортируем классы
import NewsApi from './api/NewsApi';
import NewsCard from './components/NewsCard';
import NewsCardList from './components/NewsCardList';
import Overlay from './components/Overlay';
import Popup from './components/Popup';
import FormValidator from './components/FormValidator';
import Header from './components/Header';

// импортируем вспомогательные функции
import signout from './utils/auth/signout';
import getToken from './utils/auth/getToken';
import getCurrentUser from './utils/auth/getCurrentUser';
import getNewUser from './utils/auth/getNewUser';

// загрузим api конфигурации
import {
  apiKey,
  apiURL,
  apiLinkLogin,
  apiLinkSignup,
  apiLinkSignin,
  apiLinkSignout
} from './config';

// переменные страницы
let arrNews = [];
let currentUser = {};

// найдем элементы управления на странице
const authorizationButtonsList = document.querySelectorAll('.authorization-button');
const searchButton = document.querySelector('.search__search-button');
const searchString = document.querySelector('.search__search-string');
const mobileMenuToggler = document.querySelector('.hamburger-menu__toggle');
const showMoreButton = document.querySelector('.button');
const openSignupPopupLink = document.forms.loginForm.elements.openSignupPopupLink;
const openLoginPopupLink = document.forms.signupForm.elements.openLoginPopupLink;
const signupButton = document.forms.signupForm.elements.signupButton;
const loginLink = document.forms.registeredForm.elements.loginLink;
const signinButton = document.forms.loginForm.elements.loginButton;
const logoutHeaderButton = document.querySelectorAll('.authorization-button__text_status_logged-out');
const loginImg = document.querySelectorAll('.authorization-button__image');
const loginHeaderButton = document.querySelectorAll('.authorization-button__text_status_logged-in');

// найдем блоки и элементы на странице
const articlesDOM = document.querySelector('.search-result__container');
const articlesNotFoundDOM = document.querySelector('.search-result__container_type_not-found');
const articlesPreloaderDOM = document.querySelector('.search-result__container_type_preloader');
const newsContainerDom = document.querySelector('.news-grid');
const menuSavedArticles = document.querySelectorAll('.menu__item_saved_articles');

// создаем экземпляры классов
const newsCard = new NewsCard();
const newsCardList = new NewsCardList(newsContainerDom, newsCard);
const popupSignin = new Popup(
  document.querySelector('.popup'),
  document.forms.loginForm,
  {
    Overlay: Overlay,
    FormValidator: FormValidator,
  },
);
const popupSignup = new Popup(
  document.querySelector('.popup_signup'),
  document.forms.signupForm,
  {
    Overlay: Overlay,
    FormValidator: FormValidator,
  },
);
const popupRegistered = new Popup(
  document.querySelector('.popup_successful-registered'),
  document.forms.registeredForm,
  {
    Overlay: Overlay,
  },
);
const popupError = new Popup(
  document.querySelector('.popup_error'),
  document.forms.errorForm,
  {
    Overlay: Overlay,
  }
);
const newsApi = new NewsApi(articlesDOM, articlesNotFoundDOM, articlesPreloaderDOM, apiKey, apiURL);
const header = new Header();


// authorization button
// клик по кнопке авторизация
authorizationButtonsList.forEach(function (item) {
  item.addEventListener('click', () => {
    event.preventDefault();
    if (!currentUser.name) {
      // если пользователь не залогинен, то мы не знаем его имя, кнопка выполняет функцию signin
      popupSignin.open();
      mobileMenuToggler.checked = false;
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
          console.log(err);
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


// popup handlers
// кнопки в формах, для переключения попапов
openLoginPopupLink.addEventListener('click', () => {
  event.preventDefault();
  popupSignin.open();
});
openSignupPopupLink.addEventListener('click', () => {
  event.preventDefault();
  popupSignup.open();
});
loginLink.addEventListener('click', () => {
  event.preventDefault();
  popupSignin.open();
  popupRegistered.close();
});
signupButton.addEventListener('click', () => {

  event.preventDefault();

  //получим пользователя с сервера
  const emailField = document.forms.signupForm.elements.email.value;
  const passField = document.forms.signupForm.elements.password.value;
  const nameField = document.forms.signupForm.elements.name.value;

  let newUser = getNewUser(apiLinkSignup, emailField, passField, nameField);
  newUser
    .then((result) => {
      popupSignup.close();
      popupRegistered.open();
    })
    .catch((err) => {
      popupSignup.close();
      popupRegistered.close();
      popupError.setHeading(err);
      popupError.open();
    });

});
signinButton.addEventListener('click', () => {
  event.preventDefault();

  const emailField = document.forms.loginForm.elements.email.value;
  const passField = document.forms.loginForm.elements.password.value;

  //получим карточки с сервера
  let promiseToken = getToken(apiLinkSignin, emailField, passField);
  promiseToken
    .then((result) => {

      // авторизацию прошли, токен получили, записали токен в куки

      //теперь нужно обратиться на users/me и показать наш токен, нам вернется имя пользователя
      let currentUserPromise = getCurrentUser(apiLinkLogin);
      currentUserPromise
        .then((user) => {
          // console.log(user.data);
          currentUser.name = user.data.name;
          currentUser.email = user.data.email;
          currentUser._id = user.data._id;
          popupSignin.close();
          // перерисуем хэдэр
          header.setAuthorizedHeader(currentUser.name, logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
        })
        .catch(() => {
          console.log("Не удалось прочитать токен! Проверьте не блокирует ли ваш браузер куки!");
        })
    })
    .catch((err) => {
      console.log(err);
    });

});


// news handlers
// клик по кнопке найти
searchButton.addEventListener('click', () => {
  event.preventDefault();
  let listOfNews = newsApi.getNews(searchString.value);
  listOfNews
    .then((result) => {
      if (result.articles.length > 0) {
        // Рендерим список карточек и показываем секцию с карточками
        arrNews = [];
        arrNews = newsCardList.setSavedAndShowedProp(result.articles, searchString.value);
        newsCardList.clear();
        newsCardList.renderNews(arrNews);
        if (arrNews.length > 3) {
          showMoreButton.classList.remove('button_hide');
        }
        newsApi.showArticlesSection();
      } else {
        // выведем блок ничего не найдено
        newsApi.showArticlesNotFound();
      }
    })
    .catch((err) => {
      // выведем блок ничего не найдено, с текстом ошибки
      newsApi.showArticlesError();
      popupError.setHeading(err);
      popupError.open();
    });
});

// клик по кнопке показать еще
showMoreButton.addEventListener('click', () => {
  newsCardList.showMore(arrNews);
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
    })
}
