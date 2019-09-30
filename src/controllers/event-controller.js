import {TripEvent} from "../components/trip-event";
import {TripEventEditing} from "../components/trip-event-editing";
import {Position, render} from "../utils";
import {AbstractEventController} from "./abstract-event-controller";

export class EventController extends AbstractEventController {
  constructor(container, event, onDataChange, onChangeView) {
    super(container, null, event, onDataChange);
    this._onChangeView = onChangeView;
    this._tripEvent = new TripEvent(event);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showEditForm = this._showEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
  }

  init() {
    this._tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._showEditForm();
      });

    render(this._container, this._tripEvent.getElement(), Position.BEFORE_END);
  }

  _onEscKeyDown(evt) {
    EventController._onEscKeyDown(evt, this.closeEditForm);
  }

  _showEditForm() {
    this._component = new TripEventEditing(this._data);
    render(this._tripEvent.getElement(), this._component.getElement());
    this._component.getElement()
      .querySelector(`form.event--edit`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        this._save(this._component.getData());
        this.closeEditForm();
      });

    this._component.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        // Вызываем внешний обработчик.
        // С помощью null сообщаем, что данные были удалены.
        this._onDataChange(null, this._data);
      });

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  closeEditForm() {
    if (this._component) {
      if (this._container.contains(this._component.getElement())) {
        this._container.replaceChild(this._tripEvent.getElement(), this._component.getElement());
      }
      this._component.removeElement();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
