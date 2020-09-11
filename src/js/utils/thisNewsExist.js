export default function thisNewsExist(arr, url) {
  let arrId;
  arr.forEach(element => {
    if (element.link == url) {
      arrId = element._id;
    }
  });
  if (arrId) {
    return arrId;
  } else {
    return false;
  }

}