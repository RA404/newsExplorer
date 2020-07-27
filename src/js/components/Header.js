import BaseComponent from '../baseComponents/BaseComponent';

export default class Header extends BaseComponent {

  constructor(...args) {
    super(...args);


  }

setAuthorizedHeader(userName, logoutButton, loginButton, loginImg, menuSavedItems) {

  logoutButton.forEach(element => {
    element.classList.add('authorization-button_logout');
  });

  loginButton.forEach(element => {
    element.textContent = userName;
    element.classList.remove('authorization-button_logout');
  });

  loginImg.forEach(element => {
    element.classList.remove('authorization-button_logout');
  });

  menuSavedItems.forEach(element => {
    element.classList.remove('menu__item_status_logged-out');
    element.classList.remove('hamburger-menu__item_status_logged-out');
  })

}

setNonAuthorizedHeader(userName, logoutButton, loginButton, loginImg, menuSavedItems) {

  logoutButton.forEach(element => {
    element.classList.remove('authorization-button_logout');
  });

  loginButton.forEach(element => {
    element.textContent = 'Авторизоваться';
    element.classList.add('authorization-button_logout');
  });

  loginImg.forEach(element => {
    element.classList.add('authorization-button_logout');
  });

  menuSavedItems.forEach(element => {
    element.classList.add('menu__item_status_logged-out');
    element.classList.add('hamburger-menu__item_status_logged-out');
  })

}

}