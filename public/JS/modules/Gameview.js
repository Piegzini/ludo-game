import Positions from './Positions.js';

export default class Gameview {
  constructor(players_data) {
    this.template = document.querySelector('#board-wrapper');
    this.board;
    this.rollButton;
    this.dice;
    this.positions = new Positions();
    this.buildView(players_data);
  }

  buildView(players_data) {
    const players = players_data;
    const boardTemplateClone = this.template.content.cloneNode(true);
    const board = boardTemplateClone.querySelector('#board-image');
    const pawnsIdes = ['first', 'second', 'third', 'fourth'];
   
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

  rollNumber = async () => {
    try {
      const rolledNumber_response = await fetch('http://localhost:8080/rollnumber');
      const parsed_response = await rolledNumber_response.json();
      const { rolledNumber } = parsed_response;
      console.log('file: Gameview.js - line 48 - rolledNumber', rolledNumber);
      this.buildDice(rolledNumber);
    } catch (erorr) {
      console.log(error);
    }
  };

  buildDice(rolled_number) {
    const dice = document.createElement('img');
    dice.classList.add('dice-roll');
    dice.src = `/images/dice-${rolled_number}.png`;
    const diceWrapper = document.querySelector('#roll-wrapper');
    diceWrapper.append(dice);
    this.dice = document.querySelector('.dice-roll');
    
  }

  buildRollButton() {
    const wrapperOfRoll = document.createElement('div');
    wrapperOfRoll.setAttribute('id', 'roll-wrapper');

    const rollButton = document.createElement('div');
    rollButton.setAttribute('id', 'roll-button');
    rollButton.addEventListener('click', this.rollNumber);
    rollButton.textContent = 'Rzuć kostką';

    wrapperOfRoll.append(rollButton);
    document.body.append(wrapperOfRoll);
    this.rollButton = document.querySelector('#roll-button');
  }
}
