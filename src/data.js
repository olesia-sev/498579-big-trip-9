import {getRandomBoolean, getRandomArrayIndex, getRandomInRange, capitalizeFirstLetter, getRandomTimestamp} from './utils';

const sentences = Array.from(
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
      .split(`. `)
      .map((sentence) => {
        return sentence.replace(/.\s*$/, `.`);
      })
);

export const offers = {
  in: [
    {
      name: `Add luggage`,
      price: 30,
      id: `event-offer-luggage`
    },
    {
      name: `Switch to comfort class`,
      price: 100,
      id: `event-offer-comfort`
    },
    {
      name: `Add meal`,
      price: 15,
      id: `event-offer-meal`
    },
    {
      name: `Choose seats`,
      price: 5,
      id: `event-offer-seats`
    },
    {
      name: `Travel by train`,
      price: 40,
      id: `event-offer-train`
    }
  ],
  to: [
    {
      name: `Travel by train123`,
      price: 30,
      id: `event-offer-luggage`
    },
    {
      name: `Choose seats123`,
      price: 100,
      id: `event-offer-comfort`
    },
    {
      name: `Add meal test`,
      price: 15,
      id: `event-offer-meal`
    },
    {
      name: `Switch to comfort class test`,
      price: 5,
      id: `event-offer-seats`
    },
    {
      name: `Add luggage test`,
      price: 40,
      id: `event-offer-train`
    }
  ]
};

export const typesIn = new Set([`check-in`, `restaurant`, `sightseeing`]);
export const typesTo = new Set([`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`]);
const types = [...typesIn, ...typesTo];

export const getOffersByType = (type) => {
  switch (true) {
    case typesIn.has(type): {
      return offers.in;
    }
    case typesTo.has(type): {
      return offers.to;
    }
    default: {
      return [];
    }
  }
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

const getRandomAppliedOffersByType = (type) => {
  return getOffersByType(type).map((offer) => {
    return Object.assign({}, offer, {isApplied: getRandomBoolean()});
  });
};

const getRandomPictures = () => {
  const picturesLength = getRandomInRange(1, 4);
  const pictures = [];
  for (let i = 0; i < picturesLength; i++) {
    pictures.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return pictures;
};

export const destinations = [
  {
    name: `Saint Petersburg`,
    description: ``,
    picsUrl: []
  },
  {
    name: `Geneva`,
    description: getRandomDescription(),
    picsUrl: getRandomPictures()
  },
  {
    name: `Amsterdam`,
    description: getRandomDescription(),
    picsUrl: getRandomPictures()
  },
  {
    name: `London`,
    description: getRandomDescription(),
    picsUrl: getRandomPictures()
  },
  {
    name: `Oslo`,
    description: getRandomDescription(),
    picsUrl: getRandomPictures()
  }
];

export const getDestinationInfo = (destinationName) => {
  return destinations.find(({name}) => name === destinationName);
};

export const getDestinationsNames = () => {
  return destinations.map(({name}) => name);
};

export const getTripEvent = () => {
  const type = getRandomType();
  const dateFrom = getRandomTimestamp() + getRandomInRange(1000, 20000);
  const dateTo = dateFrom + getRandomInRange(100000, 200000000);

  return {
    type,
    destinationName: destinations[getRandomArrayIndex(destinations)].name,
    dateFrom,
    dateTo,
    price: getRandomInRange(10, 2500),
    offers: getRandomAppliedOffersByType(type),
    isFavourite: getRandomBoolean()
  };
};

export const getMenuItems = () => {
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

export const DEFAULT_FILTER = `everything`;
export const FUTURE_FILTER = `future`;
export const PAST_FILTER = `past`;

const CARDS_AMOUNT = 3;
export const getInitialEventsArray = () => {
  return new Array(CARDS_AMOUNT)
    .fill(``)
    .map(getTripEvent)
    .sort((a, b) => a.dateFrom - b.dateFrom);
};
