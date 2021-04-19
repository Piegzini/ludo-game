class Operator {
  constructor() {
    this.button = document.querySelector('button');
    this.input = document.querySelector('#name');

    this.init();
  }
  enterGame = async () => {
    const nick = this.input.value;
    const data = { nick };
    const response = await fetch('http://localhost:8080/player', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
  };

  init() {
    this.button.addEventListener('click', this.enterGame);
    console.log(this);
  }
}

const operator = new Operator();
