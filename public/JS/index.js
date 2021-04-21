import Formview from './modules/Formview.js';
import Lobbyview from './modules/Lobbyview.js';
class View {
  constructor() {
    this.currentPlayerData;
    this.view;
    this.init();
  }

  async init() {
    this.currentPlayerData = await fetch('http://localhost:8080/player');

    try {
      const response = await fetch('http://localhost:8080/information');
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      const parsed_repsonse = await response.json();
      const buildLobby = parsed_repsonse?.buildLobby;

      if (buildLobby) {
        this.view = new Formview();
      } else {
        this.view = new Lobbyview(parsed_repsonse, this.currentPlayerData);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const view = new View();
export default view;

window.addEventListener('click', (e) => {
  console.log(e.target, e.target.checked);
});
