export default class Lobbyview {
  constructor(players_information) {
    this.template = document.querySelector('#lobby');
    this.statuses = ['Nie gotowy', 'Gotowy '];
    this.build(players_information);
  }

  build(players_information) {
    const players_data = players_information;
    const lobby = document.querySelector('#input-wrapper');
    if (lobby) {
      lobby.remove();
    }
    const templateClone = this.template.content.cloneNode(true);
    const playersContentsDivs = templateClone.querySelectorAll('.p-content');

    for (const [index, player] of players_data.entries()) {
      const { nick, status, color } = player;
      const playerContentDiv = playersContentsDivs[index];
      const id = `p-${color}`;

      playerContentDiv.setAttribute('id', id);
      const childsOfContentDiv = playerContentDiv.querySelectorAll('p');
      childsOfContentDiv[0].textContent = nick;
      childsOfContentDiv[1].textContent = this.statuses[status];
    }

    document.body.append(templateClone);
  }
}
