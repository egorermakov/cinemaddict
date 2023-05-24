import {getRandomInteger, getRandomValue} from '../utils.js';
import {FILM_COUNT} from '../const.js';
import {
  NAME_COUNT, MAX_COMMENTS_ON_FILM, GenreCount, Rating,
  AgeRating, Runtime, YearsDuration, names, surnames,
  titles, posters, genres, description, countries} from './const.js';

const getDate = () => {
  const date = new Date();

  date.setFullYear(
    date.getFullYear() - getRandomInteger(YearsDuration.MIN, YearsDuration.MAX)
  );

  return date.toISOString();
};

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(titles),
  totalRating: getRandomInteger(Rating.MIN, Rating.MAX),
  poster: getRandomValue(posters),
  ageRating: getRandomInteger(AgeRating.MIN, AgeRating.MAX),
  writers: Array.from({length: NAME_COUNT}, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  actors: Array.from({length: NAME_COUNT}, () => `${getRandomValue(names)} ${getRandomValue(surnames)}`),
  release: {
    date: getDate(),
    releaseCountry: getRandomValue(countries)
  },
  runtime: getRandomInteger(Runtime.MIN, Runtime.MAX),
  genre:  Array.from({length: getRandomInteger(GenreCount.MIN, GenreCount.MAX)}, () => getRandomValue(genres)),
  description
});

const generateFilms = () => {
  const films = Array.from({length: FILM_COUNT}, generateFilm);

  let totalCommentsCount = 0;

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);

    const filmCommentsCount = (hasComments)
      ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
      : 0;

    totalCommentsCount += filmCommentsCount;

    return {
      id: String(index + 1),
      comments: (hasComments)
        ? Array.from(
          {length: filmCommentsCount},
          (_value, commentIndex) => String(totalCommentsCount - commentIndex)
        )
        : [],
      filmInfo: film,
    };
  });
};

export {generateFilms};
