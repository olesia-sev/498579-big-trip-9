import {getTripEvent, getMenuData, getFiltersData} from './data.js';

import {getItineraryTemplate} from './components/itinerary.js';
import {getMenuTemplate} from './components/menu.js';
import {getFiltersTemplate} from './components/filters.js';

import {getSortTemplate} from './components/sort';
import {getCardsContainerTemplate} from './components/trip-days-container';
import {TripEvent} from './components/trip-event.js';
import {EventEdit} from './components/event-editing.js';

import {Position, render, isEscEvent} from './utils';

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

// eventsArray.forEach((event) => {
//   renderTemplate(`beforeend`, tripEventsContainer, getTripEventTemplate(event));
// });

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

const renderEvent = (tripEventElem) => {
  const tripEvent = new TripEvent(tripEventElem);
  const eventEdit = new EventEdit(tripEventElem);

  const onEscKeyDown = (evt) => {
    isEscEvent(evt, closeEditForm);
  };

  const showEditForm = () => {
    tripEventsContainer.replaceChild(eventEdit.getElement(), tripEvent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closeEditForm = () => {
    tripEventsContainer.replaceChild(tripEvent.getElement(), eventEdit.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  tripEvent.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, showEditForm);

  eventEdit.getElement()
    .querySelector(`.event__save-btn`)
    .addEventListener(`click`, closeEditForm);

  eventEdit.getElement()
    .querySelector(`.event__reset-btn`)
    .addEventListener(`click`, closeEditForm);

  eventEdit.getElement()
    .addEventListener(`submit`, closeEditForm);

  render(tripEventsContainer, tripEvent.getElement(), Position.BEFOREEND);

};

eventsArray.forEach((tripEvent) => {
  renderEvent(tripEvent);
});
