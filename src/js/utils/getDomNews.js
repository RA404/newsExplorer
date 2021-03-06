export default function getDomNews(currentDom, maxIterations = 10) {
  // нужно получить DOM элемент карточку, чтобы с ней работать
  let cardDomElement = currentDom;
  let getElement = false;
  let i = 0; // чтобы не получить вечный цикл, ограничимся дополнительно количеством итераций
  do {
    i++;
    if (cardDomElement.classList.contains('news-grid__item')) {
      getElement = true;
    } else {
      cardDomElement = cardDomElement.parentNode;
    }
  } while (getElement === false && i < maxIterations);

  return cardDomElement;
}
