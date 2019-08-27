import {getRandomBoolean, getRandomArrayIndex, getRandomInRange, capitalizeFirstLetter, getRandomTimestamp} from './utils.js';

const sentences = Array.from(
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
      .split(`. `)
      .map((sentence) => {
        return sentence.replace(/.\s*$/, `.`);
      })
);

export const monthShortNames = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

const offers = [
  {
    name: `Add luggage`,
    price: 10,
    isApplied: getRandomBoolean()
  },
  {
    name: `Switch to comfort class`,
    price: 150,
    isApplied: getRandomBoolean()
  },
  {
    name: `Add meal`,
    price: 2,
    isApplied: getRandomBoolean()
  },
  {
    name: `Choose seats`,
    price: 9,
    isApplied: getRandomBoolean()
  }
];

const typesIn = new Set([`check-in`, `restaurant`, `sightseeing`]);
const typesTo = new Set([`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`, `trip`]);
const types = [...typesIn, ...typesTo];

const getTypeTitle = (type) => {
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

const getRandomType = () => {
  return types[getRandomArrayIndex(types)];
};

const getRandomDescription = () => {
  const descriptionLength = getRandomInRange(1, 3);
  const description = new Set();
  for (let i = 0; i < descriptionLength; i++) {
    description.add(sentences[getRandomArrayIndex(sentences)]);
  }
  return Array.from(description).join(` `);
};

const getRandomOffers = () => {
  const offersLength = getRandomInRange(0, 2);
  const offersItems = new Set();
  for (let i = 0; i < offersLength; i++) {
    offersItems.add(offers[getRandomArrayIndex(offers)]);
  }
  return Array.from(offersItems);
};

const getRandomPictures = () => {
  const picturesLength = getRandomInRange(1, 4);
  const pictures = [];
  for (let i = 0; i < picturesLength; i++) {
    pictures.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return pictures;
};

export const cities = [
  `Saint Petersburg`,
  `Geneva`,
  `Amsterdam`,
  `London`,
  `Oslo`
];

const getTripEvent = () => {
  const type = getRandomType();
  return {
    type,
    title: getTypeTitle(type),
    city: cities[getRandomArrayIndex(cities)],
    dateFrom: getRandomTimestamp(),
    dateTo: getRandomTimestamp(),
    sightsImagesSrc: getRandomPictures(),
    description: getRandomDescription(),
    price: getRandomInRange(10, 2500),
    offers: getRandomOffers(),
    isFavourite: getRandomBoolean()
  };
};

const getMenuData = () => {
  return [
    {
      name: `Table`,
      isActive: true
    },
    {
      name: `Stats`,
      isActive: false
    }
  ];
};

const getFiltersData = () => {
  return [
    {
      name: `Everything`,
      isChecked: true
    },
    {
      name: `Future`,
      isChecked: false
    },
    {
      name: `Past`,
      isChecked: false
    }
  ];
};

export {getTripEvent, getMenuData, getFiltersData};
