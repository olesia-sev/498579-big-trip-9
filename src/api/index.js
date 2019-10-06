import uuid from "uuid/v4";
import moment from "moment";
import {isEventTypeAllowed} from "../utils";

const FETCH_URL = `https://htmlacademy-es-9.appspot.com/big-trip`;
const EVENTS_ENDPOINT = `${FETCH_URL}/points`;
const DEFAULT_FETCH_OPTIONS = {
  method: `GET`,
  cache: `no-cache`,
  headers: {
    'Authorization': `Basic ${uuid()}`,
  },
  redirect: `follow`,
  referrer: `no-referrer`,
};

/**
 * @param {Response} response
 */
const checkStatus = (response) => {
  if (response.status >= 400 && response.status < 600) {
    throw new Error(`Bad response`);
  }
};

/**
 * @param {Response} response
 * @return {*|Promise<any>}
 */
const responseToJson = (response) => {
  checkStatus(response);
  return response.json();
};

/**
 * @param {Response} response
 * @return {Promise<string>}
 */
const responseToText = (response) => {
  checkStatus(response);
  return response.text();
};

/**
 * @param {object[]} rawPictures
 * @param {string} defaultDescription
 * @return {{src: string, description: string}[]}
 */
const getNormalizedDestinationPictures = (rawPictures, defaultDescription) => {
  const pictures = Array.isArray(rawPictures) ? rawPictures : [];

  return pictures
    .filter(({src}) => typeof src === `string` && src)
    .map(({src, description}) => ({
      src,
      description: typeof description === `string` && description ? description : defaultDescription
    }));
};

/**
 * @param {object[]} rawOffers
 * @return {{price: number, accepted: boolean, id: string, title: string}[]}
 */
const getNormalizedOffers = (rawOffers) => {
  const offers = Array.isArray(rawOffers) ? rawOffers : [];

  return offers
    .filter(({title}) => typeof title === `string` && title)
    .map(({title, price, accepted}) => ({
      id: uuid(),
      title,
      price: Math.max(price, 0) || 0,
      accepted: !!accepted
    }));
};

/**
 * @param {object} rawEvent
 * @return {object}
 */
const getNormalizedEvent = (rawEvent) => {
  if (typeof rawEvent.id !== `string` || !rawEvent.id) {
    throw new Error(`ID is invalid`);
  }

  const id = rawEvent.id;

  const type = rawEvent.type;
  if (!isEventTypeAllowed(type)) {
    throw new Error(`Type "${type}" is not allowed`);
  }

  // noinspection JSUnresolvedVariable
  const dateFrom = moment(rawEvent[`date_from`]);
  if (!dateFrom.isValid()) {
    throw new Error(`Date (date_from) "${dateFrom}" is invalid`);
  }

  // noinspection JSUnresolvedVariable
  const dateTo = moment(rawEvent[`date_to`]);
  if (!dateTo.isValid()) {
    throw new Error(`Date (date_to) "${dateTo}" is invalid`);
  }

  const name = rawEvent.destination.name;
  if (!name || typeof name !== `string`) {
    throw new Error(`Name "${name}" is invalid`);
  }

  const description = typeof rawEvent.destination.description === `string` ? rawEvent.destination.description : ``;

  // noinspection JSUnresolvedVariable
  return {
    id,
    type,
    destination: {
      name,
      description,
      pictures: getNormalizedDestinationPictures(rawEvent.destination.pictures, name)
    },
    dateFrom: Number(dateFrom.format(`x`)),
    dateTo: Number(dateTo.format(`x`)),
    price: Math.max(rawEvent[`base_price`], 0) || 0,
    isFavorite: !!rawEvent[`is_favorite`],
    offers: getNormalizedOffers(rawEvent.offers)
  };
};

/**
 * @return {Promise<{}[] | Array>}
 */
export const getEvents = () => {
  return fetch(EVENTS_ENDPOINT, DEFAULT_FETCH_OPTIONS)
    .then(responseToJson)
    .then((rawEvents) => {
      const events = rawEvents.reduce((acc, rawEvent) => {
        try {
          const event = getNormalizedEvent(rawEvent);
          return acc.set(event.id, event);
        } catch (error) {
          return acc;
        }
      }, new Map());
      return Array.from(events.values());
    })
    .catch(() => []);
};

/**
 * @param {object[]} offers
 * @return {object[]}
 */
const getOffersBody = (offers) => {
  return offers.filter(({accepted}) => !!accepted).map(({price, title}) => ({price, title}));
};

/**
 * @param {object} event
 * @param {string|undefined} id
 * @return {object}
 */
const getEventBody = ({type, destination, dateFrom, dateTo, price = 0, isFavorite = false, offers = []}, id) => {
  /* eslint-disable camelcase */
  const body = {
    type,
    destination,
    "date_from": dateFrom,
    "date_to": dateTo,
    "base_price": price,
    "is_favorite": isFavorite,
    "offers": getOffersBody(offers)
  };
  /* eslint-enable camelcase */

  if (id) {
    return Object.assign(body, {id});
  }

  return body;
};

/**
 * @param {object[]} event
 * @return {Promise<any>}
 */
export const createEvent = (event) => {
  return fetch(`${EVENTS_ENDPOINT}`, Object.assign(DEFAULT_FETCH_OPTIONS, {
    method: `POST`,
    headers: Object.assign({}, DEFAULT_FETCH_OPTIONS.headers, {'Content-Type': `application/json`}),
    body: JSON.stringify(getEventBody(event, undefined))
  }))
    .then(responseToJson)
    .then((rawEvent) => {
      const normalizedEvent = getNormalizedEvent(rawEvent);
      return Promise.resolve(normalizedEvent);
    });
};

/**
 * @param {object[]} event
 * @return {Promise<any>}
 */
export const updateEvent = (event) => {
  const {id} = event;
  return fetch(`${EVENTS_ENDPOINT}/${id}`, Object.assign(DEFAULT_FETCH_OPTIONS, {
    method: `PUT`,
    headers: Object.assign({}, DEFAULT_FETCH_OPTIONS.headers, {'Content-Type': `application/json`}),
    body: JSON.stringify(getEventBody(event, id))
  }))
    .then(responseToJson)
    .then((rawEvent) => {
      const normalizedEvent = getNormalizedEvent(rawEvent);
      return Promise.resolve(normalizedEvent);
    });
};

/**
 * @param {string} id
 * @return {Promise<void>}
 */
export const deleteEvent = (id) => {
  return fetch(`${EVENTS_ENDPOINT}/${id}`, Object.assign(DEFAULT_FETCH_OPTIONS, {method: `DELETE`}))
    .then(responseToText)
    .then((text) => {
      if (text.toLowerCase() !== `ok`) {
        throw new Error(`Bad response`);
      }
      return Promise.resolve();
    });
};

/**
 * @return {Promise<{}[] | Array>}
 */
export const getDestinations = () => {
  return fetch(`${FETCH_URL}/destinations`, DEFAULT_FETCH_OPTIONS)
    .then(responseToJson)
    .then((rawDestinations) => {
      const destinations = rawDestinations.reduce((acc, rawDestination) => {
        try {
          const name = rawDestination.name;

          if (!name || typeof name !== `string`) {
            return acc;
          }

          const description = typeof rawDestination.description === `string` ? rawDestination.description : ``;

          return acc.set(name, {
            name,
            description,
            pictures: getNormalizedDestinationPictures(rawDestination.pictures, name)
          });
        } catch (error) {
          return acc;
        }
      }, new Map());
      return Array.from(destinations.values());
    })
    .catch(() => []);
};

/**
 * @return {Promise<{}[] | Array>}
 */
export const getOffers = () => {
  return fetch(`${FETCH_URL}/offers`, DEFAULT_FETCH_OPTIONS)
    .then(responseToJson)
    .then((rawOffers) => {
      const offers = rawOffers.reduce((acc, rawOffer) => {
        try {
          const type = rawOffer.type;

          if (!isEventTypeAllowed(type)) {
            return acc;
          }

          return acc.set(type, {
            type,
            offers: getNormalizedOffers(rawOffer.offers)
          });
        } catch (error) {
          return acc;
        }
      }, new Map());
      return Array.from(offers.values());
    })
    .catch(() => []);
};

