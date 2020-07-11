import Popup from '../components/Popup';

const popupLogin = new Popup(document.querySelector('.popup'));
const popupSignup = new Popup(document.querySelector('.popup_signup'));
const popupRegistered = new Popup(document.querySelector('.popup_successful-registered'));
const popupList = document.querySelectorAll('.popup');

export { popupLogin, popupSignup, popupRegistered, popupList };