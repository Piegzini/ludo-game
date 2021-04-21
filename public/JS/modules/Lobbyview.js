export default class Lobbyview {
  constructor(players_information) {
    this.template = document.querySelector('#lobby');
    this.statuses = ['Nie gotowy', 'Gotowy '];
    this.lobbyUpdaterInterval;
    this.playersContentDivs;
    this.buildView(players_information);

    this.setLobbyUpdater();
  }

  updatePlayersDivs(players_data) {
    for (const [index, player] of players_data.entries()) {
      const { nick, status, color } = player;
      const playerContentDiv = this.playersContentDivs[index];
      const id = `p-${color}`;

      playerContentDiv.setAttribute('id', id);
      const childsOfContentDiv = playerContentDiv.querySelectorAll('p');
      childsOfContentDiv[0].textContent = nick;
      childsOfContentDiv[1].textContent = this.statuses[status];
    }
  }

  buildView(players_information) {
    const players_data = players_information;
    const lobby = document.querySelector('#input-wrapper');
    if (lobby) {
      lobby.remove();
    }
    const templateClone = this.template.content.cloneNode(true);
    this.playersContentDivs = templateClone.querySelectorAll('.p-content');
    this.updatePlayersDivs(players_data);

    document.body.append(templateClone);

    this.playersContentDivs = document.querySelectorAll('.p-content');
  }

  lobbyUpdater = async () => {
    try {
      const response = await fetch('http://localhost:8080/information');
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }

      const players_data = await response.json();
      this.updatePlayersDivs(players_data);
    } catch (error) {
      console.log(error);
    }
  };

  setLobbyUpdater() {
    this.lobbyUpdaterInterval = setInterval(this.lobbyUpdater, 3000);
  }
}
