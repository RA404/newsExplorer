export default class AccountApi {
  constructor(){}

  signout(apiLinkSignout) {
    return new Promise(function (resolve, reject) {

      fetch(apiLinkSignout,
        {
          method: 'POST',
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
  }

  getNewUser(apiLinkSignup, emailField, passField, nameField) {
    return new Promise(function (resolve, reject) {

      fetch(apiLinkSignup,
        {
          method: 'POST',
          body: JSON.stringify({
            email: emailField,
            password: passField,
            name: nameField
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

  getToken(apiLinkSignin, emailField, passField) {
    return new Promise(function (resolve, reject) {

      fetch(apiLinkSignin,
        {
          method: 'POST',
          body: JSON.stringify({
            email: emailField,
            password: passField
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
          if (res.status == 404) {
            reject(`Такой пользователь не найден, попробуйте еще раз или зарегистрируйтесь.`);
          } else if (res.status == 401) {
            reject(`Неправильное имя пользователя или пароль`);
          } else {
            reject(`Ошибка: ${res.status} ${res.statusText}`);
          }
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getCurrentUser(apiLinkLogin) {

    return new Promise(function (resolve, reject) {

      fetch(apiLinkLogin,
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
  };

}