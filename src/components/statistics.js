import {AbstractComponent} from "./absctract-component";
import {clone, Position, render} from '../utils';
import {chartMoneyConfig} from '../configs/chart-money-config';
import {chartTransportConfig} from '../configs/chart-transport-config';
import {chartTimeSpendConfig} from '../configs/chart-time-config';
import {typesTo} from '../data';
import Chart from 'chart.js';
import moment from "moment";

export class Statistics extends AbstractComponent {
  /**
   * @param {object[]} events
   */
  constructor(events) {
    super();

    this._data = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._moneyChartElem = this.getElement().querySelector(`.statistics__chart--money`);
    this._transportChartElem = this.getElement().querySelector(`.statistics__chart--transport`);
    this._timeSpendChartElem = this.getElement().querySelector(`.statistics__chart--time`);

  }

  init() {
    this._initMoneyChart();
    this._initTransportChart();
    this._initTimeSpendChart();

    // Рендерит контейнер со статистикой
    const pageMainContainer = document.querySelector(`.page-body__page-main`).querySelector(`.page-body__container`);
    render(pageMainContainer, this.getElement(), Position.BEFORE_END);
  }

  _initMoneyChart() {
    const moneyMap = this._data.reduce((acc, {type, price}) => {
      let typeSum = 0;
      if (acc.has(type)) {
        typeSum = acc.get(type);
      }
      return acc.set(type, typeSum + price);
    }, new Map());

    const config = clone(chartMoneyConfig);
    config.data.labels = [...moneyMap.keys()];
    config.data.datasets[0] = {
      label: `€`,
      data: [...moneyMap.values()]
    };

    this._moneyChart = new Chart(this._moneyChartElem, config);
  }

  _initTransportChart() {
    const transportMap = this._data.reduce((acc, {type}) => {
      if (typesTo.has(type)) {
        return acc.set(type, acc.has(type) ? acc.get(type) + 1 : 1);
      }
      return acc;
    }, new Map());

    const config = clone(chartTransportConfig);
    config.data.labels = [...transportMap.keys()];
    config.data.datasets[0] = {
      data: [...transportMap.values()]
    };

    this._transportChart = new Chart(this._transportChartElem, config);
  }

  _initTimeSpendChart() {
    const timeSpendMap = this._data.reduce((acc, {city, dateFrom, dateTo}) => {
      let hours = 0;
      if (acc.has(city)) {
        hours = acc.get(city);
      }
      const duration = moment.duration(dateTo - dateFrom);

      return acc.set(city, hours + Math.floor(duration.asHours()));
    }, new Map());

    const config = clone(chartTimeSpendConfig);
    config.data.labels = [...timeSpendMap.keys()];
    config.data.datasets[0] = {
      data: [...timeSpendMap.values()]
    };

    this._transportChart = new Chart(this._timeSpendChartElem, config);
  }

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
}
