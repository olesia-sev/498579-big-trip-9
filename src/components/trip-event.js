import {AbstractComponent} from './absctract-component';
import moment from "moment";
import {MOMENT_TIME_FORMAT} from "../utils";

export class TripEvent extends AbstractComponent {
  constructor({type, title, city, dateFrom, dateTo, price, offers}) {
    super();
    this._type = type;
    this._title = title;
    this._city = city;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._offers = TripEvent._getOffersForTemplate(offers, 3);
    this._price = price;

    this._getDuration();
  }

  static _getOffersForTemplate(offers, maxOffers) {
    return offers.filter((offer) => offer.isApplied).slice(0, maxOffers);
  }

  _getDuration() {
    const duration = moment.duration(this._dateTo - this._dateFrom);
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    const result = [];

    if (months > 0) {
      result.push(months < 10 ? `0${months}M` : `${months}M`);
    }

    if (days > 0) {
      result.push(days < 10 ? `0${days}D` : `${days}D`);
    }

    if (hours > 0) {
      result.push(hours < 10 ? `0${hours}H` : `${hours}H`);
    }

    if (minutes > 0) {
      result.push(minutes < 10 ? `0${minutes}M` : `${minutes}M`);
    }
    return result.join(` `);
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._title} ${this._city}</h3>
      
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
        
        <ul class="event__selected-offers">
          ${this._offers.filter((it) => it.isApplied).map((offer) =>`<li class="event__offer">
              <span class="event__offer-title">${offer.name}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
           </li>`).join(``)}
        </ul>
      
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }
}
