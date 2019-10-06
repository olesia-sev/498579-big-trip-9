import ChartDataLabels from "chartjs-plugin-datalabels";

/**
 * @type {string}
 */
export const VISUALLY_HIDDEN_CLASS_NAME = `visually-hidden`;

/**
 * @type {string}
 */
export const FLATPICKR_DATE_TIME_FORMAT = `d.m.Y H:i`;

/**
 * @type {string}
 */
export const MOMENT_DATE_TIME_FORMAT = `DD.MM.YYYY HH:mm`;

/**
 * @type {string}
 */
export const MOMENT_TIME_FORMAT = `HH:mm`;

/**
 * @type {string}
 */
export const finishNewEventCreationEvtName = `finish-new-event-creation`;

/**
 * @type {string}
 */
export const calculateTotalPriceEvtName = `calculate-total-price`;

/**
 * @type {string}
 */
export const renderItineraryEvtName = `render-itinerary`;

/**
 * @type {string}
 */
export const tabClickEvtName = `tab-click`;

/**
 * @type {number}
 */
export const ESC_KEYCODE = 27;

/**
 * @type {number}
 */
export const SHAKE_DURATION = 600;

/**
 * @type {object[]}
 */
export const TABS = [
  {
    name: `Table`,
    isActive: true
  },
  {
    name: `Stats`,
    isActive: false
  }
];

/**
 * @type {{beforeend: {method: string}, beforebegin: {method: string}, afterend: {method: string}, afterbegin: {method: string}}}
 * <!-- beforebegin -->
 * <p>
 * <!-- afterbegin -->
 * foo
 * <!-- beforeend -->
 * </p>
 * <!-- afterend -->
 */
export const PositionsMap = {
  beforebegin: {
    method: `before` // Вставить узлы или строки до container
  },
  afterbegin: {
    method: `prepend` // Вставить узлы или строки в начало container
  },
  beforeend: {
    method: `append` // Вставить узлы или строки в конец container
  },
  afterend: {
    method: `after` // Вставить узлы или строки после container
  }
};

/**
 * @type {{AFTER_END: string, BEFORE_BEGIN: string, BEFORE_END: string, AFTER_BEGIN: string}}
 */
export const Position = {
  BEFORE_BEGIN: `beforebegin`, // Вставить узлы или строки до container
  AFTER_BEGIN: `afterbegin`, // Вставить узлы или строки в начало container
  BEFORE_END: `beforeend`, // Вставить узлы или строки в конец container
  AFTER_END: `afterend`, // Вставить узлы или строки после container
};

/**
 * @type {{ADDING: string, DEFAULT: string}}
 */
export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

/**
 * @type {{PRICE: string, TIME: string, DEFAULT: string}}
 */
export const SortTypes = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`
};

/**
 * @type {{PAST: string, FUTURE: string, DEFAULT: string}}
 */
export const FilterTypes = {
  DEFAULT: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

/**
 * @type {Set<string>}
 */
export const typesIn = new Set([`check-in`, `restaurant`, `sightseeing`]);

/**
 * @type {Set<string>}
 */
export const typesTo = new Set([`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`]);

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
