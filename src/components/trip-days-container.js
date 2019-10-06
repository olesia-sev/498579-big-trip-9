import AbstractComponent from "./absctract-component";

export default class EventDaysContainer extends AbstractComponent {
  /**
   * @return {string}
   */
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
