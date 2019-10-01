import moment from "moment";
import {getDestinationsNames} from "../data";

export const getItineraryTemplate = (eventsArray) => {
  const data = [...new Set(getDestinationsNames())];

  let destinations;
  if (data.length > 2) {
    destinations = [
      data[0],
      `...`,
      data[data.length - 1]
    ];
  } else {
    destinations = [];
  }

  let dateStartTimestamp = eventsArray[0].dateFrom;
  let dateEndTimestamp = eventsArray[eventsArray.length - 1].dateTo;

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">
      ${destinations.join(` &mdash; `)}
    </h1>
    <p class="trip-info__dates">
        ${moment(dateStartTimestamp).format(`DD MMM`)} &mdash; ${moment(dateEndTimestamp).format(`DD MMM`)}
     </p>
  </div>`;
};
