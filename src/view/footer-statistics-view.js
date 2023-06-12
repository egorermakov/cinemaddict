import AbsctractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class View extends AbsctractView {
  get template() {
    return createFooterStatisticsTemplate();
  }
}
