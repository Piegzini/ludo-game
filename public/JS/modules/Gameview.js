export default class Gameview {
  constructor() {
    this.template = document.querySelector('#board-wrapper');
    this.board;

    this.buildView();
  }

  buildView() {
    console.log(this.template);
    const boardTemplateClone = this.template.content.cloneNode(true);
    document.body.append(boardTemplateClone);
  }
}
