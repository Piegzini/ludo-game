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
    console.log('file: Gameview.js - line 65 - positions', positions);
    for (const key in positions) {
      console.log('file: Gameview.js - line 66 - key', key);
      const position = positions[key];
      const numberOfPosition = position.positionNumber;
      if (numberOfPosition === 'base') {
        const enableToStart = rolledNumber === 1 || rolledNumber === 6;
        if (enableToStart) {
          console.log('można startować');
          const colorOfPlayer = currentPlayer.color;
          const divId = position.id;
          const pawnDiv = document.querySelector(`#${divId}-${colorOfPlayer}`);
          pawn.div.style.cursor = 'pointer';
          pawnDiv.addEventListener('click', this.move);
        }
      }
    }
  };
  updatePawns(players_data) {
    const players = players_data;
    for (const player of players) {
      const { positions, color } = player;
      for (const position of positions) {
        const { top, left, id } = position;
        const pawn = document.querySelector(`#${id}-${color}`);
        pawn.style.top = `${top}px`;
        pawn.style.left = `${left}px`;
      }
    }
  }

  move = async (e) => {
    const divId = e.target.id;
    const color = divId.split('-')[1];
    const id = divId.split('-')[0];
    const data = { id, color };

    await fetch('http://localhost:8080/rollnumber', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
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
