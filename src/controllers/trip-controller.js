import moment from "moment";
import EventDaysContainer from "../components/trip-days-container";
import {render} from "../utils";
import {
  CustomEventName,
  Position,
  VISUALLY_HIDDEN_CLASS_NAME,
  FilterType,
  SortType
} from "../constants";
import TripDayCard from "../components/trip-day-card";
import DayInfo from "../components/day-info";
import EventsList from "../components/events-list";
import Sort from "../components/sort";
import EventController from "../controllers/event-controller";
import NewEventController from "./new-event-controller";
import Statistics from "../components/statistics";
import Filters from "../components/filters";
import {getEmptyMessageTemplate, getLoadingMessageTemplate} from "../templates/other";

export default class TripController {
  /**
   * @param {Element} container
   */
  constructor(container) {
    this._isInitialized = false;

    this._container = container;
    this._events = [];
    this._allDestinations = [];
    this._allOffers = [];

    this._eventsDaysList = new EventDaysContainer();

    this._sort = new Sort(Object.values(SortType));
    this._sort.setOnSortCallback(this._onSort.bind(this));
    this._selectedSortType = SortType.DEFAULT;

    this._filters = new Filters(Object.values(FilterType));
    this._filters.setOnFilterCallback(this._onFilter.bind(this));
    this._selectedFilterType = FilterType.DEFAULT;

    // Храним создаваемую карточку для определения состояния
    this._creatingEvent = null;
    this._closeEventsCallbacks = [];
    this._statistics = null;
    this._tripSortContainer = null;
    this._tripFiltersContainer = null;

    this._onChangeEventsState = this._onChangeEventsState.bind(this);
    this._onFinishEdit = this._onFinishEdit.bind(this);
  }

  /**
   * @param {object[]} events
   */
  setEvents(events) {
    this._events = events;
  }

  /**
   * @param {object[]} destinations
   */
  setAllDestinations(destinations) {
    this._allDestinations = destinations;
  }

  /**
   * @param {object[]} offers
   */
  setAllOffers(offers) {
    this._allOffers = offers;
  }

  init() {
    // TripController инициализируем только один раз
    if (this._isInitialized) {
      throw new Error(`Trip controller already initialized`);
    }

    this._isInitialized = true;

    this._filters.init();
    this._sort.init();

    this._tripSortContainer = document.querySelector(`.trip-events__trip-sort`);
    this._tripFiltersContainer = document.querySelector(`.trip-filters`);

    // Отрендерим контейнер для списка всех дней
    render(this._container, this._eventsDaysList.getElement(), Position.BEFORE_END);

    this._renderEventsByDays([...this._events]);

    this.toggleLoadingMessage();
  }

  startNewEventCreation() {
    if (this._creatingEvent === null) {
      this._creatingEvent = new NewEventController(
          this._container.querySelector(`.trip-days`),
          this._onChangeEventsState,
          this._allDestinations,
          this._allOffers
      );

      this._closeAllEvents();

      this._creatingEvent.init();

      this.toggleEmptyPageMessage();

      document.querySelectorAll(`.event__rollup-btn`).forEach((button) => {
        button.disabled = true;
        button.classList.add(VISUALLY_HIDDEN_CLASS_NAME);
      });
    }
  }

  finishNewEventCreation() {
    this._creatingEvent = null;

    this.toggleEmptyPageMessage();

    document.querySelectorAll(`.event__rollup-btn`).forEach((button) => {
      button.disabled = false;
      button.classList.remove(VISUALLY_HIDDEN_CLASS_NAME);
    });
  }

  toggleLoadingMessage() {
    const element = document.querySelector(`.js-loading-message`);

    if (element) {
      element.parentNode.removeChild(element);
    } else {
      render(this._container, getLoadingMessageTemplate(), Position.BEFORE_END);
    }
  }

  toggleEmptyPageMessage() {
    this._toggleSortAndFilterContainer();

    if (this._events.length === 0) {
      const element = document.querySelector(`.js-empty-message`);

      if (element) {
        element.parentNode.removeChild(element);
      } else {
        render(this._container, getEmptyMessageTemplate(), Position.BEFORE_END);
      }
    }
  }

  _closeAllEvents() {
    this._onFinishEdit();
  }

  /**
   * @param {Event} evt
   */
  toggleStatistics(evt) {
    evt.preventDefault();

    const {textContent} = evt.target;

    document.dispatchEvent(new CustomEvent(CustomEventName.TAB_CLICK, {detail: textContent}));

    const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

    if (textContent === `Stats`) {
      this._statistics = new Statistics([...this._events]);
      this._statistics.init();
      this._eventsDaysList.getElement().classList.add(VISUALLY_HIDDEN_CLASS_NAME);
      this._statistics.getElement().classList.remove(VISUALLY_HIDDEN_CLASS_NAME);
      addNewEventButton.disabled = true;
      this._toggleSortAndFilterContainer(`hide`);
    } else {
      if (this._statistics) {
        const statisticsElement = this._statistics.getElement();
        if (statisticsElement) {
          statisticsElement.parentNode.removeChild(statisticsElement);
        }
        this._statistics.removeElement();
        this._statistics = null;
      }
      this._eventsDaysList.getElement().classList.remove(VISUALLY_HIDDEN_CLASS_NAME);
      addNewEventButton.disabled = false;
      this._toggleSortAndFilterContainer(`show`);
    }
  }

  _toggleSortAndFilterContainer(action) {
    const show = () => {
      this._tripFiltersContainer.classList.remove(VISUALLY_HIDDEN_CLASS_NAME);
      this._tripSortContainer.classList.remove(VISUALLY_HIDDEN_CLASS_NAME);
    };

    const hide = () => {
      this._tripFiltersContainer.classList.add(VISUALLY_HIDDEN_CLASS_NAME);
      this._tripSortContainer.classList.add(VISUALLY_HIDDEN_CLASS_NAME);
    };

    const isLengthValid = this._events.length > 0;

    switch (true) {
      case action === `show` && isLengthValid:
        show();
        break;

      case action === `hide` && isLengthValid:
        hide();
        break;

      default:
        if (isLengthValid) {
          show();
        } else {
          hide();
        }
    }
  }

  /**
   * @param {object[]} events
   * @private
   */
  _renderEvents(events) {
    const dayElement = new TripDayCard().getElement();
    const eventsList = new EventsList().getElement();

    const dayInfo = new DayInfo(``).getElement();
    render(dayElement, dayInfo, Position.BEFORE_END);

    dayElement.querySelector(`.day__info`).innerHTML = ``;
    render(this._eventsDaysList.getElement(), dayElement, Position.BEFORE_END);

    events.forEach((tripEvent) => {
      render(dayElement, eventsList, Position.BEFORE_END);
      this._renderEvent(eventsList, tripEvent);
    });
  }

  /**
   * @param {object[]} events
   * @private
   */
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

  /**
   * @param {Element} container
   * @param {object} event
   * @private
   */
  _renderEvent(container, event) {
    const eventController = new EventController(
        container,
        event,
        this._allDestinations,
        this._allOffers,
        this._onChangeEventsState,
        this._onFinishEdit
    );
    eventController.init();
    this._closeEventsCallbacks.push(eventController.closeEditForm.bind(eventController));
  }

  /**
   * @return {object[]}
   * @private
   */
  _getSortedEventsWithFilter() {
    const currentTimestamp = Date.now();

    const getFilteredEvents = (events) => {
      switch (this._selectedFilterType) {
        // Список запланированных точек маршрута, т. е. точек,
        // у которых дата начала события больше, чем текущая
        case FilterType.FUTURE: {
          return events.filter(({dateFrom}) => dateFrom > currentTimestamp);
        }

        // Список пройденных точек маршрута, т. е. точек,
        // у которых дата прибытия в точку маршрута меньше, чем текущая;
        case FilterType.PAST: {
          return events.filter(({dateTo}) => dateTo < currentTimestamp);
        }

        default: {
          return events;
        }
      }
    };

    // Сортировка работает в одном направлении — от максимального к минимальному
    switch (this._selectedSortType) {
      // При сортировке по длительности в начале списка окажутся самые долгие точки маршрута
      case SortType.TIME: {
        return getFilteredEvents([...this._events]).sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      }

      // При сортировке по стоимости в начале списка окажутся самые дорогие точки маршрута
      case SortType.PRICE: {
        return getFilteredEvents([...this._events]).sort((a, b) => b.price - a.price);
      }

      // Разбивка по дням
      default: {
        return getFilteredEvents([...this._events]).sort(TripController._defaultSort);
      }
    }
  }

  /**
   * @private
   */
  _render() {
    this._eventsDaysList.getElement().innerHTML = ``;

    if (this._events.length) {
      const tripSortItemDay = document.querySelector(`.trip-sort__item--day`);

      if (this._selectedSortType === SortType.DEFAULT) {
        tripSortItemDay.textContent = `Day`;
        this._renderEventsByDays(this._getSortedEventsWithFilter());
      } else {
        this._renderEvents(this._getSortedEventsWithFilter());
        tripSortItemDay.textContent = ``;
      }

      this._tripSortContainer.classList.remove(VISUALLY_HIDDEN_CLASS_NAME);
    } else {
      this._tripSortContainer.classList.add(VISUALLY_HIDDEN_CLASS_NAME);
    }

    this.toggleEmptyPageMessage();
  }

  /**
   * @param {Event} evt
   * @private
   */
  _onSort(evt) {
    const {value} = evt.currentTarget;

    if (this._sort.getAllowedSortType().includes(value)) {
      this._selectedSortType = value;
      this._render();
    }
  }

  /**
   * @param {Event} evt
   * @private
   */
  _onFilter(evt) {
    const {value} = evt.currentTarget;
    if (this._filters.getAllowedFilterType().includes(value)) {
      this._selectedFilterType = value;
      this._render();
    }
  }

  /**
   * @param {object} newEvent
   * @param {object} oldEvent
   * @private
   */
  _onChangeEventsState(newEvent, oldEvent) {
    const index = this._events.findIndex((event) => event === oldEvent);

    switch (true) {
      // Если newEvent равно null, то это значит, что элемент удален.
      // Создаем новый массив не включая в него удаленный элемент.
      case !newEvent && index > -1:
        this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
        break;

      case newEvent && index > -1:
        this._events[index] = newEvent;
        break;

      case newEvent && index === -1:
        this._events = [newEvent, ...this._events];
        break;
    }

    this._events = this._events.sort(TripController._defaultSort);

    document.dispatchEvent(new CustomEvent(CustomEventName.CALCULATE_TOTAL_PRICE, {detail: this._events}));
    document.dispatchEvent(new CustomEvent(CustomEventName.RENDER_ITINERARY, {detail: this._events}));
    this._render();
  }

  /**
   * @private
   */
  _onFinishEdit() {
    this._closeEventsCallbacks.forEach((callback) => callback());
  }

  /**
   * @param {object} a
   * @param {object} b
   * @return {number}
   * @private
   */
  static _defaultSort(a, b) {
    return a.dateFrom - b.dateFrom;
  }
}
