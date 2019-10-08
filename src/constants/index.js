/**
 * @type {number}
 */
export const ESC_KEYCODE = 27;

/**
 * @type {number}
 */
export const SHAKE_DURATION = 600;

/**
 * @type {string}
 */
export const VISUALLY_HIDDEN_CLASS_NAME = `visually-hidden`;

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
 * @type {{MOMENT_DATE_TIME: string, MOMENT_TIME: string, FLATPICKR_DATE_TIME: string}}
 */
export const DateTimeFormat = {
  FLATPICKR_DATE_TIME: `d.m.Y H:i`,
  MOMENT_DATE_TIME: `DD.MM.YYYY HH:mm`,
  MOMENT_TIME: `HH:mm`
};

/**
 * @type {{TAB_CLICK: string, FINISH_NEW_EVENT_CREATION: string, RENDER_ITINERARY: string, CALCULATE_TOTAL_PRICE: string}}
 */
export const CustomEventName = {
  FINISH_NEW_EVENT_CREATION: `finish-new-event-creation`,
  CALCULATE_TOTAL_PRICE: `calculate-total-price`,
  RENDER_ITINERARY: `render-itinerary`,
  TAB_CLICK: `tab-click`
};

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
