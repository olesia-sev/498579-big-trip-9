import {EventsDaysList} from '../components/trip-days-container';
import {isEscEvent, Position, render} from '../utils';
import {TripEvent} from '../components/trip-event';
import {DayElement} from '../components/trip-day-card';
import {EventEdit} from '../components/event-editing';
import {EventsList} from '../components/events-list';

export class TripController {
  constructor(container, events) {
    this._container = container; // trip-events
    this._events = events; // array of objects with events

    this._eventsDaysList = new EventsDaysList(); // контейнер для дней - trip-days
    this._dayElement = new DayElement(); // li trip-days__item  day
    this._eventsList = new EventsList(); // trip-events__list
  }

  init() {
    render(this._container, this._eventsDaysList.getElement(), Position.BEFOREEND);
    render(this._eventsDaysList.getElement(), this._dayElement.getElement(), Position.BEFOREEND);
    render(this._dayElement.getElement(), this._eventsList.getElement(), Position.BEFOREEND);

    this._events.forEach((tripEvent) => this._renderEvent(tripEvent));
  }

  _renderEvent(tripEventElem) {
    const tripEvent = new TripEvent(tripEventElem);
    const eventEdit = new EventEdit(tripEventElem);

    const onEscKeyDown = (evt) => {
      isEscEvent(evt, closeEditForm);
    };

    const showEditForm = () => {
      this._eventsList.getElement().replaceChild(eventEdit.getElement(), tripEvent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closeEditForm = () => {
      this._eventsList.getElement().replaceChild(tripEvent.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, showEditForm);

    eventEdit.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, closeEditForm);

    eventEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, closeEditForm);

    eventEdit.getElement()
      .addEventListener(`submit`, closeEditForm);

    render(this._eventsList.getElement(), tripEvent.getElement(), Position.BEFOREEND);
  }
}
