import moment from "moment";

export const getItineraryTemplate = (eventsArray) => {
  let citiesList = eventsArray.map(({city}) => {
    return city;
  });

  citiesList = [...new Set(citiesList)];

  if (citiesList.length > 2) {
    citiesList = [
      citiesList[0],
      `...`,
      citiesList[citiesList.length - 1]
    ];
  }

  let dateStartTimestamp = eventsArray[0].dateFrom;
  let dateEndTimestamp = eventsArray[eventsArray.length - 1].dateTo;

  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">
      ${citiesList.join(` &mdash; `)}
    </h1>
    <p class="trip-info__dates">
        ${moment(dateStartTimestamp).format(`DD MMM`)} &mdash; ${moment(dateEndTimestamp).format(`DD MMM`)}
     </p>
  </div>`;
};
