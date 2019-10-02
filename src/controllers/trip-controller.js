import moment from "moment";
import EventDaysContainer from '../components/trip-days-container';
import {calculateTotalPriceEvtName, menuClickEvtName, renderItineraryEvtName, Position, render} from '../utils';
import TripDayCard from '../components/trip-day-card';
import DayInfo from '../components/day-info';
import EventsList from '../components/events-list';
import Sort from '../components/sort';
import EventController from '../controllers/event-controller';
import NewEventController from "./new-event-controller";
import Statistics from "../components/statistics";
import Filters from "../components/filters";
import {DEFAULT_FILTER, FUTURE_FILTER, PAST_FILTER} from "../data";

export default class TripController {
  constructor(container, events) {
    this._container = container; // trip-events
    this._events = events; // array of objects with events
    this._eventsDaysList = new EventDaysContainer(); // контейнер для дней - trip-days

    this._sort = new Sort();
    this._sortType = `event`;

    this._filters = new Filters([DEFAULT_FILTER, FUTURE_FILTER, PAST_FILTER]);
    this._filters.setOnFilterCallback(this._onFilter.bind(this));
    this._selectedFilter = DEFAULT_FILTER;

    // Храним создаваемую карточку для определения состояния
    this._creatingEvent = null;
    this._subscriptions = [];
    this._statistics = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  startNewEventCreation() {
    if (this._creatingEvent === null) {
      this._creatingEvent = new NewEventController(this._container.querySelector(`.trip-days`), this._onDataChange);
      this._creatingEvent.init();
    }
  }

  finishNewEventCreation() {
    this._creatingEvent = null;
  }

  init() {
    this._filters.init();

    // Отрендерим сортировку
    render(this._container, this._sort.getElement(), Position.BEFORE_END);
    // Отрендерим контейнер для списка всех дней
    render(this._container, this._eventsDaysList.getElement(), Position.BEFORE_END);

    this._renderEventsByDays([...this._events]);

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderEvents(events) {
    const dayElement = new TripDayCard().getElement(); // li trip-days__item  day
    const eventsList = new EventsList().getElement(); // trip-events__list
    const dayInfo = new DayInfo().getElement();

    render(dayElement, dayInfo, Position.BEFORE_END);
    dayElement.querySelector(`.day__info`).innerHTML = ``;
    render(this._eventsDaysList.getElement(), dayElement, Position.BEFORE_END);

    events.forEach((tripEvent) => {
      render(dayElement, eventsList, Position.BEFORE_END);
      this._renderEvent(eventsList, tripEvent);
    });
  }

  _renderEventsByDays(events) {
    // Создадим объект с упорядоченными по датам массивами событий
    // { 2019-01-01: [ {event1}, {event2}, ... ], ... }
    const eventsByDays = events.reduce((acc, event) => {
      const key = moment(event.dateFrom).format(`YYYY-MM-DD`);
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
      const dayElement = new TripDayCard().getElement(); // li trip-days__item  day
      const dayInfo = new DayInfo(dateAsKey).getElement();
      const eventsList = new EventsList().getElement(); // trip-events__list

      render(this._eventsDaysList.getElement(), dayElement, Position.BEFORE_END);

      tripEvents.forEach((tripEvent) => {
        render(dayElement, dayInfo, Position.BEFORE_END);
        render(dayElement, eventsList, Position.BEFORE_END);
        this._renderEvent(eventsList, tripEvent);
      });
    });
  }

  _renderEvent(container, event) {
    const eventController = new EventController(
        container,
        event,
        this._onDataChange,
        this._onChangeView
    );
    eventController.init();
    this._subscriptions.push(eventController.closeEditForm.bind(eventController));
  }

  closeAllEvents() {
    this._onChangeView();
  }

  _getSortedEventsWithFilter() {
    let result = [];
    let filteredEvents = [];

    const currentTimestamp = new Date().getTime();

    switch (this._selectedFilter) {
      case FUTURE_FILTER:
        filteredEvents = [...this._events].filter(({dateFrom}) => {
          return dateFrom >= currentTimestamp;
        });
        break;

      case PAST_FILTER:
        filteredEvents = [...this._events].filter(({dateTo}) => {
          return dateTo < currentTimestamp;
        });
        break;

      default:
        filteredEvents = [...this._events];
    }

    switch (this._sortType) {
      case `time`:
        result = filteredEvents.sort((a, b) => {
          return (a.dateTo - a.dateFrom) - (b.dateTo - b.dateFrom);
        });
        break;

      case `price`:
        result = filteredEvents.sort((a, b) => a.price - b.price);
        break;

      case `event`:
        result = filteredEvents;
        break;
    }

    return result;
  }

  _render() {
    this._eventsDaysList.getElement().innerHTML = ``;

    const events = this._getSortedEventsWithFilter();

    if (this._sortType === `event`) {
      this._renderEventsByDays(events);
    } else {
      this._renderEvents(events);
    }

    this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = this._sortType === `event` ? `Day` : ``;
  }

  _onSortLinkClick(evt) {
    if (evt.target.dataset && evt.target.dataset[`sortType`]) {
      this._sortType = evt.target.dataset[`sortType`];
      this._render();
    }
  }

  _onFilter(evt) {
    const {value} = evt.currentTarget;
    if (this._filters.getAllowedFilters().includes(value)) {
      this._selectedFilter = value;
      this._render();
    }
  }

  _onDataChange(newData, oldData) {
    const index = this._events.findIndex((event) => {
      return event === oldData;
    });

    switch (true) {
      // Если newData равно null, то это значит, что элемент удален.
      // Создаем новый массив не включая в него удаленный элемент.
      case !newData && index > -1:
        this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
        break;

      case newData && index > -1:
        this._events[index] = newData;
        break;

      case newData && index === -1:
        this._events = [newData, ...this._events];
        break;
    }
    document.dispatchEvent(new CustomEvent(calculateTotalPriceEvtName, {detail: this._events}));
    document.dispatchEvent(new CustomEvent(renderItineraryEvtName, {detail: this._events}));
    this._render(this._events);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  toggleStatistics(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    document.dispatchEvent(new CustomEvent(menuClickEvtName, {detail: evt.target.textContent}));

    switch (evt.target.textContent) {
      case `Table`:
        if (this._statistics) {
          this._statistics.getElement().classList.add(`visually-hidden`);
          this._statistics.removeElement();
          this._statistics = null;
        }
        this._eventsDaysList.getElement().classList.remove(`visually-hidden`);
        break;

      case `Stats`:
        this._statistics = new Statistics([...this._events]);
        this._statistics.init();
        this._eventsDaysList.getElement().classList.add(`visually-hidden`);
        this._statistics.getElement().classList.remove(`visually-hidden`);
        break;
    }
  }
}
