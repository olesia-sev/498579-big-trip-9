import "flatpickr/dist/themes/light.css";
import flatpickr from "flatpickr";
import moment from "moment";
import {getTypeTitle, isEventTypeAllowed} from "../utils";
import AbstractComponent from "./absctract-component";
import {FLATPICKR_DATE_TIME_FORMAT, MOMENT_DATE_TIME_FORMAT, Mode, Position, render, clone} from "../utils";
import {getEventTypeLabelTemplate, getEventTypesTemplate} from "../templates/event-type";
import {
  getDestinationSectionTemplate,
  getEventDetailsSectionTemplate,
  getOffersSectionTemplate
} from "../templates/event-details-section";

export default class TripEventEditing extends AbstractComponent {
  /**
   * @param {object} event
   * @param {object[]} allDestinations
   * @param {object[]} allOffers
   */
  constructor({
    id,
    type,
    destination,
    dateFrom,
    dateTo,
    offers,
    price,
    isFavorite,
    mode = Mode.DEFAULT,
  }, allDestinations, allOffers) {
    super();

    this._event = {
      id,
      type,
      destination,
      dateFrom,
      dateTo,
      offers,
      price,
      isFavorite
    };

    this._allDestinations = allDestinations;
    this._allOffers = allOffers;

    this._mode = mode;

    this._startPickr = null;
    this._endPickr = null;
    this._flatpickrInit();

    this._setEventHandlerOnEventTypeChange();
    this._setEventHandlerOnDestinationChange();
    this._setEventHandlerOffersChange();
    this._setEventHandlerOnPriceChange();

    if (this._mode === Mode.DEFAULT) {
      this._setEventHandlerOnFavoriteChange();
    }

    const element = this.getElement();
    this._submitButton = element.querySelector(`button[type="submit"]`);
    this._resetButton = element.querySelector(`button[type="reset"]`);

    this._preventSaving();
  }

  /**
   * @return {object}
   */
  getEvent() {
    return this._event;
  }

  /**
   * @return {boolean}
   */
  isEventValid() {
    return isEventTypeAllowed(this._event.type) &&
      !!this._event.destination && !!this._event.destination.name &&
      !!this._event.dateTo && !!this._event.dateFrom &&
      this._event.dateTo >= this._event.dateFrom;
  }

  /**
   * @param {string} text
   */
  setSubmitButtonText(text = `Saving...`) {
    this._submitButton.textContent = text;
  }

  setDefaultSubmitButtonText() {
    this.setSubmitButtonText(`Save`);
  }

  /**
   * @param {string} text
   */
  setResetButtonText(text = `Deleting...`) {
    this._resetButton.textContent = text;
  }

  setDefaultResetButtonText() {
    this.setResetButtonText(this._mode === Mode.DEFAULT ? `Delete` : `Cancel`);
  }

  flatpickrDestroy() {
    if (this._startPickr) {
      this._startPickr.destroy();
    }
    if (this._endPickr) {
      this._endPickr.destroy();
    }
  }

  /**
   * @return {string}
   */
  getTemplate() {
    const template = `<form class="event event--edit ${!this._event.destination.name ? `trip-events__item` : ``}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          ${getEventTypeLabelTemplate(this._event.type)}
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${getEventTypesTemplate(null)}
        </div>
    
        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${getTypeTitle(this._event.type)}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._event.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${this._allDestinations.map(({name}) => `<option value="${name}">${name}</option>`).join(``)}
          </datalist>
        </div>
    
        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._event.dateFrom).format(MOMENT_DATE_TIME_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._event.dateTo).format(MOMENT_DATE_TIME_FORMAT)}">
        </div>
    
        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${this._event.price}">
        </div>
    
        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${this._mode === Mode.DEFAULT ? `Delete` : `Cancel`}</button>
    
        ${this._mode === Mode.ADDING ? `` : `
          <input id="event-favorite-1" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${this._event.isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">${this._event.isFavorite ? `Remove from favorite` : `Add to favorite`}</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Close event</span>
          </button>
        `}
      </header>
      ${getEventDetailsSectionTemplate(this._event.offers, this._event.destination.description, this._event.destination.pictures)}
    </form>`;
    return `${this._mode === Mode.ADDING ? template : `<li class="trip-events__item">${template}</li>`}`;
  }

  /**
   * @private
   */
  _preventSaving() {
    this._submitButton.disabled = !this.isEventValid();
  }

  /**
   * @private
   */
  _renderEventDetailsSection() {
    const eventDetailsSectionTemplate = getEventDetailsSectionTemplate(
        this._event.offers,
        this._event.destination.description,
        this._event.destination.pictures
    );
    if (eventDetailsSectionTemplate) {
      render(
          this.getElement().querySelector(`.event__header`),
          eventDetailsSectionTemplate,
          Position.AFTER_END
      );
    }
  }

  /**
   * @private
   */
  _flatpickrInit() {
    /* eslint-disable camelcase */
    const options = {
      "dateFormat": FLATPICKR_DATE_TIME_FORMAT,
      "enableTime": true,
      "time_24hr": true
    };
    /* eslint-enable camelcase */

    const startPickr = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign({}, options, {
          defaultDate: this._event.dateFrom,
          maxDate: this._event.dateTo
        })
    );

    const endPickr = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign({}, options, {
          defaultDate: this._event.dateTo,
          minDate: this._event.dateFrom
        })
    );

    startPickr.set(`onClose`, (selectedDates, dateStr) => {
      endPickr.set(`minDate`, dateStr);
      this._event.dateFrom = selectedDates[0].getTime();
      this._preventSaving();
    });

    endPickr.set(`onClose`, (selectedDates, dateStr) => {
      startPickr.set(`maxDate`, dateStr);
      this._event.dateTo = selectedDates[0].getTime();
      this._preventSaving();
    });

    this._startPickr = startPickr;
    this._endPickr = endPickr;
  }

  /**
   * @private
   */
  _setEventHandlerOnEventTypeChange() {
    const typeRadios = this.getElement().querySelectorAll(`.event__type-input`);
    const typeTitle = this.getElement().querySelector(`.event__type-output`);
    const oldOffersState = clone(this._event.offers);

    typeRadios.forEach((radio) => {
      radio.addEventListener(`change`, () => {
        this._event.type = radio.value;

        this._preventSaving();

        const offer = this._allOffers.find(({type}) => type === this._event.type);

        if (offer && Array.isArray(offer.offers)) {
          this._event.offers = offer.offers;
        } else {
          this._event.offers = [];
        }

        typeTitle.textContent = getTypeTitle(this._event.type);

        // Перерисуем ионкокнопку выбора типа точки,события
        render(this.getElement().querySelector(`.event__type-btn`), getEventTypeLabelTemplate(this._event.type));

        switch (true) {
          // Если в DOM уже есть section для offers, перерисуем этот section
          case this.getElement().querySelector(`.event__section--offers`) !== null:
            const offersSection = this.getElement().querySelector(`.event__section--offers`);
            if (this._event.offers.length) {
              render(offersSection, getOffersSectionTemplate(this._event.offers));
            } else {
              offersSection.parentNode.removeChild(offersSection);
            }
            break;

          // Если в DOM есть section event__details,
          // отрендерим section для offers в начале этого event__details
          case this.getElement().querySelector(`.event__details`) !== null:
            const template = getOffersSectionTemplate(this._event.offers);
            if (template) {
              render(
                  this.getElement().querySelector(`.event__details`),
                  template,
                  Position.AFTER_BEGIN
              );
            }
            break;

          // В противном случае отренедерим весь event__details
          default:
            this._renderEventDetailsSection();
        }

        // Если в DOM не было offers,
        // то мы должны назначить им событие setEventHandlerOffersChange
        if (!oldOffersState.length && this._event.offers.length) {
          this._setEventHandlerOffersChange();
        }
      });
    });
  }

  /**
   * @private
   */
  _setEventHandlerOnDestinationChange() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const {value} = evt.currentTarget;
        const destination = this._allDestinations.find(({name}) => name === value);
        if (!destination) {
          evt.currentTarget.value = this._event.destination.name;
          return;
        }

        this._event.destination = destination;

        this._preventSaving();

        switch (true) {
          // Если в DOM уже есть section для description и pictures, перерисуем этот section
          case this.getElement().querySelector(`.event__section--destination`) !== null:
            render(
                this.getElement().querySelector(`.event__section--destination`),
                getDestinationSectionTemplate(this._event.destination.description, this._event.destination.pictures)
            );
            break;

          // Если в DOM есть section event__details,
          // отрендерим section для description и pictures в конце этого event__details
          case this.getElement().querySelector(`.event__details`) !== null:
            const destinationSectionTemplate = getDestinationSectionTemplate(
                this._event.destination.description,
                this._event.destination.pictures
            );
            if (destinationSectionTemplate) {
              render(
                  this.getElement().querySelector(`.event__details`),
                  destinationSectionTemplate,
                  Position.BEFORE_END
              );
            }
            break;

          // В противном случае отренедерим весь event__details
          default:
            this._renderEventDetailsSection();
        }
      });
  }

  /**
   * @private
   */
  _setEventHandlerOnPriceChange() {
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      const {value} = evt.currentTarget;
      this._event.price = Math.max(Number(value), 0) || 0;
    });
  }

  /**
   * @private
   */
  _setEventHandlerOffersChange() {
    const checkboxes = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener(`change`, (evt) => {
        const {name, checked} = evt.currentTarget;
        this._event.offers = this._event.offers.map((offer) => {
          const {id} = offer;
          if (id === name) {
            return Object.assign({}, offer, {accepted: checked});
          }
          return offer;
        });
      });
    });
  }

  /**
   * @private
   */
  _setEventHandlerOnFavoriteChange() {
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, () => {
        this._event.isFavorite = !this._event.isFavorite;
        const element = this.getElement().querySelector(`.event__favorite-btn .visually-hidden`);
        if (this._event.isFavorite) {
          element.textContent = `Remove from favorite`;
        } else {
          element.textContent = `Add to favorite`;
        }
      });
  }
}
