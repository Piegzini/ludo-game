import Formview from './modules/Formview.js';
import Gameview from './modules/Gameview.js';
class View {
  constructor() {
    this.currentPlayerData;
    this.view;
    this.init();
  }

  async init() {
    const response = await fetch('http://localhost:8080/player');
    const parsed_response = await response.json();
    const noPlayer = parsed_response?.noPlayer;
    if (!noPlayer) {
      this.currentPlayerData = parsed_response;
    }
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
        this.view = new Gameview(parsed_repsonse, this.currentPlayerData);
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
