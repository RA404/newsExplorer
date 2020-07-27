export default function signout(apiLinkSignout) {
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