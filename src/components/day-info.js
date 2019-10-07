import moment from "moment";
import AbstractComponent from "./absctract-component";

export default class DayInfo extends AbstractComponent {
  /**
   * @param {string|number} dateFrom
   */
  constructor(dateFrom) {
    super();
    this._dateFrom = dateFrom;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    let template = ``;

    if (this._dateFrom) {
      template = `<span class="day__counter">${moment(this._dateFrom).format(`DD`)}</span>
      <time class="day__date" datetime="${moment(this._dateFrom).format(`YYYY-MM-DD`)}">
        ${moment(this._dateFrom).format(`MMM YY`)}
      </time>`;
    }

    return `<div class="day__info">${template}</div>`;
  }
}
