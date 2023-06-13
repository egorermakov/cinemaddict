const NAME_COUNT = 2;

const MAX_COMMENTS_ON_FILM = 5;

const GenreCount = {
  MIN: 1,
  MAX: 3
};

const Rating = {
  MIN: 0,
  MAX: 10
};

const AgeRating = {
  MIN: 0,
  MAX: 18
};

const Runtime = {
  MIN: 60,
  MAX: 180
};

const YearsDuration = {
  MIN: 5,
  MAX: 10
};

const DaysDuration = {
  MIN: 0,
  MAX: 7
};

const DateType = {
  FILM_INFO: 'FILM_INFO',
  USER_DETAILS: 'USER_DETAILS'
};

const names = [
  'Alice',
  'Ivan',
  'Sergey',
  'Dakota',
  'Nevada',
  'Fedor'
];

const surnames = [
  'Makoveev',
  'Ivanov',
  'Romanov',
  'Lee',
  'James',
  'Walker'
];

const titles = [
  'Country On Him',
  'Raiders With The Carpet',
  'Guest Who Sold The Darkness',
  'A Tale Of A Little Bird In The Storm',
  'Friends On The Room',
  'Raiders Who Stole Us',
  'Friends Without Themselves',
  'Pioneers Without Us',
  'A Man With Themselves',
  'Guest With The Darkness',
  'A Little Pony Who Bought The Darkness',
  'Family Who Bought The Carpet',
  'Raiders Who Saw Him',
  'Guest Within Him',
  'Pioneers Without The Darkness',
  'A Tale Of A Little Bird With Him',
  'A Shark Who Sold The Wall',
  'Raiders Who The Storm',
  'Family Who Stole The Darkness',
  'A Lion Without Us',
];

const posters = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
];

const genres = [
  'Animation',
  'Action',
  'Adventure',
  'Comedy',
  'Family',
  'Horror',
  'Thriller',
];

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.';

const comment = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.';

const countries = ['USA', 'Russia', 'Germany', 'Finland', 'France', 'Spain', 'Italy', 'China', 'Japan'];

export {
  NAME_COUNT,
  MAX_COMMENTS_ON_FILM,
  GenreCount,
  Rating,
  AgeRating,
  Runtime,
  YearsDuration,
  DaysDuration,
  DateType,
  names,
  surnames,
  titles,
  posters,
  genres,
  emotions,
  description,
  comment,
  countries
};
