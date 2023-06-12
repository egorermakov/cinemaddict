import AbsctractView from '../framework/view/abstract-view.js';

const createFilmListViewTemplate = () =>
  `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </div>
  `;

export default class FilmListView extends AbsctractView {
  get template() {
    return createFilmListViewTemplate();
  }
}
