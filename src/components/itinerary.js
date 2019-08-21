export const getItineraryTemplate = ({cities, dateFrom, dateTo}) => {
  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${cities[0]} &mdash; 
    ${cities.length < 3 ? `` : `... &mdash; `} 
    ${cities[cities.length - 1]}</h1>
    <p class="trip-info__dates">
        ${new Date(dateFrom).toLocaleDateString()}&nbsp;&mdash;&nbsp;${new Date(dateTo).toLocaleDateString()}
     </p>
  </div>`;
};
