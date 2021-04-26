import Formview from './modules/Formview.js';
import Gameview from './modules/Gameview.js';
import Lobbyview from './modules/Lobbyview.js';
class View {
  constructor() {
    this.currentPlayerData;
    this.view;
    this.boardView;
    this.lobbyUpdaterInterval;
    this.init();
  }

  async init() {
    const currentPlayer = await fetch('http://localhost:8080/player');
    const parsed_currentPlayer = await currentPlayer.json();
    const noPlayer = parsed_currentPlayer?.noPlayer;
    if (!noPlayer) {
      this.currentPlayerData = parsed_currentPlayer;
      console.log('file: index.js - line 19 - this.currentPlayerData', this.currentPlayerData);
    }
    try {
      const response = await fetch('http://localhost:8080/information');
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
      const response = await fetch('http://localhost:8080/information');
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }

      const { game, players } = await response.json();
      const { currentTurnColor, turnTime, isStarted } = game;
      console.log('file: index.js - line 54 - isStarted', isStarted);
      this.view.updatePlayersDivs(players);

      if (isStarted && !this.boardView) {
        this.view.removeSwitch();
        this.boardView = new Gameview(players);
      }
      if (currentTurnColor && this.boardView) {
        console.log('jestem tutaj, a tu current color: ', currentTurnColor);
        this.boardView.updatedTurnTime(currentTurnColor, turnTime);
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
