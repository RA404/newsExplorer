export default class NewsApi {

  constructor (articlesDOM, articlesNotFoundDOM, articlesPreloaderDOM, apiKey, apiURL) {
    this.articlesDOM = articlesDOM;
    this.articlesNotFoundDOM = articlesNotFoundDOM;
    this.articlesPreloaderDOM = articlesPreloaderDOM;
    this.apiKey = apiKey;
    this.apiURL = apiURL;

    this._hide = this._hide.bind(this);
    this._show = this._show.bind(this);
  }

  getNews(querystrung) {

    this._show(this.articlesPreloaderDOM);
    this._hide(this.articlesNotFoundDOM);
    this._hide(this.articlesDOM);

    // получим текущую дату и дату 7 дней назад
    const dateToday = new Date();
    const datePastWeek = new Date();
    datePastWeek.setDate(datePastWeek.getDate() - 7);

    const apiLink = `${this.apiURL}?q="${querystrung}"&from=${dateToday}&to=${datePastWeek}&apiKey=${this.apiKey}`;

    return new Promise(function(resolve, reject) {

      fetch(apiLink)
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

  _show(DOMElement) {
    DOMElement.classList.remove('search-result__container_hidden');
  }

  _hide(DOMElement) {
    DOMElement.classList.add('search-result__container_hidden');
  }

  showArticlesSection(articlesDOM = this.articlesDOM, articlesNotFoundDOM = this.articlesNotFoundDOM, articlesPreloaderDOM = this.articlesPreloaderDOM) {
    this._hide(articlesPreloaderDOM);
    this._hide(articlesNotFoundDOM);
    this._show(articlesDOM);
  }

  showArticlesNotFound(articlesDOM = this.articlesDOM, articlesNotFoundDOM = this.articlesNotFoundDOM, articlesPreloaderDOM = this.articlesPreloaderDOM) {
    this._hide(articlesPreloaderDOM);
    this._show(articlesNotFoundDOM);
    this._hide(articlesDOM);
  }

  showArticlesError(articlesDOM = this.articlesDOM, articlesNotFoundDOM = this.articlesNotFoundDOM, articlesPreloaderDOM = this.articlesPreloaderDOM) {
    this._hide(articlesPreloaderDOM);
    this._hide(articlesNotFoundDOM);
    this._hide(articlesDOM);
  }

}