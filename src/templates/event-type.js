import {capitalizeFirstLetter} from "../utils";
import {typesIn, typesTo} from "../constants";

/**
 * @param {string} src
 * @param {string} alt
 * @return {string}
 */
export const getEventTypeLabelTemplate = (src, alt = `Event type icon`) => {
  let icon;
  if (src) {
    icon = `<img class="event__type-icon" width="17" height="17" src="img/icons/${src}.png" alt="${alt}" title="Choose event type">`;
  } else {
    icon = `<span title="Choose event type">?</span>`;
  }
  return `<label class="event__type event__type-btn" for="event-type-toggle-1">
    <span class="visually-hidden">Choose event type</span>
    ${icon}
  </label>`;
};

const transfers = Array.from(typesTo);
const activities = Array.from(typesIn);

/**
 * @param {string|null} checkedType
 * @return {string}
 */
export const getEventTypesTemplate = (checkedType) => {
  return `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${transfers.map((type) => getTypeTemplate(type, type === checkedType)).join(``)}
      </fieldset>
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>
        ${activities.map((type) => getTypeTemplate(type, type === checkedType)).join(``)}
      </fieldset>
    </div>`;
};

/**
 * @param {string} type
 * @param {boolean} isChecked
 * @return {string}
 */
export const getTypeTemplate = (type, isChecked) => {
  return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1" ${isChecked ? `checked` : ``}>
        ${capitalizeFirstLetter(type)}
      </label>
    </div>`;
};
