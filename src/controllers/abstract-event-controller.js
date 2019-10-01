import {isEscEvent} from "../utils";

export default class AbstractEventController {
  constructor(container, component, data, onDataChange) {
    if (new.target === AbstractEventController) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._container = container;
    this._component = component;
    this._data = data;

    this._onDataChange = onDataChange;
  }

  _save(newData) {
    this._onDataChange(newData, this._data);
  }

  static _onEscKeyDown(evt, action) {
    isEscEvent(evt, action);
  }

  init() {
    throw new Error(`init() method implementation required`);
  }
}
