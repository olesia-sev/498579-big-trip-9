import {TripEvent} from "../components/trip-event";
import {EventEdit} from "../components/event-editing";
import {isEscEvent, Position, render, toTimestamp} from "../utils";
import {getTypeTitle, getOffersByType} from '../data';
import {calculateTotalPrice} from '../main';

export class PointController {

  constructor(container, event, onDataChange, onChangeView) {
    this._container = container; // trip-events
    this._event = event;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._tripEvent = new TripEvent(event);
    this._eventEdit = new EventEdit(event);

    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      isEscEvent(evt, closeEditForm);
    };

    const showEditForm = () => {
      this._container.replaceChild(this._eventEdit.getElement(), this._tripEvent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closeEditForm = () => {
      this._container.replaceChild(this._tripEvent.getElement(), this._eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        showEditForm();
      });

    this._eventEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, closeEditForm);

    this._eventEdit.getElement()
      .querySelector(`form.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        // Получение данных с формы
        const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));

        const checkedTypeInput = this._eventEdit.getElement().querySelector(`.event__type-input:checked`);

        const type = checkedTypeInput.value;

        const entry = Object.assign({}, this._event, {
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
        });

        this._onDataChange(entry, this._event);

        document.querySelector(`.trip-info__cost-value`).textContent = calculateTotalPrice().toString();
        document.removeEventListener(`keydown`, onEscKeyDown);

        closeEditForm();
      });

    render(this._container, this._tripEvent.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._tripEvent.getElement(), this._eventEdit.getElement());
    }
  }

}
