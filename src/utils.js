export const getRandomBoolean = () => {
  return Math.random() >= 0.5;
};

export const getRandomArrayIndex = (arr) => {
  return Math.floor(Math.random() * arr.length);
};

export const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getRandomTimestamp = () => {
  // 86400000 = 24 * 60 * 60 * 1000
  return Date.now() + 1 + Math.floor(Math.random() * 7) * 86400000;
};

export const Position = {
  BEFORE_BEGIN: `beforebegin`, // Вставить узлы или строки до container
  AFTER_BEGIN: `afterbegin`, // Вставить узлы или строки в начало container
  BEFORE_END: `beforeend`, // Вставить узлы или строки в конец container
  AFTER_END: `afterend`, // Вставить узлы или строки после container
};

/**
 * <!-- beforebegin -->
 * <p>
 * <!-- afterbegin -->
 * foo
 * <!-- beforeend -->
 * </p>
 * <!-- afterend -->
 */
const PositionsMap = {
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  if (element === ``) {
    container.innerHTML = ``;
    return;
  }

  const htmlElement = element instanceof HTMLElement ? element : createElement(element);

  if (htmlElement) {
    if (Object.keys(PositionsMap).includes(place)) {
      container[PositionsMap[place].method](htmlElement);
    } else {
      // Заменяет container заданными узлами или строками
      container.replaceWith(htmlElement);
    }
  }
};

export const isEscEvent = (evt, action) => {
  const ESC_KEYCODE = 27;
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

export const FLATPICKER_DATE_TIME_FORMAT = `d.m.Y H:i`;
export const MOMENT_DATE_TIME_FORMAT = `DD.MM.YYYY HH:mm`;
export const MOMENT_TIME_FORMAT = `HH:mm`;

const dateParser = /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2})/;
export const toTimestamp = (dateString) => {
  const match = dateString.match(dateParser);
  const date = new Date(
      match[3], // year
      match[2] - 1, // monthIndex
      match[1], // day
      match[4], // hours
      match[5] // minutes
  );
  return date.getTime();
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export const finishNewEventCreationEvtName = `finish-new-event-creation`;
export const calculateTotalPriceEvtName = `calculate-total-price`;

// Быстрое глубокое клонирвание объекта, чтобы данные не менялись по ссылке
export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
