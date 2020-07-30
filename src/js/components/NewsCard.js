export default class NewsCard {
  constructor() {

  }

  getTemplate(data, currentUser=false) {
    //описание может быть пустым, в таком случае подставляем контент
    const desc = data.description === null ? data.content : data.description;
    const classForFlag = data.elId ? 'news-grid__flag news-grid__flag_type_marked' : 'news-grid__flag';
    let hintField;
    if (currentUser) {
      hintField = 'Сохранить статью';
    } else {
      hintField = 'Войдите, чтобы сохранять статьи';
    }
    /*if (data.elId) {
      classForFlag = 'news-grid__flag news-grid__flag_type_marked';
    } else {
      classForFlag = 'news-grid__flag';
    }*/

    const timeOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC'
    };
    const dateString = new Date(data.publishedAt).toLocaleString("ru", timeOptions);

    const template = `
      <figure class="news-grid__item">
        <div class="news-grid__url">${data.url}</div>
        <div class="${classForFlag}"></div>
        <div class="news-grid__hint">${hintField}</div>
        <img class="news-grid__item-image" src="${data.urlToImage}">
        <figcaption class="news-grid__item-description">
          <p class="news-grid__date">${dateString}</p>
          <h3 class="content-title content-title_type_news-title">${data.title}</h3>
          <p class="news-grid__text">${desc}</p>
          <p class="news-grid__source">${data.source.name}</p>
        </figcaption>
      </figure>
    `;
    return template;
  }

  getTemplateSavedNews(data) {

    const timeOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC'
    };
    const dateString = new Date(data.date).toLocaleString("ru", timeOptions);

    const template = `
      <figure class="news-grid__item">
        <div class="news-grid__url">${data.link}</div>
        <div class="news-grid__keywords">${data.keyword}</div>
        <div class="news-grid__bin"></div>
        <div class="news-grid__hint">Убрать из сохраненных</div>
        <img class="news-grid__item-image" src="${data.image}">
        <figcaption class="news-grid__item-description">
          <p class="news-grid__date">${dateString}</p>
          <h3 class="content-title content-title_type_news-title">${data.title}</h3>
          <p class="news-grid__text">${data.text}</p>
          <p class="news-grid__source">${data.source}</p>
        </figcaption>
      </figure>
    `;
    return template;
  }
}