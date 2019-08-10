import {getDayCardTemplate} from './trip-day-card';

export const getCardsContainerTemplate = () => {
  return `
  <ul class="trip-days">
    ${getDayCardTemplate()}
  </ul>`;
};
