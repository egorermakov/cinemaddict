import Observable from '../framework/observable';
import {generateFilms} from '../mock/film.js';

export default class FilmsModel extends Observable {
  #films = generateFilms();

  get = () => this.#films;

  update = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
