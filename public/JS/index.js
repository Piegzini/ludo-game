import Formview from './modules/Formview.js';
import Lobbyview from './modules/Lobbyview.js';
class View {
  constructor() {
    this.view;
    this.init();
  }

  async init() {
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
        this.view = new Lobbyview(parsed_repsonse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const view = new View();
export default view;
