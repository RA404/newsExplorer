import BaseComponent from "../baseComponents/BaseComponent";

export default class Overlay extends BaseComponent {
  constructor(...args) {
    super(...args);

  }
  show() {
    this.domElement.classList.remove('.overlay_type_transparent');
  }

  hide() {
    this.domElement.classList.add('.overlay_type_transparent');
  }
}