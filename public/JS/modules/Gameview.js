import Positions from './Positions.js';
console.log(Positions.startedPositions);
import view from '../index.js';
export default class Gameview {
  constructor(players_data) {
    this.template = document.querySelector('#board-wrapper');
    this.board;
    this.rollButton;
    this.rollWrapper;
    this.afterMove = false;
    this.dice;
    this.buildView(players_data);
  }

  buildView(players_data) {
    const players = players_data;
    const boardTemplateClone = this.template.content.cloneNode(true);
    const board = boardTemplateClone.querySelector('#board-image');
    const pawnsIdes = ['first', 'second', 'third', 'fourth'];
    for (const player of players) {
      const { color, positions } = player;
      const basePawnsPositionsTable = positions;
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

  rollNumber = async (e) => {
    e.target.removeEventListener('click', this.rollNumber);
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

  addListenersToPawns = (rolled_number, players_data, currentTurn_color) => {
    const rolledNumber = rolled_number;
    const playersData = players_data;
    const currentTurnColor = currentTurn_color;
    const currentPlayer = playersData.find((player) => {
      const loop_playerColor = player.color;
      if (currentTurnColor === loop_playerColor) {
        return player;
      }
    });

    const { positions } = currentPlayer;
    for (const key in positions) {
      const position = positions[key];
      const numberOfPosition = position.positionNumber;
      if (numberOfPosition === 'base') {
        const enableToStart = rolledNumber === 1 || rolledNumber === 6;
        if (enableToStart) {
          const colorOfPlayer = currentPlayer.color;
          const divId = position.id;
          const pawnDiv = document.querySelector(`#${divId}-${colorOfPlayer}`);
          pawnDiv.style.cursor = 'pointer';
          pawnDiv.addEventListener('click', this.move);
          pawnDiv.addEventListener('mouseover', this.onPrediction);
          pawnDiv.addEventListener('mouseout', this.leftPrediction);
        }
      } else {
        const colorOfPlayer = currentPlayer.color;
        const divId = position.id;
        const pawnDiv = document.querySelector(`#${divId}-${colorOfPlayer}`);
        pawnDiv.style.cursor = 'pointer';
        pawnDiv.addEventListener('click', this.move);
        pawnDiv.addEventListener('mouseover', this.onPrediction);
        pawnDiv.addEventListener('mouseout', this.leftPrediction);
      }
    }
  };

  removeListenersFromPawns = () => {
    const pawns = document.querySelectorAll('.pawn');
    for (const pawn of pawns) {
      pawn.removeEventListener('click', this.move);
      pawn.removeEventListener('mouseout', this.leftPrediction);
      pawn.removeEventListener('mouseover', this.onPrediction);

      pawn.style.cursor = 'default';
      console.log('hej');
    }
  };

  updatePawns(players_data) {
    const players = players_data;
    for (const player of players) {
      const { positions, color } = player;
      for (const position of positions) {
        const { top, left, id, positionNumber } = position;
        const pawn = document.querySelector(`#${id}-${color}`);
        pawn.style.top = `${top}px`;
        pawn.style.left = `${left}px`;
        pawn.dataset.positionNumber = positionNumber;
      }
    }
  }

  move = async (e) => {
    this.leftPrediction(e);
    const divId = e.target.id;
    const color = divId.split('-')[1];
    const id = divId.split('-')[0];
    const data = { id, color };
    this.removeListenersFromPawns();

    const response = await fetch('http://localhost:8080/player/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const parsed_response = await response.text();
    if (parsed_response === 'succes') {
      this.afterMove = true;
      this.removeListenersFromPawns();
    }
  };

  onPrediction = (e) => {
    console.log('hej');
    const pawnDiv = e.target;
    const color = pawnDiv.id.split('-')[1];
    const positionNumber = pawnDiv.dataset.positionNumber;
    const rolledNumber = view.rolledNumber;
    const gamePositions = Positions.gamePositions;
    console.log('file: Gameview.js - line 142 - gamePositions', gamePositions);

    let predictPosition = positionNumber === 'base' ? Positions.startedPositions[color] : rolledNumber + parseInt(positionNumber);
    predictPosition = predictPosition % 40;
    console.log('file: Gameview.js - line 144 - predictPosition', predictPosition);
    const predictDiv = document.createElement('div');
    predictDiv.classList.add('pawn', `${color}`);
    predictDiv.setAttribute('id', 'predict');
    console.log(gamePositions[predictPosition].top);
    predictDiv.style.top = `${gamePositions[predictPosition].top}px`;
    predictDiv.style.left = `${gamePositions[predictPosition].left}px`;
    document.querySelector('#board-image').append(predictDiv);
  };

  leftPrediction = () => {
    document.querySelector('#predict')?.remove();
  };

  buildDice(rolled_number) {
    const dice = document.createElement('img');
    dice.classList.add('dice-roll');
    dice.src = `/images/dice-${rolled_number}.png`;
    const diceWrapper = document.querySelector('#roll-wrapper');
    diceWrapper.append(dice);
    this.dice = document.querySelector('.dice-roll');
    this.rollWrapper = document.querySelector('#roll-wrapper');
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
