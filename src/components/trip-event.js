import moment from "moment";
import AbstractComponent from "./absctract-component";
import {getTypeTitle} from "../utils";
import {MOMENT_TIME_FORMAT} from "../constants";

export default class TripEvent extends AbstractComponent {
  /**
   * @param {object} event
   */
  constructor({type, destination, dateFrom, dateTo, price, offers}) {
    super();
    this._type = type;
    this._title = getTypeTitle(this._type);
    this._destination = destination;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._offers = TripEvent._getOffersForTemplate(offers, 3);
    this._price = price;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._title} ${this._destination.name}</h3>
      
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${moment(this._dateFrom).format(MOMENT_TIME_FORMAT)}</time>
            &mdash;
            <time class="event__end-time">${moment(this._dateTo).format(MOMENT_TIME_FORMAT)}</time>
          </p>
          <p class="event__duration">${this._getDuration()}</p>
        </div>
      
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${this._offers.length ? `<ul class="event__selected-offers">${this._getOffersTemplate()}</ul>` : `<p class="visually-hidden">No offers</p>`}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }

  /**
   * @return {string}
   * @private
   */
  _getOffersTemplate() {
    return this._offers
      .filter((offer) => {
        return offer.accepted;
      }).map((offer) => {
        return `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`;
      })
      .join(``);
  }

  /**
   * @return {string}
   * @private
   */
  _getDuration() {
    const duration = moment.duration(this._dateTo - this._dateFrom);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const result = {
      days: null,
      hours: null,
      minutes: `00M`
    };
    if (days > 1) {
      result.days = days < 10 ? `0${days}D` : `${days}D`;
      result.hours = `00H`;
    }
    if (hours > 0) {
      result.hours = hours < 10 ? `0${hours}H` : `${hours}H`;
    }
    if (minutes > 0) {
      result.minutes = minutes < 10 ? `0${minutes}M` : `${minutes}M`;
    }
    return Object.values(result).join(` `);
  }

  /**
   * @param {object[]} offers
   * @param {number} maxOffers
   * @return {object[]}
   * @private
   */
  static _getOffersForTemplate(offers, maxOffers) {
    return offers.filter((offer) => offer.accepted).slice(0, maxOffers);
  }
}
