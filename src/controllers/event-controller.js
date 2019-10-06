import TripEvent from "../components/trip-event";
import TripEventEditing from "../components/trip-event-editing";
import {Position, render} from "../utils";
import AbstractEventController from "./abstract-event-controller";
import {deleteEvent, updateEvent} from "../api";

export default class EventController extends AbstractEventController {
  /**
   * @param {Element} container
   * @param {object} event
   * @param {object[]} allDestinations
   * @param {object[]} allOffers
   * @param {function} onChangeEventsState
   * @param {function} onFinishEdit
   */
  constructor(container, event, allDestinations, allOffers, onChangeEventsState, onFinishEdit) {
    super(container, null, event, onChangeEventsState);

    this._tripEvent = new TripEvent(event);
    this._allDestinations = allDestinations;
    this._allOffers = allOffers;
    this._onFinishEdit = onFinishEdit;

    this._onEscKeyDownEventHandler = this._onEscKeyDownEventHandler.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
  }

  init() {
    this._tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onFinishEdit();
        this.showEditForm();
      });

    render(this._container, this._tripEvent.getElement(), Position.BEFORE_END);
  }

  closeEditForm() {
    if (this._component) {
      if (this._container.contains(this._component.getElement())) {
        this._container.replaceChild(this._tripEvent.getElement(), this._component.getElement());
      }
      this._component.removeElement();
      document.removeEventListener(`keydown`, this._onEscKeyDownEventHandler);
    }
  }

  showEditForm() {
    this._component = new TripEventEditing(this._event, this._allDestinations, this._allOffers);

    render(this._tripEvent.getElement(), this._component.getElement());

    const container = this._component.getElement().querySelector(`form.event--edit`);
    const interactiveElements = container.querySelectorAll(`input, button`);

    container.addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      if (this._component.isEventValid()) {
        EventController.beforeRequestSending(container, interactiveElements);
        this._component.setSubmitButtonText();

        updateEvent(this._component.getEvent())
          .then(() => {
            this.saveEvent(this._component.getEvent());
            this.closeEditForm();
          })
          .catch(() => {
            EventController.afterRequestSending(container, interactiveElements);
            this._component.setDefaultSubmitButtonText();
          });
      }
    });

    container.addEventListener(`reset`, (evt) => {
      evt.preventDefault();

      EventController.beforeRequestSending(container, interactiveElements);
      this._component.setResetButtonText();

      deleteEvent(this._event.id)
        .then(() => {
          this.deleteEvent();
        })
        .catch(() => {
          EventController.afterRequestSending(container, interactiveElements);
          this._component.setDefaultResetButtonText();
        });
    });

    document.addEventListener(`keydown`, this._onEscKeyDownEventHandler);
  }

  /**
   * @param {Event} evt
   * @private
   */
  _onEscKeyDownEventHandler(evt) {
    EventController.onEscKeyDown(evt, this.closeEditForm);
  }
}
