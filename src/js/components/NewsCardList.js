export default class NewsCardList {

  constructor(newsContainerDom, newsCard) {

    this.newsContainerDom = newsContainerDom;
    this.newsCard = newsCard;

  }

  renderNews(arr, currentUser = false, savedNewsTemplate = false, numberOfDisplayedCards = 3, newsContainerDom = this.newsContainerDom, newsCard = this.newsCard) {

    if (!savedNewsTemplate) {
      let i = 0;
      const lastItem = arr[arr.length - 1];
      let lastItemShowed = false;

      arr.forEach(function (item) {
        if (!item.showed && i < numberOfDisplayedCards) {
            newsContainerDom.insertAdjacentHTML('beforeend', newsCard.getTemplate(item, currentUser));
          i++;
          item.showed = true;
          if (item === lastItem) {
            // если последний элемент показан скроем кнопку "показать еще"
            lastItemShowed = true;
          }
        }
      });

      if (lastItemShowed) {
        this._toggleButtonVisibility(newsContainerDom.parentElement.querySelector('.button'));
      }
    } else {
      // сохраненные статьи просто выводим сколько есть
      arr.forEach(function (item) {
        newsContainerDom.insertAdjacentHTML('beforeend', newsCard.getTemplateSavedNews(item));
      });
    }

  }

  showMore(arr, currentUser = false) {
    this.renderNews(arr, currentUser);
  }

  setSavedAndShowedProp(arr, keyword, myArr) {

    arr.forEach(element => {
      element.showed = false;
      element.saved = false;
      element.keyword = keyword;
      myArr.forEach(item => {
        if (item.link == element.url) {
          element.elId = item._id;
        }
      })
    });
    return arr;
  }

  clear(newsContainerDom = this.newsContainerDom) {
    const items = newsContainerDom.querySelectorAll('.news-grid__item');
    items.forEach(function(item) {
      newsContainerDom.removeChild(item);
    });
  }

  getMyNews(apiLinkArticles) {
    return new Promise(function (resolve, reject) {

      fetch(apiLinkArticles,
        {
          credentials: 'include',
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          //если ошибка, переходим в catch
          return reject(`Ошибка: ${res.status} ${res.statusText}`);
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });

    });
  }

  addNews(apiLinkArticles, arrItem) {
    return new Promise(function (resolve, reject) {

      const itemContent = (arrItem.description === null || arrItem.description === "") ? arrItem.content : arrItem.description;

      fetch(apiLinkArticles,
        {
          method: 'POST',
          body: JSON.stringify({
            title: arrItem.title,
            text: itemContent,
            keyword: arrItem.keyword,
            date: arrItem.publishedAt,
            source: arrItem.source.name,
            link: arrItem.url,
            image: arrItem.urlToImage,
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          //если ошибка, переходим в catch
          reject(`Ошибка: ${res.status} ${res.statusText}`);

        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deleteNews(apiLinkArticles, idNews) {
    return new Promise(function (resolve, reject) {

      const linkWithId = apiLinkArticles + '/' + idNews;

      fetch(linkWithId,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          //если ошибка, переходим в catch
          reject(`Ошибка: ${res.status} ${res.statusText}`);

        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  _toggleButtonVisibility(buttonDom) {
    buttonDom.classList.toggle('button_hide');
  }

}