import {isEscEvent, Mode, toTimestamp} from "../utils";
import {getTypeTitle, getOffersByType} from '../data';
import {calculateTotalPrice} from '../main';

export class AbstractEventController {
  constructor(container, component, data, onDataChange) {
    if (new.target === AbstractEventController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._container = container;
    this._component = component;
    this._data = data;

    this._onDataChange = onDataChange;
  }

  _save(form) {
    // Получение данных с формы
    const formData = new FormData(form);

    const checkedTypeInput = this._component.getElement().querySelector(`.event__type-input:checked`);

    const type = checkedTypeInput.value;

    const entry = Object.assign({}, this._data, {
      type,
      title: getTypeTitle(type),
      city: formData.get(`event-destination`),
      dateFrom: toTimestamp(formData.get(`event-start-time`)),
      dateTo: toTimestamp(formData.get(`event-end-time`)),
      price: formData.get(`event-price`),
      offers: getOffersByType(type).map((offer) => {
        return Object.assign({}, offer, {
          isApplied: formData.get(`${offer.id}`) === `on`
        });
      }),
      isFavourite: Boolean(formData.get(`event-favorite`)),
      mode: Mode.DEFAULT
    });

    this._onDataChange(entry, this._data);

    document.querySelector(`.trip-info__cost-value`).textContent = calculateTotalPrice().toString();
  }

  static _onEscKeyDown(evt, action) {
    isEscEvent(evt, action);
  }

  init() {
    throw new Error(`init() method implementation required`);
  }
}
