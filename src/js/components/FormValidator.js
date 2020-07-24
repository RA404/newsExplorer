export default class FormValidator {

  constructor() {}

  activateError(elem) {
    elem.parentNode.lastElementChild.classList.add('popup__error_show');
  }

  resetError(elem) {
    elem.parentNode.lastElementChild.classList.remove('popup__error_show');
  }

  setButtonState(buttonAllow, formButton) {
    if (!buttonAllow) {
      formButton.disabled = true;
      formButton.classList.add('popup__button_type_disabled');
    }else {
      formButton.disabled = false;
      formButton.classList.remove('popup__button_type_disabled');
    }
  }

  setEventListeners(elem) {

    this.resetError(elem);
    let isValidForm = this.checkInputValidity(elem);

    if (isValidForm) {
      // если поле прошло валидацию проверим все поля, кроме того которое ее уже прошло, чтобы активировать кнопку
      const inputs = Array.from(elem.form.elements);
      inputs.forEach((el) => {
        if (el !== elem) {
          // проверяем поля пока статус валидности формы равно true
          if (isValidForm) {
            isValidForm = this.checkInputValidity(el);
          }
        }
      });
      // если после цикла по всем полям валидность формы true тогда активируем кнопку
      // нужно понять какая кнопка у этой формы и ее активировать
      let btn;
      if (elem.form.elements.loginButton) {
        btn = elem.form.elements.loginButton;
      }
      if (elem.form.elements.signupButton) {
        btn = elem.form.elements.signupButton;
      }
      // устанавливаем активность кнопки
      if (isValidForm) {
        this.setButtonState(true, btn);
      } else {
        this.setButtonState(false, btn);
      }
    }
    //
  }

  checkInputValidity(elem) {

    let isValidForm = true;

    // определим что за поле и в зависимости от этого определим что в нем проверять
    if (elem === elem.form.elements.password) {
      // пароль должен быть не меньше 8 символов
      if (elem.value.length < 8) {
        if (elem.value.length !== 0) {
          this.activateError(elem);
        }
        isValidForm = false;
      }
    } else if (elem === elem.form.elements.name) {
      if ((elem.value.length < 2) || (elem.value.length > 30)) {
        if (elem.value.length !== 0) {
          this.activateError(elem);
        }
        isValidForm = false;
      }
    } else if (elem === elem.form.elements.email) {
      const emailPattern = /^[A-Za-z0-9\_\-\.]{1,}@[A-Za-z0-9\_\-\.]{1,}\.{1}\w{2,}$/;
      // проверить email
      if ((!elem.checkValidity())||(!emailPattern.test(elem.value))) {
        if (elem.value.length !== 0) {
          this.activateError(elem);
        }
        isValidForm = false;
      }
    }

    return isValidForm;
  }

  checkAllFormValidity(form) {

  }

}