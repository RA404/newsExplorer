export default function getToken(apiLinkSignin, emailField, passField) {
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