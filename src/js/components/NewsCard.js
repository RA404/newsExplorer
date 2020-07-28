export default class NewsCard {
  constructor() {

  }

  getTemplate(data) {
    // поле хинт заполняем в зависимости от авторизации (позже не забыть)

    //описание может быть пустым, в таком случае подставляем контент
    const desc = data.description === null ? data.content : data.description;
    let classForFlag;
    if (data.elId) {
      classForFlag = 'news-grid__flag news-grid__flag_type_marked';
    } else {
      classForFlag = 'news-grid__flag';
    }

    const template = `
      <figure class="news-grid__item">
        <div class="news-grid__url">${data.url}</div>
        <div class="${classForFlag}"></div>
        <div class="news-grid__hint">Войдите, чтобы сохранять статьи</div>
        <img class="news-grid__item-image" src="${data.urlToImage}">
        <figcaption class="news-grid__item-description">
          <p class="news-grid__date">${data.publishedAt}</p>
          <h3 class="content-title content-title_type_news-title">${data.title}</h3>
          <p class="news-grid__text">${desc}</p>
          <p class="news-grid__source">${data.source.name}</p>
        </figcaption>
      </figure>
    `;
    return template;
  }

  getTemplateSavedNews(data) {
    // поле хинт заполняем в зависимости от авторизации (позже не забыть)

    //описание может быть пустым, в таком случае подставляем контент
    const desc = data.description === null ? data.content : data.description;

    const template = `
      <figure class="news-grid__item">
        <div class="news-grid__url">${data.url}</div>
        <div class="news-grid__keywords">${data.keyword}</div>
        <div class="news-grid__bin"></div>
        <div class="news-grid__hint">Убрать из сохраненных</div>
        <img class="news-grid__item-image" src="${data.keyword}">
        <figcaption class="news-grid__item-description">
          <p class="news-grid__date">${data.publishedAt}</p>
          <h3 class="content-title content-title_type_news-title">${data.title}</h3>
          <p class="news-grid__text">${desc}</p>
          <p class="news-grid__source">${data.source.name}</p>
        </figcaption>
      </figure>
    `;
    return template;
  }
}