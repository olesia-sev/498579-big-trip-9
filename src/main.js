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

const itineraryContainer = document.querySelector(`.trip-info`);
renderTemplate(`afterbegin`, itineraryContainer, getItineraryTemplate());

const menuContainerTitles = document.querySelectorAll(`.trip-controls h2`);
renderTemplate(`afterend`, menuContainerTitles[0], getMenuTemplate(getMenuData()));

renderTemplate(`afterend`, menuContainerTitles[1], getFiltersTemplate(getFiltersData()));

const mainContainer = document.querySelector(`.trip-events`);
renderTemplate(`beforeend`, mainContainer, getSortTemplate());

renderTemplate(`beforeend`, mainContainer, getCardsContainerTemplate());

const CARDS_AMOUNT = 3;
const tripEventsContainer = document.querySelector(`.trip-events__list`);

const sortEventsByDate = (a, b) => {
  if (a.dateFrom > b.dateFrom) {
    return 1;
  }
  if (a.dateFrom < b.dateFrom) {
    return -1;
  }
  return 0;
};

const getEventsArray = () => {
  const eventsArray = [];
  for (let i = 0; i < CARDS_AMOUNT; i++) {
    eventsArray.push(getTripEvent());
  }
  return eventsArray.sort(sortEventsByDate);
};

getEventsArray().forEach((event) => {
  renderTemplate(`beforeend`, tripEventsContainer, getTripEventTemplate(event));
});

const getTotalPrice = () => {
  const totalPriceContainer = document.querySelector(`.trip-info__cost-value`);
  const eventPrice = document.querySelectorAll(`.event__price-value`);
  let totalPrice = 0;
  for (let i = 0; i <= eventPrice.length - 1; i++) {
    totalPrice += Number(eventPrice[i].textContent);
  }
  totalPriceContainer.textContent = totalPrice.toString();
};
getTotalPrice();
