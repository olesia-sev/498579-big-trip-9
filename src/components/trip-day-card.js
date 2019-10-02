import AbstractComponent from './absctract-component';

export default class TripDayCard extends AbstractComponent {
  getTemplate() {
    return `<li class="trip-days__item  day"></li>`;
  }
}
