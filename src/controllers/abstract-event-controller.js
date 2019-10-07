import {isEscEvent, shakeThat, hideError, showError} from "../utils";

export default class AbstractEventController {
  /**
   * @param {Element} container
   * @param {object} component
   * @param {object} event
   * @param {function} onChangeEventsState
   */
  constructor(container, component, event, onChangeEventsState) {
    if (new.target === AbstractEventController) {
      throw new Error(`Can"t instantiate AbstractComponent, only concrete one.`);
    }

    this._container = container;
    this._component = component;
    this._event = event;

    this._onChangeEventsState = onChangeEventsState;
  }

  init() {
    throw new Error(`init() method implementation required`);
  }

  /**
   * @param {object} newEvent
   */
  saveEvent(newEvent) {
    this._onChangeEventsState(newEvent, this._event);
  }

  deleteEvent() {
    this._onChangeEventsState(null, this._event);
  }

  /**
   * @param {Event} evt
   * @param {function} action
   */
  static onEscKeyDown(evt, action) {
    isEscEvent(evt, action);
  }

  /**
   * @param {HTMLElement} container
   * @param {NodeList} interactiveElements
   */
  static beforeRequestSending(container, interactiveElements) {
    hideError(container);
    interactiveElements.forEach((element) => {
      element.disabled = true;
    });
  }

  /**
   * @param {HTMLElement} container
   * @param {NodeList} interactiveElements
   */
  static afterRequestSending(container, interactiveElements) {
    shakeThat(container);
    showError(container);

    interactiveElements.forEach((element) => {
      element.disabled = false;
    });
  }
}
