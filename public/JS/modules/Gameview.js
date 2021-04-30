import Positions from './Positions.js';
import view from '../index.js';
import Speaker from './Speaker.js';
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
      const rolledNumber_response = await fetch('/rollnumber');
      const parsed_response = await rolledNumber_response.json();
      const { rolledNumber } = parsed_response;
      const speaker = new Speaker();
      speaker.speak(rolledNumber);
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
    const color = currentPlayer.color;
    const { positions } = currentPlayer;
    for (const key in positions) {
      const position = positions[key];
      const { positionNumber } = position;
      const numberOfPosition = position.positionNumber;
      if (numberOfPosition === 'base') {
        // const enableToStart = rolledNumber === 1 || rolledNumber === 6;
        const enableToStart = true;

        if (enableToStart) {
          const divId = position.id;
          const pawnDiv = document.querySelector(`#${divId}-${color}`);
          pawnDiv.classList.add('available');
          pawnDiv.addEventListener('click', this.move);
          pawnDiv.addEventListener('mouseover', this.onPrediction);
          pawnDiv.addEventListener('mouseout', this.leftPrediction);
        }
      } else if (positionNumber + rolledNumber >= 40 + Positions.startedPositions[color]) {
        const finishPositions = currentPlayer.endPositions;
        const countOfFreeFinishPositions = finishPositions.length;
        const countToLastFinishPosition = positionNumber + rolledNumber - (40 + Positions.startedPositions[color]);
        if (countToLastFinishPosition < countOfFreeFinishPositions) {
          const divId = position.id;
          const pawnDiv = document.querySelector(`#${divId}-${color}`);
          pawnDiv.classList.add('available');
          pawnDiv.addEventListener('click', this.move);
          pawnDiv.addEventListener('mouseover', this.onPrediction);
          pawnDiv.addEventListener('mouseout', this.leftPrediction);
        }
      } else {
        const divId = position.id;
        const pawnDiv = document.querySelector(`#${divId}-${color}`);
        pawnDiv.classList.add('available');
        pawnDiv.addEventListener('click', this.move);
        pawnDiv.addEventListener('mouseover', this.onPrediction);
        pawnDiv.addEventListener('mouseout', this.leftPrediction);
      }
    }
  };

  removeListenersFromPawns = () => {
    const pawns = document.querySelectorAll('.pawn');
    for (const pawn of pawns) {
      pawn.classList.remove('available');

      pawn.removeEventListener('click', this.move);
      pawn.removeEventListener('mouseout', this.leftPrediction);
      pawn.removeEventListener('mouseover', this.onPrediction);
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
    const pawnDiv = e.target;
    const color = pawnDiv.id.split('-')[1];
    const positionNumber = pawnDiv.dataset.positionNumber;
    const rolledNumber = view.rolledNumber;
    const gamePositions = Positions.gamePositions;

    let predictPosition = positionNumber === 'base' ? Positions.startedPositions[color] : rolledNumber + parseInt(positionNumber);
    console.log('file: Gameview.js - line 157 - predictPosition', predictPosition);

    const predictDiv = document.createElement('div');
    predictDiv.classList.add('pawn', `${color}`);
    predictDiv.setAttribute('id', 'predict');

    if (predictPosition >= 40 + Positions.startedPositions[color]) {
      console.log('większe');
      const finishPositions = Positions.endPositions[color];
      console.log('file: Gameview.js - line 166 - finishPositions', finishPositions);
      const countOfFreeFinishPositions = finishPositions.length;
      console.log('file: Gameview.js - line 168 - countOfFreeFinishPositions', countOfFreeFinishPositions);
      const countToLastFinishPosition = predictPosition - (40 + Positions.startedPositions[color]);
      console.log('file: Gameview.js - line 170 - countToLastFinishPosition', countToLastFinishPosition);
      if (countToLastFinishPosition < countOfFreeFinishPositions) {
        predictDiv.style.top = `${finishPositions[countToLastFinishPosition].top}px`;
        predictDiv.style.left = `${finishPositions[countToLastFinishPosition].left}px`;
      }
    } else {
      predictDiv.style.top = `${gamePositions[predictPosition % 40].top}px`;
      predictDiv.style.left = `${gamePositions[predictPosition % 40].left}px`;
    }
    document.querySelector('#board-image').append(predictDiv);
  };

  leftPrediction = () => {
    document.querySelector('#predict')?.remove();
  };

  buildDice(rolled_number) {
    const dice = document.createElement('img');
    dice.classList.add('dice-roll');
    dice.src = `/images/dice-${rolled_number}.png`;
    dice.alt = `${rolled_number}`;
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
    this.rollWrapper = document.querySelector('#roll-wrapper');
  }
}
