export default class Positions {
  constructor() {
    this.basePositions = {
      yellow: [
        { top: 5, left: 5 },
        { top: 5, left: 50 },
        { top: 50, left: 5 },
        { top: 50, left: 50 },
      ],
      green: [
        { top: 5, right: 5 },
        { top: 5, right: 50 },
        { top: 50, right: 5 },
        { top: 50, right: 50 },
      ],
      red: [
        { bottom: 5, right: 5 },
        { bottom: 5, right: 50 },
        { bottom: 50, right: 5 },
        { bottom: 50, right: 50 },
      ],
      blue: [
        { bottom: 5, left: 5 },
        { bottom: 5, left: 50 },
        { bottom: 50, left: 5 },
        { bottom: 50, left: 50 },
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
      { top: 185, left: 502.5 },

      { top: 230, left: 502.5 },
      { top: 275, left: 502.5 },
    ];
  }
}
