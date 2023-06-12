import AbsctractView from '../framework/view/abstract-view.js';

const createFilmListContainerViewTemplate = () => '<div class="films-list__container"></div>';

export default class FilmListContainerView extends AbsctractView {
  get template() {
    return createFilmListContainerViewTemplate();
  }
}
