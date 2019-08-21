export const getMenuTemplate = (data) => {
  return `
  <nav class="trip-controls__trip-tabs  trip-tabs">
    ${data.map((item) =>
    `<a class="trip-tabs__btn ${item.isActive ? `trip-tabs__btn--active` : ``}" href="#">${item.name}</a>`
  ).join(``)}
  </nav>`;
};
