export default class BaseComponent {

  constructor(domElement, dependencies = {} ) {
    this.domElement = domElement;
    this.dependencies = dependencies;

    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
  }

  addEventListener(...args) {
    this.domElement.addEventListener(...args);
  }

  removeEventListener(...args) {
    this.domElement.removeEventListener(...args);
  }
}