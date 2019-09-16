/**
 * @param {string[]} offers
 * @param {string} description
 * @param {string[]} images
 * @return {string}
 */
export const getEventDetailsSectionTemplate = (offers, description, images) => {
  const needRenderOffers = offers.length;
  const needRenderDestination = description || images.length;

  if (needRenderOffers || needRenderDestination) {
    return `<section class="event__details">{{offersSection}}{{destinationSection}}</section>`
      .replace(`{{offersSection}}`, getOffersSectionTemplate(offers))
      .replace(`{{destinationSection}}`, getDestinationSectionTemplate(description, images));
  }

  return ``;
};

/**
 * @param {array} offers
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
  const {id, name, price, isApplied} = offer;
  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isApplied ? `checked` : ``}>
      <label class="event__offer-label" for="${id}-1">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`;
};

/**
 * @param {string} description
 * @param {string[]} images
 * @return {string}
 */
export const getDestinationSectionTemplate = (description, images) => {
  if (!description && !images.length) {
    return ``;
  }
  const template = `<section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      {{descriptionBlock}}
      {{imagesBlock}}
    </section>`;

  return template
    .replace(`{{descriptionBlock}}`, getDescriptionBlockTemplate(description))
    .replace(`{{imagesBlock}}`, getDestinationImagesTemplate(images));
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
 * @param {string[]} images
 * @return {string}
 */
export const getDestinationImagesTemplate = (images) => {
  if (!images.length) {
    return ``;
  }
  return `<div class="event__photos-container">
      <div class="event__photos-tape">${images.map((src) => getDestinationImageTemplate(src)).join(``)}</div>
    </div>`;
};

/**
 * @param {string} src
 * @return {string}
 */
export const getDestinationImageTemplate = (src) => {
  if (!src) {
    return ``;
  }
  return `<img class="event__photo" src="${src}" alt="Event photo">`;
};
