import AbstractComponent from "./absctract-component";
import {capitalizeFirstLetter, render} from "../utils";
import {Position} from "../constants";

export default class Filters extends AbstractComponent {
  /**
   * @param {string[]} items
   */
  constructor(items) {
    super();
    this._items = items;
    this._onFilterCallback = () => null;
  }

  /**
   * @param {function} callback
   */
  setOnFilterCallback(callback) {
    this._onFilterCallback = callback;
  }

  /**
   * @return {string[]}
   */
  getAllowedFilterType() {
    return this._items;
  }

  init() {
    render(document.querySelectorAll(`.trip-controls h2`)[1], this.getTemplate(), Position.AFTER_END);
    document.querySelectorAll(`.trip-filters__filter-input`).forEach((radio) => {
      radio.addEventListener(`change`, this._onFilterCallback);
    });
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const getFilterTemplate = (filter, index) => {
      return `<div class="trip-filters__filter">
        <input 
          id="filter-everything-${index}" 
          class="trip-filters__filter-input visually-hidden" 
          type="radio" 
          name="trip-filter" 
          value="${filter}" 
          ${index === 0 ? `checked` : ``}
        >
        <label class="trip-filters__filter-label" for="filter-everything-${index}">${capitalizeFirstLetter(filter)}</label>
      </div>`;
    };
    return `<form class="trip-filters" action="#" method="get">
      ${this._items.map((filter, index) => getFilterTemplate(filter, index)).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}
