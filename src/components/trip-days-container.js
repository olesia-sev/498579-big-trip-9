import {getDayCardTemplate} from './trip_day_card';

export const getCardsContainerTemplate = () => {
  return `
  <ul class="trip-days">
    ${getDayCardTemplate()}
  </ul>`;
};
