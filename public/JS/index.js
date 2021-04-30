import Formview from './modules/Formview.js';
import Gameview from './modules/Gameview.js';
import Lobbyview from './modules/Lobbyview.js';
class View {
  constructor() {
    this.currentPlayerData;
    this.view;
    this.boardView;
    this.rolledNumber;
    this.lobbyUpdaterInterval;
    this.init();
  }

  async init() {
    const currentPlayer = await fetch('/player');
    const parsed_currentPlayer = await currentPlayer.json();
    const noPlayer = parsed_currentPlayer?.noPlayer;
    if (!noPlayer) {
      this.currentPlayerData = parsed_currentPlayer;
    }
    try {
      const response = await fetch('/information');
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      const parsed_response = await response.json();
      const buildLobby = parsed_response?.buildLobby;

      if (buildLobby) {
        this.view = new Formview();
      } else {
        const { game, players } = parsed_response;
        this.view = new Lobbyview(players, this.currentPlayerData);
        this.setLobbyUpdater();
        if (game.isStarted) {
          this.view.removeSwitch();
          this.boardView = new Gameview(players);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  lobbyUpdater = async () => {
    try {
      const response = await fetch('/information');
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }

      const { game, players } = await response.json();
      const { currentTurnColor, turnTime, isStarted, rolledNumber, finished, winner } = game;
      this.rolledNumber = rolledNumber;
      this.view.updatePlayersDivs(players);

      if (turnTime === 10) {
        this.boardView.afterMove = false;
      }
      if (isStarted && !this.boardView) {
        this.view.removeSwitch();
        this.boardView = new Gameview(players);
      }
      if (currentTurnColor && this.boardView) {
        this.boardView.updatedTurnTime(currentTurnColor, turnTime);
        this.boardView.updatePawns(players);
      }
      const turnOfCurrentPlayer = currentTurnColor === this.currentPlayerData.color;
      if (turnOfCurrentPlayer && !this.boardView.rollButton && !rolledNumber) {
        this.boardView.buildRollButton();
      } else if (this.boardView.rollButton && rolledNumber) {
        this.boardView.rollButton.remove();
        this.boardView.rollButton = null;
      } else if (!turnOfCurrentPlayer && this.boardView.rollButton) {
        this.boardView.rollButton.remove();
        this.boardView.rollButton = null;
      } else if (rolledNumber && turnOfCurrentPlayer && !this.boardView.afterMove) {
        this.boardView.addListenersToPawns(rolledNumber, players, currentTurnColor);
      }
      if (turnTime === 0) {
        document.querySelector('#predict')?.remove();
        this.boardView.rollWrapper.remove();
        this.boardView.rollWrapper = null;
        this.boardView.removeListenersFromPawns();
        this.boardView.dice = null;
        this.boardView.rollButton = null;
      }

      if (finished) {
        clearInterval(this.lobbyUpdaterInterval);
        alert(`Wygrał ${winner}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  setLobbyUpdater() {
    this.lobbyUpdaterInterval = setInterval(this.lobbyUpdater, 2000);
  }
}

const view = new View();
export default view;
