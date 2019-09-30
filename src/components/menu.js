import {AbstractComponent} from "./absctract-component";
import {Position, render} from "../utils";

export class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
    this._onClickCallback = () => null;
  }

  setActiveMenuItem(name) {
    this._menuItems = this._menuItems.map((item) => {
      return Object.assign({}, item, {isActive: item.name === name});
    });
  }

  setOnclickCallback(callback) {
    this._onClickCallback = callback;
  }

  render() {
    const tabsContainer = document.querySelector(`.trip-tabs`);
    if (tabsContainer) {
      tabsContainer.parentNode.removeChild(tabsContainer);
    }
    render(document.querySelectorAll(`.trip-controls h2`)[0], this.getTemplate(), Position.AFTER_END);
    document.querySelector(`.trip-tabs`).addEventListener(`click`, this._onClickCallback);
  }

  getTemplate() {
    const html = this._menuItems.map((item) => {
      return `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : ``}" href="#">${item.name}</a>`;
    });

    return `<nav class="trip-controls__trip-tabs trip-tabs">${html.join(``)}</nav>`;
  }
}
