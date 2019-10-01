import AbstractComponent from './absctract-component';
import moment from "moment";

export default class DayInfo extends AbstractComponent {
  constructor(dateFrom) {
    super();
    this._dateFrom = dateFrom;
  }

  getTemplate() {
    return `<div class="day__info">
      <span class="day__counter">${moment(this._dateFrom).format(`DD`)}</span>
      <time class="day__date" datetime="${moment(this._dateFrom).format(`YYYY-MM-DD`)}">
        ${moment(this._dateFrom).format(`MMM YY`)}
      </time>
    </div>`;
  }
}
