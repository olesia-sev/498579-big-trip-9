import {createElement} from "../utils";

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return ``;
  }

  /**
   * @return {Node|Element}
   */
  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
