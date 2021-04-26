import Positions from './Positions.js';

export default class Gameview {
  constructor(players_data) {
    this.template = document.querySelector('#board-wrapper');
    this.board;
    this.positions = new Positions();
    this.buildView(players_data);
  }

  buildView(players_data) {
    const players = players_data;
    const boardTemplateClone = this.template.content.cloneNode(true);
    const board = boardTemplateClone.querySelector('#board-image');
    const pawnsIdes = ['first', 'second', 'third', 'fourth'];
    console.log(players);
    for (const player of players) {
      const color = player.color;
      const basePawnsPositionsTable = this.positions.basePositions[color];

      for (const [index, basePawnPositions] of basePawnsPositionsTable.entries()) {
        const pawn = document.createElement('div');
        pawn.classList.add('pawn', `${color}`);
        pawn.setAttribute('id', `${pawnsIdes[index]}-${color}`);
        for (const key in basePawnPositions) {
          pawn.style[key] = `${basePawnPositions[key]}px`;
        }

        board.append(pawn.cloneNode(true));
      }
    }
    document.body.append(board);
  }
  updatedTurnTime(current_color, turn_Time) {
    const turnTime = turn_Time;
    const currentPlayerContentDiv = document.querySelector(`#p-${current_color}`);
    const timer = currentPlayerContentDiv.querySelector('.p-status');
    timer.textContent = turnTime;
  }
}
