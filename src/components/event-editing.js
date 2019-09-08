import {destinations, getOffersByType, getTypeTitle} from '../data';
import {AbstractComponent} from "./absctract-component";
import {Position} from "../utils";

export class EventEdit extends AbstractComponent {
  constructor({type, title, city, dateFrom, dateTo, offers, price, description, sightsImagesSrc, isFavourite}) {
    super();
    this._type = type;
    this._title = title;
    this._city = city;
    this._cities = destinations.map((item) => item.city);
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._offers = offers;
    this._price = price;
    this._description = description;
    this._sightsImagesSrc = sightsImagesSrc;
    this._isFavourite = isFavourite;

    this._changeDescriptionByDestPoint();
    this._fillImages();
    this._changeImagesByDestPoint();
    this._fillAvailableOffers();
    this._changeEventType();
  }

  _fillAvailableOffers() {
    this.getElement().querySelector(`.event__available-offers`).innerHTML = ``;
    let availableOffersHtml = ``;
    this._offers.forEach((item) => {
      availableOffersHtml += `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${item.id}-1" type="checkbox" name="${item.id}" ${item.isApplied ? `checked` : ``}>
          <label class="event__offer-label" for="${item.id}-1">
            <span class="event__offer-title">${item.name}</span>
            &plus;&euro;&nbsp;<span class="event__offer-price">${item.price}</span>
          </label>
        </div>`;
    });
    this.getElement().querySelector(`.event__available-offers`).insertAdjacentHTML(Position.BEFOREEND, availableOffersHtml);
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type }.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
    
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
    
              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>
    
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
    
              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>
    
              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>
    
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${this._title}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
          <datalist id="destination-list-1">
              ${this._cities.map((item) => `<option value="${item}"></option>`).join(``)}
          </datalist>
        </div>
    
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${new Date(this._dateFrom).toLocaleDateString()} ${new Date(this._dateFrom).toLocaleTimeString()}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${new Date(this._dateTo).toLocaleDateString()} ${new Date(this._dateTo).toLocaleTimeString()}">
        </div>
    
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
        </div>
    
        <button class="event__save-btn btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
    
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavourite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
    
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
    
      <section class="event__details">
    
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    
          <div class="event__available-offers"></div>
        </section>
    
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._description}</p>
    
          <div class="event__photos-container">
            <div class="event__photos-tape"></div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
  }

  _changeDescriptionByDestPoint() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const currentTarget = evt.currentTarget;
        const currentCity = destinations.find(({city}) => city === currentTarget.value);
        if (currentCity) {
          this.getElement().querySelector(`.event__destination-description`).textContent = currentCity.description;
        } else {
          this.getElement().querySelector(`.event__destination-description`).textContent = ``;
        }
      });
  }

  _fillImages() {
    this.getElement().querySelector(`.event__photos-tape`).innerHTML = ``;
    let imagesHtml = ``;
    this._sightsImagesSrc.forEach((src) => {
      imagesHtml += `<img class="event__photo" src="${src}" alt="Event photo">`;
    });
    this.getElement().querySelector(`.event__photos-tape`).insertAdjacentHTML(Position.BEFOREEND, imagesHtml);
  }

  _changeImagesByDestPoint() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const currentTarget = evt.currentTarget;
        const currentCity = destinations.find(({city}) => city === currentTarget.value);

        this._sightsImagesSrc = currentCity.picsUrl;
        this._fillImages();
      });
  }

  _changeEventType() {
    const typeRadios = this.getElement().querySelectorAll(`.event__type-input`);
    const IMG_PATH = `img/icons/`;
    let typeIcon = this.getElement().querySelector(`.event__type-icon`);
    let typeTitle = this.getElement().querySelector(`.event__type-output`);

    typeRadios.forEach((radio) => {
      radio.addEventListener(`change`, () => {
        typeIcon.src = `${IMG_PATH}${radio.value}.png`;
        typeTitle.textContent = getTypeTitle(radio.value);
        this._offers = getOffersByType(radio.value);
        this._fillAvailableOffers();
      });
    });
  }

}
