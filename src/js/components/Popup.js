import BaseComponent from '../baseComponents/BaseComponent';

export default class Popup extends BaseComponent {
  constructor(...args) {
    super(...args);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.setHeading = this.setHeading.bind(this);

    const closeButton = this.domElement.querySelector('.popup__close');
    if (closeButton) {
      closeButton.addEventListener('click', this.close);
    }

    const { Overlay } = this.dependencies;

    if (Overlay) {
      const overlayDomElement = this.domElement.querySelector('.popup__overlay');
      if (overlayDomElement) {
        this.overlay = new Overlay(overlayDomElement);
        this.overlay.addEventListener('click', this.close);
      }
    }
  }

  open() {
    this.domElement.classList.add('popup_opened');

    if (this.overlay && typeof this.overlay.show === 'function') {
      this.overlay.show();
    }
  }

  close() {
    this.domElement.classList.remove('popup_opened');

    if (this.overlay && typeof this.overlay.hide === 'function') {
      this.overlay.hide();
    }
  }

  setHeading(headingText) {
    const heading = this.domElement.querySelector('.popup__title');
    if (heading) {
      heading.textContent = headingText;
    }
  }
}