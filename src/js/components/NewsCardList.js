export default class NewsCardList {

  constructor(newsContainerDom, newsCard) {

    this.newsContainerDom = newsContainerDom;
    this.newsCard = newsCard;

  }

  renderNews(arr, newsContainerDom = this.newsContainerDom, newsCard = this.newsCard) {

    let i = 0;
    const lastItem = arr[arr.length - 1];
    let lastItemShowed = false;

    arr.forEach(function (item) {
      if (!item.showed && i < 3) {
        newsContainerDom.insertAdjacentHTML('beforeend', newsCard.getTemplate(item));
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

  }

  showMore(arr) {
    this.renderNews(arr);
  }

  setSavedAndShowedProp(arr, keyword) {

    arr.forEach(element => {
      element.showed = false;
      element.saved = false;
      element.keyword = keyword;
    });
    return arr;
  }

  clear(newsContainerDom = this.newsContainerDom) {
    const items = newsContainerDom.querySelectorAll('.news-grid__item');
    items.forEach(function(item) {
      newsContainerDom.removeChild(item)
    });
  }

  _toggleButtonVisibility(buttonDom) {
    buttonDom.classList.toggle('button_hide');
  }

}