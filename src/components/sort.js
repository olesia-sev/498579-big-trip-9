import AbstractComponent from "./absctract-component";
import {render} from "../utils";
import {Position, SortType} from "../constants";

export default class Sort extends AbstractComponent {
  /**
   * @param {string[]} items
   */
  constructor(items) {
    super();
    this._items = items;
    this._onSortCallback = () => null;
  }

  /**
   * @param {function} callback
   */
  setOnSortCallback(callback) {
    this._onSortCallback = callback;
  }

  /**
   * @return {string[]}
   */
  getAllowedSortType() {
    return this._items;
  }

  init() {
    render(document.querySelector(`.trip-events`), this.getTemplate(), Position.BEFORE_END);
    document.querySelectorAll(`.trip-sort__input`).forEach((radio) => {
      radio.addEventListener(`change`, this._onSortCallback);
    });
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      <span class="trip-sort__item trip-sort__item--day">Day</span>
  
      <div class="trip-sort__item trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="${SortType.DEFAULT}" checked>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>
  
      <div class="trip-sort__item trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="${SortType.TIME}">
        <label class="trip-sort__btn" for="sort-time">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>
  
      <div class="trip-sort__item trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="${SortType.PRICE}">
        <label class="trip-sort__btn" for="sort-price">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>
  
      <span class="trip-sort__item trip-sort__item--offers">Offers</span>
    </form>`;
  }
}
