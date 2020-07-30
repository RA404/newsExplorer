import BaseComponent from '../baseComponents/BaseComponent';

export default class Header extends BaseComponent {

  constructor(...args) {
    super(...args);


  }

setAuthorizedHeader(userName, logoutButtons, loginButtons, loginImgs, menuSavedItems) {

  logoutButtons.forEach(element => {
    element.classList.add('authorization-button_logout');
  });

  loginButtons.forEach(element => {
    element.textContent = userName;
    element.classList.remove('authorization-button_logout');
  });

  loginImgs.forEach(element => {
    element.classList.remove('authorization-button_logout');
  });

  menuSavedItems.forEach(element => {
    element.classList.remove('menu__item_status_logged-out');
    element.classList.remove('hamburger-menu__item_status_logged-out');
  })

}

setNonAuthorizedHeader(userName, logoutButtons, loginButtons, loginImgs, menuSavedItems) {

  logoutButtons.forEach(element => {
    element.classList.remove('authorization-button_logout');
  });

  loginButtons.forEach(element => {
    element.textContent = 'Авторизоваться';
    element.classList.add('authorization-button_logout');
  });

  loginImgs.forEach(element => {
    element.classList.add('authorization-button_logout');
  });

  menuSavedItems.forEach(element => {
    element.classList.add('menu__item_status_logged-out');
    element.classList.add('hamburger-menu__item_status_logged-out');
  })

}

}