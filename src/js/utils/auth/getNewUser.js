export default function getNewUser(apiLinkSignup, emailField, passField, nameField) {
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
