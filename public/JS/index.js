class InputView {
  constructor() {
    this.init();
    this.button = document.querySelector('button');
    this.input = document.querySelector('input');
  }
  enterGame = async () => {
    const nick = this.input.value;
    const validatorNick = nick.split(' ').join('');
    const data = { nick };
    console.log(validatorNick);
    if (validatorNick) {
      try {
        const response = await fetch('http://localhost:8080/player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`http error: ${response.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  init() {
    const input = document.createElement('input');
    const inputAttributes = {
      type: 'text',
      name: 'nick',
      id: 'name',
      required: 'required',
      autocomplete: 'off',
    };
    for (const attr in inputAttributes) {
      input.setAttribute(attr, inputAttributes[attr]);
    }

    const label = document.createElement('label');
    label.setAttribute('for', 'nick');
    label.innerText = 'Podaj nick';

    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.innerText = 'GRAJ';
    button.addEventListener('click', this.enterGame);

    const inputWrapperChilds = [label, input, button];

    const inputWrapper = document.createElement('div');
    inputWrapper.setAttribute('id', 'input-wrapper');

    for (const child of inputWrapperChilds) {
      inputWrapper.append(child);
    }

    document.body.append(inputWrapper);
  }
}

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
      const inGame = parsed_repsonse?.inGame;

      if (!inGame) {
        this.view = new InputView();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const view = new View();
