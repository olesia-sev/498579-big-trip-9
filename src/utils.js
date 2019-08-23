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
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, elem, place) => {
  switch (place) {
    case Position.AFTEREND:
      container.prepend(elem);
      break;
    case Position.BEFOREEND:
      container.append(elem);
      break;
  }
};

export const unrender = (elem) => {
  if (elem) {
    elem.remove();
  }
};

export const isEscEvent = (evt, action) => {
  const ESC_KEYCODE = 27;
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

export const replaceElements = (container, newChild, oldChild) => {
  container.replaceChild(newChild, oldChild);
};
