import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';

import FilmPresenter from '../presenter/film-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove, replace, RenderPosition} from '../framework/render.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {FILM_COUNT_PER_STEP, SortType, UserAction, UpdateType, FilterType, TimeLimit} from '../const.js';
import {filter} from '../utils/filter.js';

export default class FilmsPresenter {
  #sortComponent = null;
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #container = null;
  #filmsModel = null;
  #filterModel = null;

  #currentSortType = SortType.DEFAULT;

  #filmPresenter = new Map();
  #filmCardClickHandler = null;
  #onEscKeyDown = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, filterModel, filmCardClickHandler, onEscKeyDown) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#filmCardClickHandler = filmCardClickHandler;
    this.#onEscKeyDown = onEscKeyDown;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    const filterType = this.#filterModel.get();
    const films = this.#filmsModel.get();

    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmBoard();
  };

  getFilmsContainer = () => this.#filmsComponent.element;

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
        if (this.#filterModel.get() !== FilterType.ALL) {
          this.#modelEventHandler(UpdateType.MINOR);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmBoard();
        break;
    }
  };

  #renderFilmButtonMore(container) {
    render(this.#filmButtonMoreComponent, container);
    this.#filmButtonMoreComponent.setButtonClickHandler(() =>
      this.#filmButtonMoreClickHandler()
    );
  }

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const films = this.films.slice(0, Math.min(this.films.length, FILM_COUNT_PER_STEP));
    this.#clearFilmList();
    this.#renderSort(this.#container);
    this.#renderFilmList(films);
  };

  #renderSort(container) {
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }

    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
  }

  #renderFilmListContainer(container) {
    render(this.#filmsComponent, container);
    render(this.#filmListComponent, this.#filmsComponent.element, RenderPosition.BEFOREBEGIN);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  }

  #renderFilmList(films) {
    this.#renderFilms(
      films,
      this.#filmListContainerComponent
    );

    if (this.films.length > FILM_COUNT_PER_STEP) {
      this.#renderFilmButtonMore(this.#filmListComponent.element);
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#filmButtonMoreComponent);
  };

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

  #renderFilmBoard() {
    const films = this.films.slice(0, Math.min(this.films.length, FILM_COUNT_PER_STEP));

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList(films);
  }

  #clearFilmBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#filmButtonMoreComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #filmButtonMoreClickHandler() {
    const filmsCount = this.films.length;

    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmListContainerComponent);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#filmButtonMoreComponent);
    }
  }
}
