// Sound effects library for Allie's Bus Adventure
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Play a simple tone
  playTone(frequency: number, duration: number = 0.2, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sparkle/magic sound
  playSparkle() {
    if (!this.enabled || !this.audioContext) return;
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(800 + Math.random() * 800, 0.1, 'sine');
      }, i * 50);
    }
  }

  // Pop/bubble sound
  playPop() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(400, 0.05, 'sine');
    setTimeout(() => this.playTone(600, 0.05, 'sine'), 30);
  }

  // Success/achievement sound
  playSuccess() {
    if (!this.enabled || !this.audioContext) return;
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3), i * 100);
    });
  }

  // Click/tap sound
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(1000, 0.05, 'square');
  }

  // Whoosh sound
  playWhoosh() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    filter.type = 'lowpass';
    
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.1);
    
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.value = 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Bus horn sound
  playHorn() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(200, 0.3, 'sawtooth');
    setTimeout(() => this.playTone(250, 0.3, 'sawtooth'), 150);
  }

  // Animal sounds
  playCat() {
    if (!this.enabled || !this.audioContext) return;
    // Meow sound
    this.playTone(400, 0.1, 'sine');
    setTimeout(() => this.playTone(600, 0.2, 'sine'), 100);
  }

  playBird() {
    if (!this.enabled || !this.audioContext) return;
    // Chirp sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(1200 + Math.random() * 400, 0.05, 'sine');
      }, i * 60);
    }
  }

  // Engine sound
  playEngine(play: boolean) {
    if (!this.enabled || !this.audioContext) return;
    
    if (play) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 50;
      filter.type = 'lowpass';
      filter.frequency.value = 100;
      gainNode.gain.value = 0.1;

      oscillator.start();
      
      // Store reference to stop later
      (this as SoundManager & { engineOscillator?: OscillatorNode }).engineOscillator = oscillator;
    } else {
      const self = this as SoundManager & { engineOscillator?: OscillatorNode };
      if (self.engineOscillator) {
        self.engineOscillator.stop();
        self.engineOscillator = undefined;
      }
    }
  }

  // Play musical melody
  playMelody(notes: {note: number, duration: number}[]) {
    if (!this.enabled || !this.audioContext) return;
    
    let currentTime = 0;
    notes.forEach(({note, duration}) => {
      setTimeout(() => {
        this.playTone(note, duration, 'sine');
      }, currentTime * 1000);
      currentTime += duration;
    });
  }

  // Wheels on the Bus melody
  playWheelsOnTheBus() {
    const melody = [
      { note: 261.63, duration: 0.25 }, // C
      { note: 293.66, duration: 0.25 }, // D
      { note: 329.63, duration: 0.25 }, // E
      { note: 261.63, duration: 0.25 }, // C
      { note: 261.63, duration: 0.25 }, // C
      { note: 293.66, duration: 0.25 }, // D
      { note: 329.63, duration: 0.25 }, // E
      { note: 329.63, duration: 0.25 }, // E
      { note: 329.63, duration: 0.5 },  // E
    ];
    this.playMelody(melody);
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

export const getSoundManager = () => {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
};