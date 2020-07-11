import BaseComponent from '../baseComponents/BaseComponent';

export default class Popup extends BaseComponent {
  constructor(...args) {
    super(...args);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.domElement.classList.add('popup_opened');
  }

  close() {
    this.domElement.classList.remove('popup_opened');
  }
}