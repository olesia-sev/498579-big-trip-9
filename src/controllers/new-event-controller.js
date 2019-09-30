import {TripEventEditing} from "../components/trip-event-editing";
import {Position, Mode, render, finishNewEventCreationEvtName} from "../utils";
import {AbstractEventController} from "./abstract-event-controller";

export class NewEventController extends AbstractEventController {
  constructor(container, onDataChange) {
    const date = new Date().getTime();
    const event = {
      type: ``,
      city: ``,
      dateFrom: date,
      dateTo: date,
      price: 0,
      offers: [],
      isFavourite: false,
      mode: Mode.ADDING
    };
    super(container, new TripEventEditing(event), event, onDataChange);
  }

  init() {
    const onEscKeyDown = (evt) => {
      NewEventController._onEscKeyDown(evt, closeForm);
    };

    const element = this._component.getElement();

    const closeForm = () => {
      element.parentNode.removeChild(element);
      document.removeEventListener(`keydown`, onEscKeyDown);
      document.dispatchEvent(new CustomEvent(finishNewEventCreationEvtName));
    };

    element.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      this._save(this._component.getData());
      closeForm();
    });

    element.querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        closeForm();
      });

    render(this._container, element, Position.BEFORE_BEGIN);
  }
}
