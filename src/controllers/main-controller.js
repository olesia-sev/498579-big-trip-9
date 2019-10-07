import TripController from "./trip-controller";
import Tabs from "../components/tabs";
import {getDestinations, getEvents, getOffers} from "../api";
import {render} from "../utils";
import {
  TABS,
  calculateTotalPriceEvtName,
  finishNewEventCreationEvtName,
  renderItineraryEvtName,
  Position,
  VISUALLY_HIDDEN_CLASS_NAME
} from "../constants";
import {getItineraryTemplate} from "../templates/other";

export default class MainController {
  constructor() {
    this._isInitialized = false;
    this._tripController = null;

    this._processSuccessfulResponse = this._processSuccessfulResponse.bind(this);
    this._processFinishResponse = this._processFinishResponse.bind(this);
  }

  init() {
    // MainController инициализируем только один раз
    if (this._isInitialized) {
      throw new Error(`Main controller already initialized`);
    }

    this._isInitialized = true;

    this._tripController = new TripController(document.querySelector(`.trip-events`));
    this._tripController.toggleLoadingMessage();

    MainController._setEventForPriceCalculation();
    MainController._setEventForItineraryRender();

    Promise.all([getEvents(), getDestinations(), getOffers()])
      .then(this._processSuccessfulResponse)
      .catch(() => {
        MainController._dispatchEvents([]);
      })
      .finally(this._processFinishResponse);
  }

  /**
   * @param {array} allDataFromResponse
   * @private
   */
  _processSuccessfulResponse([allEvents, allDestinations, allOffers]) {
    const events = allEvents.map((event) => {
      // Офферы из массива allOffers, которые соответствуют типу event
      const allOffersWithEventType = allOffers.find(({type}) => type === event.type);

      if (
        allOffersWithEventType &&
          Array.isArray(allOffersWithEventType.offers) &&
          allOffersWithEventType.offers.length > 0
      ) {
        return Object.assign({}, event, {
          offers: MainController._mergeOffers(event.offers, allOffersWithEventType.offers)
        });
      }

      return event;
    });

    this._tripController.setEvents(events);
    this._tripController.setAllDestinations(allDestinations);
    this._tripController.setAllOffers(allOffers);

    MainController._dispatchEvents(events);
  }

  _processFinishResponse() {
    document.querySelector(`.trip-info__cost`).classList.remove(VISUALLY_HIDDEN_CLASS_NAME);

    const tabs = new Tabs(TABS);
    tabs.setOnclickCallback((evt) => this._tripController.toggleStatistics(evt));
    tabs.init();

    this._tripController.init();

    const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);
    addNewEventButton.disabled = false;
    addNewEventButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._tripController.startNewEventCreation();
      addNewEventButton.disabled = true;
      tabs.disabledTabs();
    });
    document.addEventListener(finishNewEventCreationEvtName, () => {
      this._tripController.finishNewEventCreation();
      addNewEventButton.disabled = false;
      tabs.enableTabs();
    });
  }

  /**
   * @private
   */
  static _setEventForPriceCalculation() {
    // Считает общую стоимость
    document.addEventListener(calculateTotalPriceEvtName, ({detail}) => {
      const totalPrice = detail.reduce((sum, event) => {
        sum += Number(event.price);
        sum += event.offers
          .reduce((offersSum, offer) => {
            if (offer.accepted) {
              offersSum += Number(offer.price);
            }
            return offersSum;
          }, 0);
        return sum;
      }, 0);
      // Вставляет общую стоимость в шапку
      document.querySelector(`.trip-info__cost-value`).textContent = totalPrice.toString();
    });
  }

  /**
   * Рендерит контейнер с маршрутом
   * @private
   */
  static _setEventForItineraryRender() {
    document.addEventListener(renderItineraryEvtName, ({detail}) => {
      const container = document.querySelector(`.trip-info__main`);
      if (container) {
        container.parentNode.removeChild(container);
      }
      if (detail && detail.length) {
        const template = getItineraryTemplate(detail);
        render(document.querySelector(`.trip-info`), template, Position.AFTER_BEGIN);
      }
    });
  }

  /**
   * @param {object[]} detail
   * @private
   */
  static _dispatchEvents(detail) {
    document.dispatchEvent(new CustomEvent(calculateTotalPriceEvtName, {detail}));
    document.dispatchEvent(new CustomEvent(renderItineraryEvtName, {detail}));
  }

  /**
   * Поскольку с api `/offers` приходит набор offer`ов, отличный от того, который приходит от `/points` в event,
   * смержим два этих массива данных, с условием, что данные конкретного offer`а из event`а приоритетнее,
   * чем offer`ы из `/offers`.
   * @param {object[]} eventOffers
   * @param {object[]} allOffersWithEventType
   * @return {object[]}
   * @private
   */
  static _mergeOffers(eventOffers, allOffersWithEventType) {
    const offers = eventOffers.reduce((acc, offer) => {
      return acc.set(offer.title, offer);
    }, new Map());

    const allOffers = allOffersWithEventType.reduce((acc, offer) => {
      return acc.set(offer.title, offer);
    }, new Map());

    return Array.from(new Map([...allOffers, ...offers]).values());
  }
}
