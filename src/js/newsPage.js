import '../pages/newsPage/index.css';

// импортируем классы
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import NewsCardList from './components/NewsCardList';
import AccountApi from './api/AccountApi';

// импортируем вспомогательные функции
import getKeywordsString from './utils/getKeywordsString';
import getDomNews from './utils/getDomNews';
import thisNewsExist from './utils/thisNewsExist';

// загрузим api конфигурации
import {
  apiLinkLogin,
  apiLinkSignout,
  apiLinkArticles
} from './config';

// переменные страницы
let currentUser = {};
var myNewsArr = []; // сохраненные карточки нужно видеть во всех областях видимости, тогда будем локально с ними работать и реже дергать сервер

// найдем элементы управления на странице
const logoutHeaderButton = document.querySelectorAll('.authorization-button__text_status_logged-out');
const loginImg = document.querySelectorAll('.authorization-button__image');
const loginHeaderButton = document.querySelectorAll('.authorization-button__text_status_logged-in');
const authorizationButtonsList = document.querySelectorAll('.authorization-button');

// найдем блоки и элементы на странице
const menuSavedArticles = document.querySelectorAll('.menu__item_saved_articles');
const titleContainer = document.querySelector('.content-title_type_saved-news');
const subtitleContainer = document.querySelector('.content-paragraph_type_article');
const newsContainerDom = document.querySelector('.news-grid');

// создадим экземпляры классов
const header = new Header();
const newsCard = new NewsCard();
const newsCardList = new NewsCardList(newsContainerDom, newsCard);
const accountApi = new AccountApi();

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
      let promiseSignout = accountApi.signout(apiLinkSignout);
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

// обработка кликов по списку карточек
newsContainerDom.addEventListener('click', () => {
  console.log(event);
  if (event.target.classList.contains('news-grid__bin')) {
    // кликнули прямо на корзину, удаляем карточку и с бэкенда и из дом элемента и из массива

    // получим DOM элемент карточку
    let newsDomElement = getDomNews(event.target);

    // найдем ссылку на новость и проверим есть ли такая новость в уже сохраненных
    const urlNews = newsDomElement.querySelector('.news-grid__url');
    if (urlNews) {
      let elId = thisNewsExist(myNewsArr, urlNews.textContent);
      let delArticlesPromise = newsCardList.deleteNews(apiLinkArticles, elId);
      delArticlesPromise
        .then((deletedArticles) => {

          // раз с бэкенда удалили удалим из массива
          for (let i = myNewsArr.length - 1; i >= 0; i--) {
            if (myNewsArr[i]._id === elId) {
              myNewsArr.splice(i, 1);
            }
          }

          // удаляем из DOM
          newsContainerDom.removeChild(newsDomElement);

          // перерисуем описание в секции summary-title
          titleContainer.textContent = `${currentUser.name}, у вас ${myNewsArr.length} сохраненных статей`;
          let keywordsList = [];
          myNewsArr.forEach((item) => {
            keywordsList.push(item.keyword);
          })
          let keywordsString = getKeywordsString(keywordsList);
          subtitleContainer.textContent = keywordsString;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  } else if (event.target.classList.contains('news-grid')) {
    // если кликнули просто в поле, то ничего не делаем, не тратим ресурсы
  } else {
    // получим DOM элемент
    let newsDomElement = getDomNews(event.target);
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
  let currentUserPromise = accountApi.getCurrentUser(apiLinkLogin);
  currentUserPromise
    .then((user) => {
      currentUser.name = user.data.name;
      currentUser.email = user.data.email;
      currentUser._id = user.data._id;

      // пулочим массив уже сохраненных карточек
      let myNewsArrPromise = newsCardList.getMyNews(apiLinkArticles);
      myNewsArrPromise
        .then((articles) => {
          myNewsArr = [];
          let keywordsList = [];
          articles.data.forEach((item) => {
            myNewsArr.push(item);
            keywordsList.push(item.keyword);
          })

          titleContainer.textContent = `${currentUser.name}, у вас ${myNewsArr.length} сохраненных статей`;
          let keywordsString = getKeywordsString(keywordsList);
          subtitleContainer.textContent = keywordsString;

          // очистим секцию и выведем результат
          newsCardList.clear();
          newsCardList.renderNews(myNewsArr, false, true);
        })
        .catch((err) => {
          console.log(err);
        })

      // перерисуем хэдэр
      header.setAuthorizedHeader(currentUser.name, logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
    })
    .catch((err) => {
      //в куках нет действующего ключа
      currentUser = {};
      // перерисуем хэдэр
      header.setNonAuthorizedHeader('', logoutHeaderButton, loginHeaderButton, loginImg, menuSavedArticles);
      titleContainer.textContent = '';
    })
} else {
  // если пользователь залогинен, то получим его сохраненные карточки
  let myNewsArrPromise = newsCardList.getMyNews(apiLinkArticles);
  myNewsArrPromise
    .then((articles) => {
      myNewsArr = [];
      articles.data.forEach((item) => {
        myNewsArr.push(item);
      })
    })
    .catch((err) => {
      console.log(err);
    })
}