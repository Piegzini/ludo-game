class Positions {
  constructor() {
    this.basePositions = {
      yellow: [
        { positionNumber: 'base', id: 'first', top: 5, left: 5 },
        { positionNumber: 'base', id: 'second', top: 5, left: 50 },
        { positionNumber: 'base', id: 'third', top: 50, left: 5 },
        { positionNumber: 'base', id: 'fourth', top: 50, left: 50 },
      ],
      green: [
        { positionNumber: 'base', id: 'first', top: 5, left: 415 },
        { positionNumber: 'base', id: 'second', top: 5, left: 460 },
        { positionNumber: 'base', id: 'third', top: 50, left: 415 },
        { positionNumber: 'base', id: 'fourth', top: 50, left: 460 },
      ],
      red: [
        { positionNumber: 'base', id: 'first', top: 415, left: 415 },
        { positionNumber: 'base', id: 'second', top: 415, left: 460 },
        { positionNumber: 'base', id: 'third', top: 460, left: 415 },
        { positionNumber: 'base', id: 'fourth', top: 460, left: 460 },
      ],
      blue: [
        { positionNumber: 'base', id: 'first', top: 415, left: 5 },
        { positionNumber: 'base', id: 'second', top: 415, left: 50 },
        { positionNumber: 'base', id: 'third', top: 460, left: 5 },
        { positionNumber: 'base', id: 'fourth', top: 460, left: 50 },
      ],
    };
    this.startedPositions = {
      green: 0,
      red: 10,
      blue: 20,
      yellow: 30,
    };
    this.endPositions = {
      green: [
        { top: 50, left: 232.5 },
        { top: 95, left: 232.5 },
        { top: 140, left: 232.5 },
        { top: 185, left: 232.5 },
      ],
      red: [
        { top: 230, left: 412.5 },
        { top: 230, left: 367.5 },
        { top: 230, left: 322.5 },
        { top: 230, left: 277.5 },
      ],
      blue: [
        { top: 410, left: 232.5 },
        { top: 365, left: 232.5 },
        { top: 320, left: 232.5 },
        { top: 275, left: 232.5 },
      ],
      yellow: [
        { top: 230, left: 52.5 },
        { top: 230, left: 97.5 },
        { top: 230, left: 142.5 },
        { top: 230, left: 187.5 },
      ],
    };
    this.gamePositions = [
      { top: 5, left: 277.5 },
      { top: 50, left: 277.5 },
      { top: 95, left: 277.5 },
      { top: 140, left: 277.5 },
      { top: 185, left: 277.5 },

      { top: 185, left: 322.5 },
      { top: 185, left: 367.5 },
      { top: 185, left: 412.5 },
      { top: 185, left: 457.5 },

      { top: 230, left: 457.5 },

      { top: 275, left: 457.5 },
      { top: 275, left: 412.5 },
      { top: 275, left: 367.5 },
      { top: 275, left: 322.5 },
      { top: 275, left: 277.5 },

      { top: 320, left: 277.5 },
      { top: 365, left: 277.5 },
      { top: 410, left: 277.5 },
      { top: 455, left: 277.5 },

      { top: 455, left: 232.5 },

      { top: 455, left: 187.5 },
      { top: 410, left: 187.5 },
      { top: 365, left: 187.5 },
      { top: 320, left: 187.5 },
      { top: 275, left: 187.5 },

      { top: 275, left: 142.5 },
      { top: 275, left: 97.5 },
      { top: 275, left: 52.5 },
      { top: 275, left: 7.5 },

      { top: 230, left: 7.5 },

      { top: 185, left: 7.5 },
      { top: 185, left: 52.5 },
      { top: 185, left: 97.5 },
      { top: 185, left: 142.5 },
      { top: 185, left: 187.5 },

      { top: 140, left: 187.5 },
      { top: 95, left: 187.5 },
      { top: 50, left: 187.5 },
      { top: 5, left: 187.5 },

      { top: 5, left: 232.5 },
    ];
  }
}

const positions = new Positions();
module.exports = positions;
