import FilmListExtraView from '../view/film-list-extra-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';

import FilmPresenter from './film-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render} from '../framework/render.js';
import {sortFilmsByRating} from '../utils/film.js';
import {UserAction, UpdateType, TimeLimit, ExtraFilmListType, FILM_EXTRA_COUNT} from '../const.js';

export default class FilmsExtraRatePresenter {
  #filmExtraRateComponent = new FilmListExtraView(ExtraFilmListType.RATING);
  #filmListContainerComponent = new FilmListContainerView();

  #container = null;
  #filmsModel = null;

  #filmPresenter = new Map();
  #filmCardClickHandler = null;
  #onEscKeyDown = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, filmCardClickHandler, onEscKeyDown) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filmCardClickHandler = filmCardClickHandler;
    this.#onEscKeyDown = onEscKeyDown;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    return [...this.#filmsModel.get()]
      .sort(sortFilmsByRating)
      .slice(0, FILM_EXTRA_COUNT);
  }

  init = () => {
    this.#renderExtraRateBoard();
  };

  #viewActionHandler = async (actionType, updateType, updateFilm) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#filmPresenter.get(updateFilm.id)) {
          this.#filmPresenter.get(updateFilm.id).setFilmEditing();
        }
        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (this.#filmPresenter.get(updateFilm.id)) {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        break;
    }
  };

  #renderFilmListContainer(container) {
    render(this.#filmExtraRateComponent, container);
    render(this.#filmListContainerComponent, this.#filmExtraRateComponent.element);
  }

  #renderFilmList(films) {
    this.#renderFilms(
      films,
      this.#filmListContainerComponent
    );
  }

  #renderFilms(films, container) {
    films
      .forEach((film) =>
        this.#renderFilm(film, container)
      );
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#viewActionHandler,
      this.#filmCardClickHandler,
      this.#onEscKeyDown
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderExtraRateBoard() {
    const films = this.films;

    if (films.length > 0) {
      this.#renderFilmListContainer(this.#container);
      this.#renderFilmList(films);
    }
  }
}
