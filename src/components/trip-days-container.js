import {AbstractComponent} from './absctract-component';

export class EventDaysContainer extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
