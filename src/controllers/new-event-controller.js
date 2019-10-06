import TripEventEditing from "../components/trip-event-editing";
import {Position, Mode, render, finishNewEventCreationEvtName} from "../utils";
import AbstractEventController from "./abstract-event-controller";
import {createEvent} from "../api";

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
    const interactiveElements = element.querySelectorAll(`input, button`);

    const closeForm = () => {
      this._component.flatpickrDestroy();
      element.parentNode.removeChild(element);
      document.removeEventListener(`keydown`, onEscKeyDown);
      document.dispatchEvent(new CustomEvent(finishNewEventCreationEvtName));
    };

    element.addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      if (this._component.isEventValid()) {
        NewEventController.beforeRequestSending(element, interactiveElements);
        this._component.setSubmitButtonText();

        createEvent(this._component.getEvent())
          .then(({id}) => {
            this.saveEvent(Object.assign({}, this._component.getEvent(), {id}));
            closeForm();
          })
          .catch(() => {
            NewEventController.afterRequestSending(element, interactiveElements);
            this._component.setDefaultSubmitButtonText();
          });
      }
    });

    element.addEventListener(`reset`, (evt) => {
      evt.preventDefault();
      closeForm();
    });

    render(this._container, element, Position.BEFORE_BEGIN);
  }
}
