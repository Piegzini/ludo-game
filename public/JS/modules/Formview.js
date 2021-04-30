import view from '../index.js';

export default class Formview {
  constructor() {
    this.template = document.querySelector('#form-template');

    this.input;
    this.button;

    this.build();
  }
  sendPlayerName = async (e) => {
    e.target.removeEventListener('click', this.sendPlayerName);
    const nick = this.input.value;
    const nickValidator = nick.split(' ').join('');
    const lengthOfNick = nickValidator.length <= 12;
    const data = { nick };
    console.log(nickValidator, lengthOfNick);
    if (nickValidator && lengthOfNick) {
      try {
        const response = await fetch('http://localhost:8080/player', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`http error: ${response.status}`);
        }
        console.log('tute');
        view.init();
      } catch (error) {
        console.log(error);
      }
    }
  };

  build() {

    const templateClone = this.template.content.cloneNode(true);
    document.body.append(templateClone);
    this.wrapper = document.querySelector('#input-wrapper');
    this.input = document.querySelector('#n-input');
    this.button = document.querySelector('#n-button');
    this.button.addEventListener('click', this.sendPlayerName);
  }
}
