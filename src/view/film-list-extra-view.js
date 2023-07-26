import AbstractView from '../framework/view/abstract-view.js';
import {ExtraFilmListType} from '../const.js';

const createFilmListExtraViewTemplate = (type) =>
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">
        ${(type === ExtraFilmListType.RATING) ? 'Top rated' : 'Most commented'}
      </h2>
    </div>
  `;

export default class FilmListExtraView extends AbstractView {
  #type = null;

  constructor(type) {
    super();
    this.#type = type;
  }

  get template() {
    return createFilmListExtraViewTemplate(this.#type);
  }
}
