import {getTripEvent, getMenuItems/* , getFiltersData */} from './data';
import {finishNewEventCreationEvtName, Position, render} from "./utils";
import {getItineraryTemplate} from './templates/itinerary';
import {Menu} from './components/menu';
// import {getFiltersTemplate} from './components/filters';
import {Statistics} from "./components/statistics";
import {TripController} from './controllers/trip-controller';

// Рендерит фильтры
// render(`afterend`, menuContainerTitles[1], getFiltersTemplate(getFiltersData()));

const mainContainer = document.querySelector(`.trip-events`);

const CARDS_AMOUNT = 3;

export const eventsArray = new Array(CARDS_AMOUNT)
  .fill(``)
  .map(getTripEvent)
  .sort((a, b) => a.dateFrom - b.dateFrom);

// Рендерит меню
const menu = new Menu(getMenuItems());

const eventsContainerController = new TripController(mainContainer, eventsArray, menu);
eventsContainerController.init();
menu.setOnclickCallback((evt) => {
  eventsContainerController.toggleStatistics(evt);
});
menu.render();

// Рендерит контейнер с маршрутом
const itineraryContainer = document.querySelector(`.trip-info`);

render(itineraryContainer, getItineraryTemplate(eventsArray), Position.AFTER_BEGIN);

// Рендерит контейнер со статистикой
const pageMainContainer = document.querySelector(`.page-body__page-main`).querySelector(`.page-body__container`);
const statisticsBlock = new Statistics();
render(pageMainContainer, statisticsBlock.getTemplate(), Position.BEFORE_END);

const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);
addNewEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  eventsContainerController.startNewEventCreation();
  eventsContainerController.closeAllEvents();
});

document.addEventListener(finishNewEventCreationEvtName, () => {
  eventsContainerController.finishNewEventCreation();
});

// Считает общую стоимость
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

// Вставляет общую стоимость в шапку
document.querySelector(`.trip-info__cost-value`).textContent = calculateTotalPrice().toString();
