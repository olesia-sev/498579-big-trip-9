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
export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`
};

/**
 * @type {{PAST: string, FUTURE: string, DEFAULT: string}}
 */
export const FilterType = {
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
