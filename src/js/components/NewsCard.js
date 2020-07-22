export default class NewsCard {
  constructor() {

  }

  getTemplate(data) {
    // поле хинт заполняем в зависимости от авторизации (позже не забыть)

    //описание может быть пустым, в таком случае подставляем контент
    const desc = data.description === null ? data.content : data.description;

    const template = `
      <figure class="news-grid__item">
        <div class="news-grid__flag"></div>
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
}