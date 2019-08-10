import {getItineraryTemplate} from './components/itinerary.js';
import {getMenuTemplate} from './components/menu.js';
import {getFiltersTemplate} from './components/filters.js';

import {getSortTemplate} from './components/sort';
import {getCardsContainerTemplate} from './components/trip-days-container';
import {getTripEventTemplate} from './components/trip_event.js';

const renderTemplate = (place, container, markup) => {
  container.insertAdjacentHTML(place, markup);
};

const itineraryContainer = document.querySelector(`.trip-info`);
renderTemplate(`afterbegin`, itineraryContainer, getItineraryTemplate());

const menuContainerTitles = document.querySelectorAll(`.trip-controls h2`);
renderTemplate(`afterend`, menuContainerTitles[0], getMenuTemplate());

renderTemplate(`afterend`, menuContainerTitles[1], getFiltersTemplate());

const mainContainer = document.querySelector(`.trip-events`);
renderTemplate(`beforeend`, mainContainer, getSortTemplate());

renderTemplate(`beforeend`, mainContainer, getCardsContainerTemplate());

const tripEventsContainer = document.querySelector(`.trip-events__list`);
const CARDS_AMOUNT = 3;
for (let i = 0; i < CARDS_AMOUNT; i++) {
  renderTemplate(`beforeend`, tripEventsContainer, getTripEventTemplate());
}
