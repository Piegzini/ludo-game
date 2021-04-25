export default class Lobbyview {
  constructor(players_information, { session_id }) {
    this.currentPlayerId = session_id;
    this.template = document.querySelector('#lobby');
    this.lobbyUpdaterInterval;
    this.playersContentDivs;
    this.statusInput;

    this.buildPlayersBar(players_information);
  }

  updatePlayersDivs(players_data) {
    for (const [index, player] of players_data.entries()) {
      const { nick, isReady, color } = player;
      const playerContentDiv = this.playersContentDivs[index];
      const id = `p-${color}`;

      playerContentDiv.setAttribute('id', id);
      const childsOfContentDiv = playerContentDiv.querySelectorAll('p');
      childsOfContentDiv[0].textContent = nick;
      childsOfContentDiv[1].textContent = isReady ? 'Gotowy' : 'Nie Gotowy';
    }
  }

  updateCheckBoxContent(players_data) {
    this.statusInput.addEventListener('click', this.updateReadyStatus);
    for (const loop_player of players_data) {
      const playerValidator = loop_player._id === this.currentPlayerId;
      if (playerValidator) {
        if (loop_player.isReady) {
          this.statusInput.setAttribute('checked', 'checked');
        } else if (!loop_player.isReady) {
          this.statusInput.removeAttribute('checked');
        }
      }
    }
  }

  buildPlayersBar(players_information) {
    const players_data = players_information;
    const lobby = document.querySelector('#input-wrapper');
    if (lobby) {
      lobby.remove();
    }
    const templateClone = this.template.content.cloneNode(true);

    this.statusInput = templateClone.querySelector('#status-input');
    this.playersContentDivs = templateClone.querySelectorAll('.p-content');

    this.updatePlayersDivs(players_data);
    this.updateCheckBoxContent(players_data);
    document.body.append(templateClone);

    this.playersContentDivs = document.querySelectorAll('.p-content');
    this.statusInput = document.querySelector('#status-input');
  }

  updateReadyStatus = async () => {
    const isReady = this.statusInput.checked;
    const data = { isReady };
    const response = await fetch('http://localhost:8080/player/isready', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  removeSwitch() {
    const switchButton = document.querySelector('#switch-wrapper');
    switchButton.remove();
  }
}
