import Chart from "chart.js";
import moment from "moment";
import AbstractComponent from "./absctract-component";
import {getChartConfig, render} from "../utils";
import {Position, typesTo} from "../constants";

export default class Statistics extends AbstractComponent {
  /**
   * @param {object[]} events
   */
  constructor(events) {
    super();
    this._events = events;
    this._chartData = {
      money: new Map(),
      transport: new Map(),
      timeSpend: new Map()
    };
  }

  init() {
    if (this._events.length) {
      this._chartData = this._events.reduce((acc, event) => ({
        money: Statistics._reduceMoney(acc.money, event),
        transport: Statistics._reduceTransport(acc.transport, event),
        timeSpend: Statistics._reduceTimeSpend(acc.timeSpend, event)
      }), this._chartData);

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
    return new Chart(this.getElement().querySelector(`.statistics__chart--money`), getChartConfig({
      labels: [...this._chartData.money.keys()],
      datasets: [{
        label: `€`,
        data: [...this._chartData.money.values()],
        fill: false,
        borderWidth: 1
      }]
    }));
  }

  /**
   * @private
   * @return {Chart}
   */
  _initTransportChart() {
    return new Chart(this.getElement().querySelector(`.statistics__chart--transport`), getChartConfig({
      labels: [...this._chartData.transport.keys()],
      datasets: [{
        label: `Times`,
        data: [...this._chartData.transport.values()],
        fill: false,
        borderWidth: 1
      }]
    }));
  }

  /**
   * @private
   * @return {Chart}
   */
  _initTimeSpendChart() {
    return new Chart(this.getElement().querySelector(`.statistics__chart--time`), getChartConfig({
      labels: [...this._chartData.timeSpend.keys()],
      datasets: [{
        label: `Hours`,
        data: [...this._chartData.timeSpend.values()],
        fill: false,
        borderWidth: 1
      }]
    }));
  }

  /**
   * @param {Map} acc
   * @param {object} event
   * @return {Map}
   * @private
   */
  static _reduceMoney(acc, {type, price}) {
    let typeSum = 0;
    if (acc.has(type)) {
      typeSum = acc.get(type);
    }
    return acc.set(type, typeSum + price);
  }

  /**
   * @param {Map} acc
   * @param {object} event
   * @return {Map}
   * @private
   */
  static _reduceTransport(acc, {type}) {
    if (typesTo.has(type)) {
      return acc.set(type, acc.has(type) ? acc.get(type) + 1 : 1);
    }
    return acc;
  }

  /**
   * @param {Map} acc
   * @param {object} event
   * @return {Map}
   * @private
   */
  static _reduceTimeSpend(acc, {destination, dateFrom, dateTo}) {
    let hours = 0;
    if (acc.has(destination.name)) {
      hours = acc.get(destination.name);
    }
    return acc.set(destination.name, hours + Math.floor(moment.duration(dateTo - dateFrom).asHours()));
  }
}
