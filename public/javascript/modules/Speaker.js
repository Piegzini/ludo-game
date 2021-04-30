export default class Speaker {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();
    this.numbers = ['jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć'];
  }

  speak(number) {
    const utterThis = new SpeechSynthesisUtterance(this.numbers[number - 1]);
    utterThis.voice = this.voices[0];
    this.synth.speak(utterThis);
  }
}
