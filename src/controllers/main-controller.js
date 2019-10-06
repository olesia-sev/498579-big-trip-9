import {TABS} from "../utils";
import {
  calculateTotalPriceEvtName,
  finishNewEventCreationEvtName,
  renderItineraryEvtName,
  Position,
  render,
  VISUALLY_HIDDEN_CLASS_NAME
} from "../utils";
import {getItineraryTemplate} from "../templates/other";
import Tabs from "../components/tabs";
import TripController from "./trip-controller";
import {getDestinations, getEvents, getOffers} from "../api";

export default class MainController {
  constructor() {
    this._isInitialized = false;
  }

  init() {
    // MainController инициализируем только один раз
    if (this._isInitialized) {
      throw new Error(`Main controller already initialized`);
    }

    this._isInitialized = true;

    const tripController = new TripController(document.querySelector(`.trip-events`));
    tripController.toggleLoadingMessage();

    this._setEventForPriceCalculation();
    this._setEventForItineraryRender();

    Promise.all([getEvents(), getDestinations(), getOffers()])
      .then(([allEvents, allDestinations, allOffers]) => {
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

        tripController.setEvents(events);
        tripController.setAllDestinations(allDestinations);
        tripController.setAllOffers(allOffers);

        this._dispatchEvents(events);
      })
      .catch(() => {
        this._dispatchEvents([]);
      })
      .finally(() => {
        document.querySelector(`.trip-info__cost`).classList.remove(VISUALLY_HIDDEN_CLASS_NAME);

        const tabs = new Tabs(TABS);
        tabs.setOnclickCallback((evt) => tripController.toggleStatistics(evt));
        tabs.init();

        tripController.init();

        const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);
        addNewEventButton.disabled = false;
        addNewEventButton.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          tripController.startNewEventCreation();
          tripController.closeAllEvents();
          addNewEventButton.disabled = true;
          tabs.disabledTabs();
        });
        document.addEventListener(finishNewEventCreationEvtName, () => {
          tripController.finishNewEventCreation();
          addNewEventButton.disabled = false;
          tabs.enableTabs();
        });
      });
  }

  /**
   * Рендерит контейнер с маршрутом
   * @private
   */
  _setEventForItineraryRender() {
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
   * @private
   */
  _setEventForPriceCalculation() {
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
   * @param {object[]} detail
   * @private
   */
  _dispatchEvents(detail) {
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
