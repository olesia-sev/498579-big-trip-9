import ChartDataLabels from "chartjs-plugin-datalabels";
import {ESC_KEYCODE, PositionsMap, SHAKE_DURATION, typesIn, typesTo} from "../constants";

/**
 * @param {object} data
 * @return {{data: *, plugins: [*], type: string}}
 */
export const getChartConfig = (data) => ({
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data,
  options: {
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

/**
 * @param {string} str
 * @return {string}
 */
export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @param {string} type
 * @return {string}
 */
export const getTypeTitle = (type) => {
  switch (true) {
    case typesIn.has(type): {
      return `${capitalizeFirstLetter(type)} in`;
    }
    case typesTo.has(type): {
      return `${capitalizeFirstLetter(type)} to`;
    }
    default: {
      return `${capitalizeFirstLetter(type)}`;
    }
  }
};

/**
 * @param {string} type
 * @return {boolean}
 */
export const isEventTypeAllowed = (type) => typesIn.has(type) || typesTo.has(type);

/**
 * Быстрое глубокое клонирвание объекта, чтобы данные не менялись по ссылке
 * @param {object|array} obj
 * @return {any}
 */
export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * @param {string} template
 * @return {Node}
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

/**
 * @param {Element} container
 * @param {Element|string} element
 * @param {string} place
 */
export const render = (container, element, place = `default`) => {
  if (element === ``) {
    container.innerHTML = ``;
    return;
  }

  const htmlElement = element instanceof Element ? element : createElement(element);

  if (htmlElement) {
    if (Object.keys(PositionsMap).includes(place)) {
      container[PositionsMap[place].method](htmlElement);
    } else {
      // Заменяет container заданными узлами или строками
      container.replaceWith(htmlElement);
    }
  }
};

/**
 * @param {KeyboardEvent|Event} evt
 * @param {function} action
 */
export const isEscEvent = (evt, action) => {
  // noinspection JSDeprecatedSymbols
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

/**
 * @param {HTMLElement} element
 */
export const shakeThat = (element) => {
  element.style.animation = `shake ${SHAKE_DURATION / 1000}s`;
  setTimeout(() => {
    element.style.animation = null;
  }, SHAKE_DURATION);
};

/**
 * @param {HTMLElement} element
 */
export const showError = (element) => {
  element.style.boxShadow = `0 0 5px 5px red`;
};

/**
 * @param {HTMLElement} element
 */
export const hideError = (element) => {
  element.style.boxShadow = null;
};
