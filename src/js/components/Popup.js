import BaseComponent from '../baseComponents/BaseComponent';

export default class Popup extends BaseComponent {
  constructor(...args) {
    super(...args);

    // обработаем форму, получим ее поля и кнопки
    this.emailField = this.popupForm.elements.email;
    this.passField = this.popupForm.elements.password;
    this.nameField = this.popupForm.elements.name;
    // buttons
    this.signupButton = this.popupForm.elements.signupButton;
    this.loginButton = this.popupForm.elements.loginButton;
    // links
    this.openSignupPopupLink = this.popupForm.elements.openSignupPopupLink;
    this.openLoginPopupLink = this.popupForm.elements.openLoginPopupLink;
    this.loginLink = this.popupForm.elements.loginLink;

    // привяжем this к методам
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.setHeading = this.setHeading.bind(this);
    /*this._openSignupForm = this._openSignupForm.bind(this);
    this._openSigninForm = this._openSigninForm.bind(this);*/

    // найдем элемент закрытия папапа
    const closeButton = this.domElement.querySelector('.popup__close');
    if (closeButton) {
      closeButton.addEventListener('click', this.close);
    }

    // проверим что передали в зависимостях
    const { Overlay, FormValidator } = this.dependencies;
    // если оверлэй передали, то используем класс оверлэй
    if (Overlay) {
      const overlayDomElement = this.domElement.querySelector('.popup__overlay');
      if (overlayDomElement) {
        this.overlay = new Overlay(overlayDomElement);
        this.overlay.addEventListener('click', this.close);
      }
    }
    // если валидатор передали, то используем его
    if (FormValidator) {
      this.formValidator = new FormValidator();
      if (this.emailField) {
        this.emailField.addEventListener('input', this._validation.bind(this, this.emailField));
      }
      if (this.passField) {
        this.passField.addEventListener('input', this._validation.bind(this, this.passField));
      }
      if (this.nameField) {
        this.nameField.addEventListener('input', this._validation.bind(this, this.nameField));
      }
    }

    if (this.loginButton) {
      this.loginButton.addEventListener('click', this.login);
    }

    if (this.signupButton) {
      this.signupButton.addEventListener('click', this.signup);
    }

    // обработка кнопок смены попапа, текущий попап нужно закрыть в любом случае
    if (this.openSignupPopupLink) {
      this.openSignupPopupLink.addEventListener('click', this.close);
    }
    if (this.openLoginPopupLink) {
      this.openLoginPopupLink.addEventListener('click', this.close);
    }

  }

  open() {
    this.domElement.classList.add('popup_opened');

    if (this.overlay && typeof this.overlay.show === 'function') {
      this.overlay.show();
    }
  }

  close() {
    event.preventDefault();
    this.domElement.classList.remove('popup_opened');

    if (this.overlay && typeof this.overlay.hide === 'function') {
      this.overlay.hide();
    }
  }

  setHeading(headingText) {
    const heading = this.domElement.querySelector('.popup__title');
    if (heading) {
      heading.textContent = headingText;
    }
  }

  login() {
    event.preventDefault();
    console.log('login button click');
  }

  signup() {
    event.preventDefault();
    console.log('signup button click');
  }

  _validation(elem) {
    this.formValidator.setEventListeners(elem);
  }
}