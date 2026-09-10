// Natural Calamity Emergency Siren Synthesizer using Web Audio API & Speech Synthesis

class CalamitySirenAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  private initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Start the dual-tone high-decibel emergency siren alarm sound
   */
  startSiren(): void {
    if (this.isPlaying) return;

    try {
      const ctx = this.initAudioContext();
      this.isPlaying = true;

      this.oscillator = ctx.createOscillator();
      this.gainNode = ctx.createGain();

      this.oscillator.type = 'sawtooth'; // High penetration emergency sawtooth wave
      this.oscillator.frequency.setValueAtTime(800, ctx.currentTime);

      this.gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);

      this.oscillator.start();

      // Oscillate frequency between 800Hz and 1350Hz (classic emergency disaster siren pattern)
      let highTone = false;
      this.intervalId = window.setInterval(() => {
        if (!this.isPlaying || !this.oscillator || !this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const targetFreq = highTone ? 800 : 1350;
        this.oscillator.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.45);
        highTone = !highTone;
      }, 500);

    } catch (err) {
      console.warn('AudioContext siren initialization error:', err);
    }
  }

  /**
   * Stop the emergency siren alarm
   */
  stopSiren(): void {
    this.isPlaying = false;

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.oscillator = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // ignore
      }
      this.gainNode = null;
    }
  }

  /**
   * Voice synthesis calamity emergency warning for drivers with Hindi & English support
   */
  speakWarning(text: string, lang: 'en' | 'hi' = 'en'): void {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const sirenAudioEngine = new CalamitySirenAudioEngine();
