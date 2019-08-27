import {AbstractComponent} from './absctract-component';
import {monthShortNames} from '../data';

export class DayElement extends AbstractComponent {

  constructor(dateFrom) {
    super();
    this._dateFrom = new Date(dateFrom);
  }

  getTemplate() {

    return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${this._dateFrom .getDate()}</span>
      <time class="day__date" datetime="${this._dateFrom .getFullYear()}-${this._dateFrom .getMonth() + 1}-${this._dateFrom .getDate()}">
        ${monthShortNames[this._dateFrom .getMonth()]} ${this._dateFrom .getFullYear()}
      </time>
    </div>
  </li>`;
  }
}
