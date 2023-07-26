import FilmsPresenter from '../presenter/films-presenter.js';
import FilmsExtraRatePresenter from '../presenter/films-extra-rate-presenter.js';
import FilmsExtraCommentPresenter from '../presenter/films-extra-comment-presenter.js';
import FilmDetailsPresenter from '../presenter/film-details-presenter.js';

import FilmListEmptyView from '../view/film-list-empty-view.js';
import FilmListLoadingView from '../view/film-list-loading-view.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove} from '../framework/render';
import {UpdateType, UserAction, TimeLimit} from '../const.js';

export default class MainPresenter {
  #filmListEmptyComponent = new FilmListEmptyView();
  #filmListLoadingComponent = new FilmListLoadingView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #selectedFilm = null;
  #isLoading = true;

  #filmsPresenter = null;
  #filmsExtraRatePresenter = null;
  #filmsExtraCommentPresenter = null;
  #filmDetailsPresenter = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#commentsModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#renderMainBoard();
  };

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setFilmEditing();
        }
        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (this.#filmDetailsPresenter) {
            this.#filmDetailsPresenter.setAborting({actionType});
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmDetailsPresenter.setCommentCreating();
        try {
          await this.#commentsModel.add(updateType, updateFilm, updateComment);
          this.#filmDetailsPresenter.clearViewData();
        } catch {
          this.#filmDetailsPresenter.setAborting({actionType});
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmDetailsPresenter.setCommentDeleting(updateComment.id);
        try {
          await this.#commentsModel.delete(updateType, updateFilm, updateComment);
        } catch {
          this.#filmDetailsPresenter.setAborting({actionType, commentId: updateComment.id});
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#renderMainBoard();
        break;
    }
  };

  #renderMainBoard() {
    if (this.#isLoading) {
      render(this.#filmListLoadingComponent, this.#container);
      return;
    }

    remove(this.#filmListLoadingComponent);

    if (this.#filmsModel.get().length === 0) {
      render(this.#filmListEmptyComponent, this.#container);
      return;
    }

    remove(this.#filmListEmptyComponent);

    this.#filmsPresenter = new FilmsPresenter(
      this.#container,
      this.#filmsModel,
      this.#filterModel,
      this.#addFilmDetailsComponent,
      this.#onEscKeyDown
    );
    this.#filmsPresenter.init();

    this.#filmsExtraRatePresenter = new FilmsExtraRatePresenter(
      this.#filmsPresenter.getFilmsContainer(),
      this.#filmsModel,
      this.#addFilmDetailsComponent,
      this.#onEscKeyDown
    );
    this.#filmsExtraRatePresenter.init();

    this.#filmsExtraCommentPresenter = new FilmsExtraCommentPresenter(
      this.#filmsPresenter.getFilmsContainer(),
      this.#filmsModel,
      this.#commentsModel,
      this.#addFilmDetailsComponent,
      this.#onEscKeyDown
    );
    this.#filmsExtraCommentPresenter.init();
  }

  #renderFilmDetails = async () => {
    const comments = await this.#commentsModel.get(this.#selectedFilm);

    const isCommentLoadingError = !comments;

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#viewActionHandler,
        this.#removeFilmDetailsComponent,
        this.#onEscKeyDown
      );
    }

    if (!isCommentLoadingError) {
      document.addEventListener('keydown', this.#onCtrlEnterDown);
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments, isCommentLoadingError);
  };

  #addFilmDetailsComponent = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetailsComponent();
    }

    this.#selectedFilm = film;
    this.#renderFilmDetails();

    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    document.removeEventListener('keydown', this.#onCtrlEnterDown);

    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };
}
