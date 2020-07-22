// импортируем стили
import '../pages/mainPage/index.css';

// импортируем классы
import NewsApi from './api/NewsApi';
import NewsCard from './components/NewsCard';
import NewsCardList from './components/NewsCardList';
import Overlay from './components/Overlay';
import Popup from './components/Popup';
import Form from './components/Form';

// пропишем константы
const apiKey = "72247f4ab53b48cf97e40059a80e1d5d";
const apiURL = "https://praktikum.tk/news/v2/everything";
let arrNews = [];

// найдем элементы управления на странице
const authorizationButtonsList = document.querySelectorAll('.authorization-button');
const searchButton = document.querySelector('.search__search-button');
const searchString = document.querySelector('.search__search-string');
const mobileMenuToggler = document.querySelector('.hamburger-menu__toggle');
const showMoreButton = document.querySelector('.button');

// найдем блоки и элементы на странице
const articlesDOM = document.querySelector('.search-result__container');
const articlesNotFoundDOM = document.querySelector('.search-result__container_type_not-found');
const articlesPreloaderDOM = document.querySelector('.search-result__container_type_preloader');
const newsContainerDom = document.querySelector('.news-grid');

// создаем экземпляры классов
const newsCard = new NewsCard();
const registerForm = new Form();
const newsCardList = new NewsCardList(newsContainerDom, newsCard);
const popupSignin = new Popup(
  document.querySelector('.popup'),
  {
    Overlay: Overlay,
  }
);
const popupError = new Popup(
  document.querySelector('.popup_error'),
  {
    Overlay: Overlay,
  }
);
const newsApi = new NewsApi(articlesDOM, articlesNotFoundDOM, articlesPreloaderDOM, apiKey, apiURL);

// вешаем обработчики событий

// клик по кнопке авторизация
authorizationButtonsList.forEach(function (item) {
  item.addEventListener('click', () => {
    event.preventDefault();
    popupSignin.open();
    mobileMenuToggler.checked = false;
  })
});

// клик по кнопке найти
searchButton.addEventListener('click', () => {
  event.preventDefault();
  let listOfNews = newsApi.getNews(searchString.value);
  listOfNews
    .then((result) => {
      if (result.articles.length > 0) {
        // Рендерим список карточек и показываем секцию с карточками
        arrNews = [];
        arrNews = newsCardList.setSavedAndShowedProp(result.articles);
        newsCardList.clear();
        newsCardList.renderNews(arrNews);
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
