// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) =>
  items[getRandomInteger(0, items.length - 1)];

const formatStringToDateWithTime = (date) =>
  new Date(date).toLocaleString('en-GB');

const formatStringToDate = (date) =>
  new Date(date).toLocaleString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'});

const formatStringToYear = (date) =>
  new Date(date).getFullYear();

const formatMinutesToTime = (minutes) => {
  const MINUTES_PER_HOUR = 60;

  return (minutes < MINUTES_PER_HOUR)
    ? `${minutes}m`
    : `${Math.floor(minutes / MINUTES_PER_HOUR)}h ${minutes % MINUTES_PER_HOUR}m`;
};

export {
  getRandomInteger,
  getRandomValue,
  formatStringToDateWithTime,
  formatStringToDate,
  formatStringToYear,
  formatMinutesToTime
};
