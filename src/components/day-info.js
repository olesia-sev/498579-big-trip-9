import {AbstractComponent} from './absctract-component';
import moment from "moment";

export class DayInfo extends AbstractComponent {
  constructor(dateFrom) {
    super();
    this._dateFrom = new Date(dateFrom);
  }

  getTemplate() {
    return `<div class="day__info">
      <span class="day__counter">${moment(this._dateFrom).format(`DD`)}</span>
      <time class="day__date" datetime="${this._dateFrom.getFullYear()}-${this._dateFrom.getMonth() + 1}-${this._dateFrom.getDate()}">
        ${moment(this._dateFrom).format(`MMM YY`)}
      </time>
    </div>`;
  }
}
