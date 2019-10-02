import {DEFAULT_FILTER, FUTURE_FILTER, PAST_FILTER, getMenuItems} from '../data';
import {
  calculateTotalPriceEvtName,
  finishNewEventCreationEvtName,
  renderItineraryEvtName,
  Position,
  render
} from "../utils";
import {getItineraryTemplate} from '../templates/itinerary';
import Menu from '../components/menu';
import Filters from "../components/filters";
import TripController from './trip-controller';
import {getInitialEventsArray} from "../data";

export default class MainController {
  constructor() {
    this._started = false;
    this._data = null;
  }

  start() {
    // MainController инициализируем только один раз
    if (this._started) {
      throw new Error(`Already started`);
    }

    this._data = getInitialEventsArray();

    this._setEventForPriceCalculation();
    document.dispatchEvent(new CustomEvent(calculateTotalPriceEvtName, {detail: this._data}));

    this._setEventForItineraryRender();
    document.dispatchEvent(new CustomEvent(renderItineraryEvtName, {detail: this._data}));

    const tripController = new TripController(document.querySelector(`.trip-events`), this._data);
    tripController.init();

    const menu = new Menu(getMenuItems());
    menu.setOnclickCallback((evt) => tripController.toggleStatistics(evt));
    menu.init();

    const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);
    addNewEventButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      tripController.startNewEventCreation();
      tripController.closeAllEvents();
    });

    document.addEventListener(finishNewEventCreationEvtName, () => {
      tripController.finishNewEventCreation();
    });

    this._started = true;
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

  _setEventForPriceCalculation() {
    // Считает общую стоимость
    document.addEventListener(calculateTotalPriceEvtName, ({detail}) => {
      const totalPrice = detail.reduce((sum, event) => {
        sum += Number(event.price);
        sum += event.offers
          .reduce((offersSum, offer) => {
            if (offer.isApplied) {
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
}
