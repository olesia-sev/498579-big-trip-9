import AbstractComponent from './absctract-component';

export default class EventDaysContainer extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
