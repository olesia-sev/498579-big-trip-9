import {EventsDaysList} from '../components/trip-days-container';
import {isEscEvent, Position, render} from '../utils';
import {TripEvent} from '../components/trip-event';
import {DayElement} from '../components/trip-day-card';
import {EventEdit} from '../components/event-editing';
import {EventsList} from '../components/events-list';
import {Sort} from '../components/sort';

export class TripController {
  constructor(container, events) {
    this._container = container; // trip-events
    this._events = events; // array of objects with events
    this._eventsDaysList = new EventsDaysList(); // контейнер для дней - trip-days
    this._sort = new Sort();
    this._sortType = `event`;
  }

  init() {
    // Отрендерим сортировку
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
    // Отрендерим контейнер для списка всех дней
    render(this._container, this._eventsDaysList.getElement(), Position.BEFOREEND);

    this._renderEventsByDays([...this._events]);

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderEvents(events) {
    const dayElement = new DayElement().getElement(); // li trip-days__item  day
    const eventsList = new EventsList().getElement(); // trip-events__list

    dayElement.querySelector(`.day__info`).innerHTML = ``;
    render(this._eventsDaysList.getElement(), dayElement, Position.BEFOREEND);

    events.forEach((tripEvent) => {
      render(dayElement, eventsList, Position.BEFOREEND);
      this._renderEvent(eventsList, tripEvent);
    });
  }

  _renderEventsByDays(events) {
    // Создадим объект с упорядоченными по датам массивами событий
    // { 2019-01-01: [ {event1}, {event2}, ... ], ... }
    const eventsByDays = events.reduce((acc, event) => {
      const date = new Date(event.dateFrom);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!Array.isArray(acc[key])) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {});

    // Разделим объект с упорядоченными по датам массивами событий через Object.entries,
    // таким образом мы получим массив массивов вида
    // [ [ 2019-01-01, [ {event1}, {event2} ] ], ... ].
    // Затем, переберём его: на каждой итерации (количество итераций = количеству дней)
    // будем создавать контейнер для дня (dayElement) и контейнер для событий в этом дне (eventsList).
    // Затем, переберем события в текущем дне:
    // на каждой итерации будем создавать карточку события и рендерить её внутри eventsList
    Object.entries(eventsByDays).forEach(([dateAsKey, tripEvents]) => {
      const dayElement = new DayElement(dateAsKey).getElement(); // li trip-days__item  day
      const eventsList = new EventsList().getElement(); // trip-events__list
      render(this._eventsDaysList.getElement(), dayElement, Position.BEFOREEND);
      tripEvents.forEach((tripEvent) => {
        render(dayElement, eventsList, Position.BEFOREEND);
        this._renderEvent(eventsList, tripEvent);
      });
    });
  }

  _renderEvent(eventsList, tripEventElem) {
    const tripEvent = new TripEvent(tripEventElem);
    const eventEdit = new EventEdit(tripEventElem);

    const onEscKeyDown = (evt) => {
      isEscEvent(evt, closeEditForm);
    };

    const showEditForm = () => {
      eventsList.replaceChild(eventEdit.getElement(), tripEvent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closeEditForm = () => {
      eventsList.replaceChild(tripEvent.getElement(), eventEdit.getElement());
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

    render(eventsList, tripEvent.getElement(), Position.BEFOREEND);
  }

  _getSortedEvents() {
    let sortedEvents = [];

    switch (this._sortType) {
      case `time`:
        sortedEvents = [...this._events].sort((a, b) => {
          return (a.dateTo - a.dateFrom) - (b.dateTo - b.dateFrom);
        });
        break;

      case `price`:
        sortedEvents = [...this._events].sort((a, b) => a.price - b.price);
        break;

      case `event`:
        sortedEvents = [...this._events];
        break;
    }

    return sortedEvents;
  }

  _render() {
    this._eventsDaysList.getElement().innerHTML = ``;

    const sortedEvents = this._getSortedEvents();

    if (this._sortType === `event`) {
      this._renderEventsByDays(sortedEvents);
    } else {
      this._renderEvents(sortedEvents);
    }

    this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = this._sortType === `event` ? `Day` : ``;
  }

  _onSortLinkClick(evt) {
    if (!evt.target.dataset.sortType) {
      return;
    }

    this._sortType = evt.target.dataset.sortType;

    this._render();
  }

}
