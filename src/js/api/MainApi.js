export default class MainApi {

  constructor(token, apiUrl) {
    this.token = token;
    this.apiUrl = apiUrl;
  }

  getUserData() {
    return new Promise(function(resolve, reject) {

      fetch(apiUrl, {
        headers: {
          authorization: this.token,
        }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        //если ошибка, переходим в catch
        return reject(`Ошибка: ${res.status}`);
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }


}