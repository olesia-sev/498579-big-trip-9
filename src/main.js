import {getTripEvent, getMenuData, getFiltersData} from './data';

import {getItineraryTemplate} from './components/itinerary';
import {getMenuTemplate} from './components/menu';
import {getFiltersTemplate} from './components/filters';

import {TripController} from './controllers/trip-controller';

const renderTemplate = (place, container, markup) => {
  container.insertAdjacentHTML(place, markup);
};

const menuContainerTitles = document.querySelectorAll(`.trip-controls h2`);
renderTemplate(`afterend`, menuContainerTitles[0], getMenuTemplate(getMenuData()));

renderTemplate(`afterend`, menuContainerTitles[1], getFiltersTemplate(getFiltersData()));

const mainContainer = document.querySelector(`.trip-events`);

const CARDS_AMOUNT = 3;

export const eventsArray = new Array(CARDS_AMOUNT)
  .fill(``)
  .map(getTripEvent)
  .sort((a, b) => a.dateFrom - b.dateFrom);

const eventsContainerController = new TripController(mainContainer, eventsArray);
eventsContainerController.init();

const itineraryContainer = document.querySelector(`.trip-info`);
renderTemplate(`afterbegin`, itineraryContainer, getItineraryTemplate(eventsArray));

export const calculateTotalPrice = () => {
  return eventsArray.reduce((sum, event) => {
    sum += Number(event.price);
    sum += event.offers
      .reduce((offersSum, offer) => {
        if (offer.isApplied) {
          offersSum += Number(offer.price);
        }
        return offersSum;
      }, 0);
    return sum;
  }, 0);
};

document.querySelector(`.trip-info__cost-value`).textContent = calculateTotalPrice().toString();
