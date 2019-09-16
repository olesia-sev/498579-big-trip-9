import 'flatpickr/dist/themes/light.css';
import flatpickr from 'flatpickr';
import moment from 'moment';
import {destinations, getCityInfo, getOffersByType, getTypeTitle} from '../data';
import {AbstractComponent} from './absctract-component';
import {FLATPICKER_DATE_TIME_FORMAT, MOMENT_DATE_TIME_FORMAT, Mode, render, Position} from '../utils';
import {getEventTypeLabelTemplate, getEventTypesTemplate} from "../templates/event-type";
import {
  getDestinationSectionTemplate,
  getEventDetailsSectionTemplate,
  getOffersSectionTemplate
} from "../templates/event-details-section";

export class TripEventEditing extends AbstractComponent {
  /**
   * @param {string} type
   * @param {string} city
   * @param {number} dateFrom
   * @param {number} dateTo
   * @param {string[]} offers
   * @param {number} price
   * @param {boolean} isFavourite
   * @param {string} mode
   */
  constructor({
    type,
    city,
    dateFrom,
    dateTo,
    offers,
    price,
    isFavourite,
    mode = Mode.DEFAULT,
  }) {
    super();

    this._data = {
      type,
      city,
      dateFrom,
      dateTo,
      offers,
      price,
      isFavourite
    };

    const {description, picsUrl} = getCityInfo(city) || {};

    this._data.description = description || ``;
    this._data.picsUrl = picsUrl || [];

    this._mode = mode;

    this._flatpickrInit();
    this._setEventHandlerOnCityChange();
    this._setEventHandlerOnEventTypeChange();

    if (this._mode === Mode.DEFAULT) {
      this._setEventHandlerOnFavouriteChange();
    }
  }

  /**
   * @private
   */
  _flatpickrInit() {
    const options = {
      dateFormat: FLATPICKER_DATE_TIME_FORMAT,
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true
    };

    const startPickr = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign({}, options, {
          defaultDate: this._data.dateFrom,
          maxDate: this._data.dateTo
        })
    );
    const endPickr = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign({}, options, {
          defaultDate: this._data.dateTo,
          minDate: this._data.dateFrom
        })
    );
    startPickr.set(`onClose`, (selectedDates, dateStr) => {
      endPickr.set(`minDate`, dateStr);
      this._data.dateFrom = selectedDates[0].getTime();
    });
    endPickr.set(`onClose`, (selectedDates, dateStr) => {
      startPickr.set(`maxDate`, dateStr);
      this._data.dateTo = selectedDates[0].getTime();
    });
  }

  /**
   * @private
   */
  _setEventHandlerOnCityChange() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const currentTarget = evt.currentTarget;
        let {description, picsUrl} = getCityInfo(currentTarget.value) || {};
        this._data.description = description || ``;
        this._data.picsUrl = picsUrl || [];

        switch (true) {
          // Если в DOM уже есть section для description и picsUrl, перерисуем этот section
          case this.getElement().querySelector(`.event__section--destination`) !== null:
            render(
                this.getElement().querySelector(`.event__section--destination`),
                getDestinationSectionTemplate(this._data.description, this._data.picsUrl)
            );
            break;
          // Если в DOM есть section event__details,
          // отрендерим section для description и picsUrl в конце этого event__details
          case this.getElement().querySelector(`.event__details`) !== null:
            render(
                this.getElement().querySelector(`.event__details`),
                getDestinationSectionTemplate(this._data.description, this._data.picsUrl),
                Position.BEFORE_END
            );
            break;
          // В противном случае отренедерим весь event__details
          default:
            render(
                this.getElement().querySelector(`.event__header`),
                getEventDetailsSectionTemplate(
                    this._data.offers,
                    this._data.description,
                    this._data.picsUrl
                ),
                Position.AFTER_END
            );
        }
      });
  }

  /**
   * @private
   */
  _setEventHandlerOnEventTypeChange() {
    const typeRadios = this.getElement().querySelectorAll(`.event__type-input`);
    let typeTitle = this.getElement().querySelector(`.event__type-output`);

    typeRadios.forEach((radio) => {
      radio.addEventListener(`change`, () => {
        this._data.type = radio.value;
        this._data.offers = getOffersByType(this._data.type);

        typeTitle.textContent = getTypeTitle(this._data.type);
        // Перерисуем ионкокнопку выбора типа точки,события
        render(this.getElement().querySelector(`.event__type-btn`), getEventTypeLabelTemplate(this._data.type));

        switch (true) {
          // Если в DOM уже есть section для offers, перерисуем этот section
          case this.getElement().querySelector(`.event__section--offers`) !== null:
            render(
                this.getElement().querySelector(`.event__section--offers`),
                getOffersSectionTemplate(this._data.offers)
            );
            break;
          // Если в DOM есть section event__details,
          // отрендерим section для offers в начале этого event__details
          case this.getElement().querySelector(`.event__details`) !== null:
            render(
                this.getElement().querySelector(`.event__details`),
                getOffersSectionTemplate(this._data.offers),
                Position.AFTER_BEGIN
            );
            break;
          // В противном случае отренедерим весь event__details
          default:
            render(
                this.getElement().querySelector(`.event__header`),
                getEventDetailsSectionTemplate(
                    this._data.offers,
                    this._data.description,
                    this._data.picsUrl
                ),
                Position.AFTER_END
            );
        }
      });
    });
  }

  /**
   * @private
   */
  _setEventHandlerOnFavouriteChange() {
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, () => {
        this._data.isFavourite = !this._data.isFavourite;
      });
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const template = `<form class="event event--edit ${!this._data.city ? `trip-events__item` : ``}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          ${getEventTypeLabelTemplate(this._data.type)}
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${getEventTypesTemplate(null)}
        </div>
    
        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${getTypeTitle(this._data.type)}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._data.city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map(({city}) => `<option value="${city}">${city}</option>`).join(``)}
          </datalist>
        </div>
    
        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._data.dateFrom).format(MOMENT_DATE_TIME_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._data.dateTo).format(MOMENT_DATE_TIME_FORMAT)}">
        </div>
    
        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${this._data.price}">
        </div>
    
        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${this._mode === Mode.ADDING ? `Cancel` : `Delete`}</button>
    
        ${this._mode === Mode.ADDING ? `` : `
          <input id="event-favorite-1" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${this._data.isFavourite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        `}
      </header>
      ${getEventDetailsSectionTemplate(this._data.offers, this._data.description, this._data.picsUrl)}
    </form>`;
    return `${this._mode === Mode.ADDING ? template : `<li class="trip-events__item">${template}</li>`}`;
  }
}
