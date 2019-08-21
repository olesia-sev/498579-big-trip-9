import {getTripEvent, getMenuData, getFiltersData} from './data.js';

import {getItineraryTemplate} from './components/itinerary.js';
import {getMenuTemplate} from './components/menu.js';
import {getFiltersTemplate} from './components/filters.js';

import {getSortTemplate} from './components/sort';
import {getCardsContainerTemplate} from './components/trip-days-container';
import {getTripEventTemplate} from './components/trip-event.js';

const renderTemplate = (place, container, markup) => {
  container.insertAdjacentHTML(place, markup);
};

const menuContainerTitles = document.querySelectorAll(`.trip-controls h2`);
renderTemplate(`afterend`, menuContainerTitles[0], getMenuTemplate(getMenuData()));

renderTemplate(`afterend`, menuContainerTitles[1], getFiltersTemplate(getFiltersData()));

const mainContainer = document.querySelector(`.trip-events`);
renderTemplate(`beforeend`, mainContainer, getSortTemplate());

renderTemplate(`beforeend`, mainContainer, getCardsContainerTemplate());

const CARDS_AMOUNT = 3;
const tripEventsContainer = document.querySelector(`.trip-events__list`);

export const eventsArray = new Array(CARDS_AMOUNT)
  .fill(``)
  .map(getTripEvent)
  .sort((a, b) => a.dateFrom - b.dateFrom);

eventsArray.forEach((event) => {
  renderTemplate(`beforeend`, tripEventsContainer, getTripEventTemplate(event));
});

const itineraryContainer = document.querySelector(`.trip-info`);
renderTemplate(`afterbegin`, itineraryContainer, getItineraryTemplate(eventsArray));

const calculateTotalPrice = () => {
  let totalPrice = 0;
  eventsArray.forEach((item) => {
    totalPrice += item.price;

    item.offers.forEach((offer) => {
      if (offer.isApplied) {
        totalPrice += offer.price;
      }
    });
  });
  return totalPrice;
};
calculateTotalPrice();

document.querySelector(`.trip-info__cost-value`).textContent = calculateTotalPrice();
