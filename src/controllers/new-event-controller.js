import TripEventEditing from "../components/trip-event-editing";
import {Position, Mode, render, finishNewEventCreationEvtName} from "../utils";
import AbstractEventController from "./abstract-event-controller";

export default class NewEventController extends AbstractEventController {
  /**
   * @param {Element} container
   * @param {function} onChangeEventsState
   * @param {object[]} allDestinations
   * @param {object[]} allOffers
   */
  constructor(container, onChangeEventsState, allDestinations, allOffers) {
    const date = Date.now();
    const event = {
      type: ``,
      destination: {
        name: ``,
        description: ``,
        pictures: [],
      },
      dateFrom: date,
      dateTo: date,
      price: 0,
      offers: [],
      isFavorite: false,
      mode: Mode.ADDING
    };
    super(container, new TripEventEditing(event, allDestinations, allOffers), event, onChangeEventsState);
  }

  init() {
    const onEscKeyDown = (evt) => {
      NewEventController.onEscKeyDown(evt, closeForm);
    };

    const element = this._component.getElement();

    const closeForm = () => {
      element.parentNode.removeChild(element);
      document.removeEventListener(`keydown`, onEscKeyDown);
      document.dispatchEvent(new CustomEvent(finishNewEventCreationEvtName));
    };

    element.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      if (this._component.isEventValid()) {
        this.saveEvent(this._component.getEvent());
        closeForm();
      }
    });

    element.querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        closeForm();
      });

    render(this._container, element, Position.BEFORE_BEGIN);
  }
}
