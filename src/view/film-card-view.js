import {createElement} from '../render.js';
import {createFilmCardInfoTemplate} from './film-card-info-template.js';
import {createFilmCardControlsTemplate} from './film-card-controls-template.js';

const createFilmCardTemplate = ({filmInfo, comments}) =>
  `
    <article class="film-card">

      ${createFilmCardControlsTemplate()}

      ${createFilmCardInfoTemplate(filmInfo, comments.length)}

    </article>
  `;

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
