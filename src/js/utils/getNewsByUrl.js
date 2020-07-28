export default function getNewsByUrl(arr, url) {
  let arrItem;
  arr.forEach(element => {
    if (element.url == url) {
      arrItem = element;
    }
  });

  if (arrItem) {
    return arrItem;
  } else {
    return false;
  }

}
