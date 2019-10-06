import AbstractComponent from "./absctract-component";
import {getChartConfig, Position, render, typesTo} from "../utils";
import Chart from "chart.js";
import moment from "moment";

export default class Statistics extends AbstractComponent {
  /**
   * @param {object[]} events
   */
  constructor(events) {
    super();

    this._events = events;
  }

  init() {
    if (this._events.length) {
      this._initMoneyChart();
      this._initTransportChart();
      this._initTimeSpendChart();

      render(
          document.querySelector(`.page-body__page-main .page-body__container`),
          this.getElement(),
          Position.BEFORE_END
      );
    }
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
  }

  /**
   * @private
   * @return {Chart}
   */
  _initMoneyChart() {
    const money = this._events.reduce((acc, {type, price}) => {
      let typeSum = 0;
      if (acc.has(type)) {
        typeSum = acc.get(type);
      }
      return acc.set(type, typeSum + price);
    }, new Map());

    return new Chart(this.getElement().querySelector(`.statistics__chart--money`), getChartConfig({
      labels: [...money.keys()],
      datasets: [{
        label: `€`,
        data: [...money.values()]
      }]
    }));
  }

  /**
   * @private
   * @return {Chart}
   */
  _initTransportChart() {
    const transport = this._events.reduce((acc, {type}) => {
      if (typesTo.has(type)) {
        return acc.set(type, acc.has(type) ? acc.get(type) + 1 : 1);
      }
      return acc;
    }, new Map());

    return new Chart(this.getElement().querySelector(`.statistics__chart--transport`), getChartConfig({
      labels: [...transport.keys()],
      datasets: [{
        label: `Times`,
        data: [...transport.values()]
      }]
    }));
  }

  /**
   * @private
   * @return {Chart}
   */
  _initTimeSpendChart() {
    const timeSpend = this._events.reduce((acc, {destination, dateFrom, dateTo}) => {
      let hours = 0;
      if (acc.has(destination.name)) {
        hours = acc.get(destination.name);
      }
      return acc.set(destination.name, hours + Math.floor(moment.duration(dateTo - dateFrom).asHours()));
    }, new Map());

    return new Chart(this.getElement().querySelector(`.statistics__chart--time`), getChartConfig({
      labels: [...timeSpend.keys()],
      datasets: [{
        label: `Hours`,
        data: [...timeSpend.values()]
      }]
    }));
  }
}
