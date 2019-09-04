import {TripEvent} from "../components/trip-event";
import {EventEdit} from "../components/event-editing";
import {isEscEvent, Position, render} from "../utils";
import {offers, getTypeTitle} from '../data';

export class PointController {

  constructor(container, events, onDataChange, onChangeView) {
    this._container = container; // trip-events
    this._event = events; // array of objects with events
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._tripEvent = new TripEvent(events);
    this._eventEdit = new EventEdit(events);

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
      .addEventListener(`submit`, closeEditForm);

    this._eventEdit.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        // Получение данных с формы
        const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));

        const entry = Object.assign({}, this._event, {
          type: formData.get(`event-type`),
          title: getTypeTitle(formData.get(`event-type`)),
          city: formData.get(`event-destination`),
          dateFrom: formData.get(`event-start-time`),
          dateTo: formData.get(`event-end-time`),
          price: formData.get(`event-price`),
          offers: offers.map((offer) => {
            return Object.assign({}, offer, {
              isApplied: formData.get(`${offer.id}`) === `on`
            });
          }),
          isFavourite: Boolean(formData.get(`event-favorite`)),
        });

        this._onDataChange(entry, this._event);

        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, this._tripEvent.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._tripEvent.getElement(), this._eventEdit.getElement());
    }
  }

}
