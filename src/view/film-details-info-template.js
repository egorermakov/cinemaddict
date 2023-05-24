import {formatStringToDate, formatMinutesToTime} from '../utils.js';

const generateNameList = (names) =>
  (names.length < 1)
    ? names[0]
    : names.join(', ');

const generateGenreTitle = (genres) =>
  (genres.length > 1)
    ? 'Genres'
    : 'Genre';

const generateGenreList = (genres) =>
  genres.map((genreItem) =>
    `<span class="film-details__genre">${genreItem}</span>`
  ).join('');

export const createFilmDetailsInfoTemplate = (filmInfo) => {
  const {
    title, alternativeTitle, totalRating, poster, ageRating, director,
    writers, actors, release, runtime, genre, description
  } = filmInfo;

  return `
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src=${poster} alt="${title}" />
        <p class="film-details__age">${ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">${alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${generateNameList(writers)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${generateNameList(actors)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${formatStringToDate(release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${formatMinutesToTime(runtime)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${release.releaseСountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${generateGenreTitle(genre)}</td>
            <td class="film-details__cell">
              ${generateGenreList(genre)}
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">
        ${description}
        </p>
      </div>
    </div>
  `;
};
