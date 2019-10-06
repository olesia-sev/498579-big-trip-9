/**
 * @param {object[]} offers
 * @param {string} description
 * @param {object[]} pictures
 * @return {string}
 */
export const getEventDetailsSectionTemplate = (offers, description, pictures) => {
  const needRenderOffers = offers.length;
  const needRenderDestination = description || pictures.length;

  if (needRenderOffers || needRenderDestination) {
    return `<section class="event__details">{{offersSection}}{{destinationSection}}</section>`
      .replace(`{{offersSection}}`, getOffersSectionTemplate(offers))
      .replace(`{{destinationSection}}`, getDestinationSectionTemplate(description, pictures));
  }

  return ``;
};

/**
 * @param {object[]} offers
 * @return {string}
 */
export const getOffersSectionTemplate = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${offers.map((offer) => getOfferTemplate(offer)).join(``)}</div>
    </section>`;
};

/**
 * @param {object} offer
 * @return {string}
 */
export const getOfferTemplate = (offer) => {
  const {id, title, price, accepted} = offer;
  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${accepted ? `checked` : ``}>
      <label class="event__offer-label" for="${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`;
};

/**
 * @param {string} description
 * @param {object[]} pictures
 * @return {string}
 */
export const getDestinationSectionTemplate = (description, pictures) => {
  if (!description && !pictures.length) {
    return ``;
  }
  const template = `<section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      {{descriptionBlock}}
      {{picturesBlock}}
    </section>`;

  return template
    .replace(`{{descriptionBlock}}`, getDescriptionBlockTemplate(description))
    .replace(`{{picturesBlock}}`, getDestinationPicturesTemplate(pictures));
};

/**
 * @param {string} description
 * @return {string}
 */
export const getDescriptionBlockTemplate = (description) => {
  if (!description) {
    return ``;
  }
  return `<p class="event__destination-description">${description}</p>`;
};

/**
 * @param {object[]} pictures
 * @return {string}
 */
export const getDestinationPicturesTemplate = (pictures) => {
  if (!pictures.length) {
    return ``;
  }
  return `<div class="event__photos-container">
    <div class="event__photos-tape">${pictures.map(({src, description}) => getDestinationPictureTemplate(src, description)).join(``)}</div>
  </div>`;
};

/**
 * @param {string} src
 * @param {string} description
 * @return {string}
 */
export const getDestinationPictureTemplate = (src, description) => {
  if (!src) {
    return ``;
  }
  return `<img class="event__photo" src="${src}" alt="${description || `Event photo`}">`;
};
