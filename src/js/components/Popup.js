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
    this._login = this._login.bind(this);
    // this._signup = this._signup.bind(this);
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
      this.loginButton.addEventListener('click', this._login);
    }

    /*if (this.signupButton) {
      this.signupButton.addEventListener('click', this._signup);
    }*/

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

  _login() {
    event.preventDefault();

    const apiLink = "https://apinews.ra404.ru/signin";

    //получим карточки с сервера
    let promiseToken = this._getToken(apiLink, this.emailField.value, this.passField.value);
    promiseToken
      .then((result) => {
        console.log(result);
        //document.cookie = `jwt=${result.token}`;
        // авторизацию прошли, токен получили, записали токен в куки

        //теперь нужно обратиться на users/me и показать наш токен, нам вернется имя пользователя
        //-----
        return new Promise(function(resolve, reject) {

          fetch('https://apinews.ra404.ru/users/me',
          {
            credentials: 'include',
          })
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
        //-----
      })
      .catch((err) => {
        console.log(err);
      });



  }

  _getToken(apiLink, emailValue, passValue) {
    return new Promise(function (resolve, reject) {

      fetch(apiLink,
        {
          method: 'POST',
          body: JSON.stringify({
            email: emailValue,
            password: passValue
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          //если ошибка, переходим в catch
          reject(`Ошибка: ${res.status} ${res.statusText}`);
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  _validation(elem) {
    this.formValidator.setEventListeners(elem);
  }
}
