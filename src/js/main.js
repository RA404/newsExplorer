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
import getDomNews from './utils/getDomNews';
import thisNewsExist from './utils/thisNewsExist';
import getNewsByUrl from './utils/getNewsByUrl';
import escape from './utils/escape';
import escapeDelete from './utils/escapeDelete';

// загрузим api конфигурации
import {
  apiKey,
  apiURL,
  apiLinkLogin,
  apiLinkSignup,
  apiLinkSignin,
  apiLinkSignout,
  apiLinkArticles
} from './config';
import AccountApi from './api/AccountApi';

// переменные страницы
let arrNews = []; // содержание массива будет часто меняться
let currentUser = {}; // изменяемая переменная, может быть записан, а может быть обнулен
var myNewsArr = []; // сохраненные карточки нужно видеть во всех областях видимости, тогда будем локально с ними работать и реже дергать сервер

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
const logoutHeaderButtons = document.querySelectorAll('.authorization-button__text_status_logged-out');
const loginImgs = document.querySelectorAll('.authorization-button__image');
const loginHeaderButtons = document.querySelectorAll('.authorization-button__text_status_logged-in');

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
const accountApi = new AccountApi();


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
      let promiseSignout = accountApi.signout(apiLinkSignout);
      promiseSignout
        .then((result) => {
          // если разлогинились занулим переменную currentUser
          currentUser = {};
          // перерисуем хэдэр
          header.setNonAuthorizedHeader('', logoutHeaderButtons, loginHeaderButtons, loginImgs, menuSavedArticles);

        })
        .catch((err) => {
          currentUser = {};
          // перерисуем хэдэр
          header.setNonAuthorizedHeader('', logoutHeaderButtons, loginHeaderButtons, loginImgs, menuSavedArticles);

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

  // получим пользователя с сервера
  const emailField = escape(document.forms.signupForm.elements.email.value);
  const passField = escape(document.forms.signupForm.elements.password.value);
  const nameField = escape(document.forms.signupForm.elements.name.value);

  // перед отправкой делаем поля недоступными
  document.forms.signupForm.elements.email.disabled = true;
  document.forms.signupForm.elements.password.disabled = true;
  document.forms.signupForm.elements.name.disabled = true;

  const newUser = accountApi.getNewUser(apiLinkSignup, emailField, passField, nameField);
  newUser
    .then((result) => {
      popupSignup.close();
      popupRegistered.open();
      // ответ от сервера пришел, можно заново вводить
      document.forms.signupForm.elements.email.disabled = false;
      document.forms.signupForm.elements.password.disabled = false;
      document.forms.signupForm.elements.name.disabled = false;
    })
    .catch((err) => {
      popupSignup.close();
      popupRegistered.close();
      popupError.setHeading(err);
      popupError.open();

      // ответ от сервера пришел, можно заново вводить
      document.forms.signupForm.elements.email.disabled = false;
      document.forms.signupForm.elements.password.disabled = false;
      document.forms.signupForm.elements.name.disabled = false;
    });

});
signinButton.addEventListener('click', () => {
  event.preventDefault();

  const emailField = escape(document.forms.loginForm.elements.email.value);
  const passField = escape(document.forms.loginForm.elements.password.value);

  // перед отправкой делаем поля недоступными
  document.forms.loginForm.elements.email.disabled = true;
  document.forms.loginForm.elements.password.disabled = true;

  //получим карточки с сервера
  const promiseToken = accountApi.getToken(apiLinkSignin, emailField, passField);
  promiseToken
    .then((result) => {

      // авторизацию прошли, токен получили, записали токен в куки

      //теперь нужно обратиться на users/me и показать наш токен, нам вернется имя пользователя
      const currentUserPromise = accountApi.getCurrentUser(apiLinkLogin);
      currentUserPromise
        .then((user) => {
          // console.log(user.data);
          currentUser.name = user.data.name;
          currentUser.email = user.data.email;
          currentUser._id = user.data._id;
          popupSignin.close();

          // ответ пришел, можно разблокировать поля
          document.forms.loginForm.elements.email.disabled = false;
          document.forms.loginForm.elements.password.disabled = false;

          // пулочим массив уже сохраненных карточек
          const myNewsArrPromise = newsCardList.getMyNews(apiLinkArticles);
          myNewsArrPromise
            .then((articles) => {
              articles.data.forEach((item) => {
                myNewsArr.push(item);
              })
            })
            .catch((err) => {
              console.log(err);
            })

          // перерисуем хэдэр
          header.setAuthorizedHeader(currentUser.name, logoutHeaderButtons, loginHeaderButtons, loginImgs, menuSavedArticles);

          //очистим карточки после логина мы не знаем какие у нас сохранены какие нет
          arrNews = [];
          // очистим секцию
          newsCardList.clear();
          showMoreButton.classList.add('button_hide');
          articlesDOM.classList.add('search-result__container_hidden');
        })
        .catch(() => {
          console.log("Не удалось прочитать токен! Проверьте не блокирует ли ваш браузер куки!");

          // ответ пришел, можно разблокировать поля
          document.forms.loginForm.elements.email.disabled = false;
          document.forms.loginForm.elements.password.disabled = false;
        })
    })
    .catch((err) => {
      popupSignin.close();
      popupError.setHeading(err);
      popupError.open();

      // ответ пришел, можно разблокировать поля
      document.forms.loginForm.elements.email.disabled = false;
      document.forms.loginForm.elements.password.disabled = false;
    });

});


// news handlers
// клик по кнопке найти
searchButton.addEventListener('click', () => {
  event.preventDefault();
  const searchStr = escapeDelete(searchString.value);
  if (searchStr.length > 0) {

    const listOfNews = newsApi.getNews(searchStr);
    listOfNews
      .then((result) => {
        if (result.articles.length > 0) {
          // Рендерим список карточек и показываем секцию с карточками
          arrNews = [];

          // подготовим полученный массив
          arrNews = newsCardList.setSavedAndShowedProp(result.articles, searchStr, myNewsArr);
          // очистим секцию и выведем результат
          newsCardList.clear();
          newsCardList.renderNews(arrNews, currentUser.name);
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
  }
});

// клик по кнопке показать еще
showMoreButton.addEventListener('click', () => {
  newsCardList.showMore(arrNews, currentUser.name);
});

// обработка кликов по списку карточек
newsContainerDom.addEventListener('click', () => {
  console.log(event);
  if (event.target.classList.contains('news-grid__flag')) {
    // кликнули во флажок тут 3 действия: открыть попап для входа; добавить новость; удалить новость
    if (!currentUser.name) {
      // не залогинены - открываем попап
      popupSignin.open();
    } else {
      // залогинены - проверим не сохранена ли карточка уже, если нет сохраняем, если да удаляем

      // получим DOM элемент карточку
      const newsDomElement = getDomNews(event.target);

      // получим DOM элемент флаг
      const newsDomFlag = event.target;

      // найдем ссылку на новость и проверим есть ли такая новость в уже сохраненных
      const urlNews = newsDomElement.querySelector('.news-grid__url');
      if (urlNews) {
        if (thisNewsExist(myNewsArr, urlNews.textContent)) {

          const elId = thisNewsExist(myNewsArr, urlNews.textContent);
          const delArticlesPromise = newsCardList.deleteNews(apiLinkArticles, elId);
          delArticlesPromise
            .then((deletedArticles) => {
              // раз с бэкенда удалили удалим из массива
              for (let i = myNewsArr.length - 1; i >= 0; i--) {
                if (myNewsArr[i]._id === elId) {
                  myNewsArr.splice(i, 1);
                }
              }

              // пришел успешный ответ с сервера, из массива удалили, снимем флаг в верстке
              newsDomFlag.classList.remove('news-grid__flag_type_marked');
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          // если нет то добавить (и на бэкенд и в массив)
          const arrItem = getNewsByUrl(arrNews, urlNews.textContent);
          if (arrItem) {
            // добавили новость
            const newCardPromise = newsCardList.addNews(apiLinkArticles, arrItem);
            newCardPromise
              .then((result) => {
                // успешно добавили на бэкенд, добавим в массив моих новостей
                // (не будем этот массив повторно дергать с сервера, один раз запросом получили массив своих новостей, дальше локально с ним работаем, лишний раз не дергаем сервер)
                myNewsArr.push(result.data);
                // поствим флаг при успешном ответе от сервера
                newsDomFlag.classList.add('news-grid__flag_type_marked');
              })
              .catch((err) => {
                console.log(err);
              })
          }
        }
      }
    }
  } else if (event.target.classList.contains('news-grid')) {
    // если кликнули просто в поле, то ничего не делаем, не тратим ресурсы
  } else {
    // получим DOM элемент
    const newsDomElement = getDomNews(event.target);
    // найдем ссылку на новость и откроем ее в новом окне
    const urlNews = newsDomElement.querySelector('.news-grid__url');
    if (urlNews) {
      window.open(urlNews.textContent);
    }
  }
});


// проверим, не залогинен ли пользователь
if (!currentUser.name) {
  // если в куках лежит не просроченный jwt ключ залогинимся
  const currentUserPromise = accountApi.getCurrentUser(apiLinkLogin);
  currentUserPromise
    .then((user) => {
      currentUser.name = user.data.name;
      currentUser.email = user.data.email;
      currentUser._id = user.data._id;

      // пулочим массив уже сохраненных карточек
      const myNewsArrPromise = newsCardList.getMyNews(apiLinkArticles);
      myNewsArrPromise
        .then((articles) => {
          articles.data.forEach((item) => {
            myNewsArr.push(item);
          })
        })
        .catch((err) => {
          console.log(err);
        })

      // перерисуем хэдэр
      header.setAuthorizedHeader(currentUser.name, logoutHeaderButtons, loginHeaderButtons, loginImgs, menuSavedArticles);
    })
    .catch((err) => {
      //в куках нет действующего ключа
      currentUser = {};
      // перерисуем хэдэр
      header.setNonAuthorizedHeader('', logoutHeaderButtons, loginHeaderButtons, loginImgs, menuSavedArticles);
    })
} else {
  // если пользователь залогинен, то получим его сохраненные карточки
  const myNewsArrPromise = newsCardList.getMyNews(apiLinkArticles);
  myNewsArrPromise
    .then((articles) => {
      articles.data.forEach((item) => {
        myNewsArr.push(item);
      })
    })
    .catch((err) => {
      console.log(err);
    })
}

window.addEventListener('keydown', function closeFormByKeydown(event) {
  if (event.keyCode === 27) {
    popupSignin.close();
    popupSignup.close();
    popupError.close();
    popupRegistered.close();
  }
});
