import AbstractView from '../framework/view/abstract-view.js';

const createFilmListLoadingViewTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

export default class FilmListLoadingView extends AbstractView {
  get template() {
    return createFilmListLoadingViewTemplate();
  }
}
