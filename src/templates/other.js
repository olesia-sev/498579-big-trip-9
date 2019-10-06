import moment from "moment";

/**
 * @param {object[]} events
 * @return {string}
 */
export const getItineraryTemplate = (events) => {
  const destinationsNames = events.map(({destination: {name}}) => name);

  let destinations;
  if (destinationsNames.length > 2) {
    destinations = [
      destinationsNames[0],
      `...`,
      destinationsNames[destinationsNames.length - 1]
    ];
  } else {
    destinations = destinationsNames;
  }

  const format = `DD MMM`;
  const dates = [];
  if (events[0] && events[0].dateFrom) {
    dates.push(moment(events[0].dateFrom).format(format));
    if (events[events.length - 1] && events[events.length - 1].dateTo) {
      dates.push(moment(events[events.length - 1].dateTo).format(format));
    }
  }

  if (!destinations.length && !dates.length) {
    return ``;
  }

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">
      ${destinations.join(` &mdash; `)}
    </h1>
    <p class="trip-info__dates">
      ${dates.join(` &mdash; `)}
    </p>
  </div>`;
};

/**
 * @return {string}
 */
export const getEmptyMessageTemplate = () => {
  return `<p class="trip-events__msg js-empty-message">Click New Event to create your first point</p>`;
};

/**
 * @return {string}
 */
export const getLoadingMessageTemplate = () => {
  return `<p class="trip-events__msg js-loading-message">Loading...</p>`;
};
