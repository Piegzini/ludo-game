export default class Speaker {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();
    this.numbers = ['jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć'];
  }

  speak(number) {
    const utterThis = new SpeechSynthesisUtterance(number);
    for (let i = 0; i < this.voices.length; i++) {
      if (this.voices[i].lang === 'pl-PL') {
        utterThis.voice = this.voices[i];
      }
    }
    this.synth.speak(utterThis);
  }
}
