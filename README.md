# newsExplorer
Разработка фронтенда для проекта (news)

## Description
Сервис для поиска новостей по ключевым словам и сохранения понравившихся статей

## Version
v0.0.1

## How to use
###  Сборка
* Develop mode "npm run dev"
* Prodaction mode "npm run start" (и команда start и команда build собирает проект)
* Prodaction mode "npm run build" (и команда start и команда build собирает проект)
* Deploy to gh-pages "npm run deploy_gh"

#### Production version в папке dist
#### Development version в папке src

### Протестировать функциональность элементов верстки
* Кнопка авторизации

Чтобы получить кнопку неавторизованного пользователя нужно:
1. У тэгов "span" с классом "authorization-button__text_status_logged-out" (у стандартного меню и у "гамбургер меню") убрать класс "authorization-button_logout"
2. Тэгам "span" с классом "authorization-button__text_status_logged-in" (у стандартного меню и у "гамбургер меню") добавить класс "authorization-button_logout"
3. Тэгам "img" с классом "authorization-button__image" (у стандартного меню и у "гамбургер меню") добавить класс "authorization-button_logout"
* Скрыть пункт меню "Сохраненные статьи"

Нужно нужному элементу с классом menu__item добавить класс menu__item_status_logged-out
* Флажки на карточках

При наведении на флажок у карточки, появляется подсказка, что нужно авторизоваться для сохранения карточек. Флажок у средней карточки показан просто для примера, как будут выглядеть флажки у сохраненных карточек, по наведению на него ничего не появится.

На странице "сохраненные статьи" при наведении на значек "корзина" появляется подсакзака
* "Прелоудер"

Чтобы включить прелоудер нужно скрыть контейнер с карточками (класс search-result__container) добавив класс search-result__container_hidden, а у контейнера с прелоудером (класс search-result__container_type_preloader) наоборот удалить класс search-result__container_hidden 
* Секция "Ничего не найдено"

Чтобы включить прелоудер нужно скрыть контейнер с карточками (класс search-result__container) добавив класс search-result__container_hidden, а у контейнера "ничего не найдено" (класс search-result__container_type_not-found) наоборот удалить класс search-result__container_hidden 
* Показать или скрыть popup-ы

По умолчанию попапы скрыты, чтобы показать popup нужно элементу с классом "popup" добавить класс "popup_opened"
* Поменять активность кнопки у popup-а

Чтобы поменять активность у кнопки нужно у тега с классом popup__button удалить или добавить параметр "disabled" и класс "popup__button_type_disabled"
* Показать скрыть текст ошибки у popup-а

Если в попапе введены не валидные данные, то будет выводится ошибка, чтобы ее вывести необходимо тэгу span с классом "popup__error" добавить класс "popup__error_show"



