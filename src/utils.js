export const getRandomBoolean = () => {
  return Boolean(Math.round(Math.random()));
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
