export default function setClickListenersToListOfDOM(List, funcForListener) {
  List.forEach(function(Item) {
    Item.addEventListener('click', funcForListener);
  })
}