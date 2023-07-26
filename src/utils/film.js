import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const humanizeDate = (date) => {
  const timeDiff = dayjs(date).diff(dayjs());
  return dayjs.duration(timeDiff).humanize(true);
};

const formatStringToDate = (date) =>
  dayjs(date).format('DD MMMM YYYY');

const formatStringToYear = (date) =>
  dayjs(date).format('YYYY');

const formatMinutesToTime = (minutes) =>
  dayjs.duration(minutes, 'minutes').format('H[h] mm[m]');

const sortFilmsByDate = (filmA, filmB) =>
  dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortFilmsByRating = (filmA, filmB) =>
  filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

const sortFilmsByCommentCount = (filmA, filmB) =>
  filmB.comments.length - filmA.comments.length;

export {
  humanizeDate,
  formatStringToDate,
  formatStringToYear,
  formatMinutesToTime,
  sortFilmsByDate,
  sortFilmsByRating,
  sortFilmsByCommentCount
};
