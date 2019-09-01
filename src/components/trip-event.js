import {AbstractComponent} from './absctract-component';

export class TripEvent extends AbstractComponent {
  constructor({type, title, dateFrom, dateTo, price, offers}) {
    super();
    this._type = type;
    this._title = title;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._price = price;
    this._offers = offers;
  }

  _getDurationTemplateString() {
    const duration = this._dateTo - this._dateFrom;
    const durationHours = Math.floor(duration / (1000 * 3600)) % 60;
    const durationMinutes = Math.floor(duration / (1000 * 60)) % 60;
    const durationDays = Math.floor(durationHours / 24);

    const result = [];
    if (durationDays > 0) {
      result.push(durationDays < 10 ? `0${durationDays}D` : `${durationDays}D`);
    }

    if (durationHours > 0) {
      result.push(durationHours < 10 ? `0${durationHours}H` : `${durationHours}H`);
    }

    result.push(durationMinutes < 10 ? `0${durationMinutes}M` : `${durationMinutes}M`);

    return result.join(` `);
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._title} airport</h3>
      
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${new Date(this._dateFrom).toLocaleTimeString()}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${new Date(this._dateTo).toLocaleTimeString()}</time>
          </p>
          <p class="event__duration">${this._getDurationTemplateString()}</p>
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
