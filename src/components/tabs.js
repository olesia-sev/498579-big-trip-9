import AbstractComponent from "./absctract-component";
import {render} from "../utils";
import {CustomEventName, Position} from "../constants";

export default class Tabs extends AbstractComponent {
  /**
   * @param {object[]} tabs
   */
  constructor(tabs) {
    super();
    this._tabs = tabs;
    this._isDisabled = false;
    this._onTabClick = () => null;
  }

  /**
   * @param {function} callback
   */
  setOnclickCallback(callback) {
    this._onTabClick = callback;
  }

  init() {
    document.addEventListener(CustomEventName.TAB_CLICK, ({detail}) => {
      this._setActiveTab(detail);
      this._render();
    });
    this._render();
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const html = this._tabs.map((item) => {
      if (this._isDisabled) {
        return `<span class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : ``}">${item.name}</span>`;
      }
      return `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : ``}" href="#">${item.name}</a>`;
    });

    return `<nav class="trip-controls__trip-tabs trip-tabs">${html.join(``)}</nav>`;
  }

  disabledTabs() {
    this._isDisabled = true;
    this._render();
  }

  enableTabs() {
    this._isDisabled = false;
    this._render();
  }

  /**
   * @param {string} name
   * @private
   */
  _setActiveTab(name) {
    this._tabs = this._tabs.map((item) => {
      return Object.assign({}, item, {isActive: item.name === name});
    });
  }

  /**
   * @private
   */
  _render() {
    const tabsContainer = document.querySelector(`.trip-tabs`);
    if (tabsContainer) {
      tabsContainer.parentNode.removeChild(tabsContainer);
    }

    render(document.querySelectorAll(`.trip-controls h2`)[0], this.getTemplate(), Position.AFTER_END);

    if (!this._isDisabled) {
      document.querySelector(`.trip-tabs`).addEventListener(`click`, this._onTabClick);
    }
  }
}
