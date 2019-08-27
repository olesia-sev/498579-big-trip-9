import {AbstractComponent} from './absctract-component';

export class EventsList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-events__list"> </ul>`;
  }
}
