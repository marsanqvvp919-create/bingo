/**
 * Web Audio API Sound Manager for Bingo Lottery App
 * Generates all sound effects natively without requiring external MP3 files.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private rollNoiseNode: AudioNode | null = null;
  private rollGainNode: GainNode | null = null;
  private rollInterval: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.rollGainNode) {
      this.stopRollSound();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playClick() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore audio context errors
    }
  }

  /**
   * Start continuous rattling/rolling bingo cage sound effect
   */
  public startRollSound() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopRollSound(); // ensure previous is cleared

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Bandpass filter for rattling cage sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();

      this.rollNoiseNode = noise;
      this.rollGainNode = gain;

      // Add rhythmic impact click sounds simulating balls bouncing on cage
      this.rollInterval = window.setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        this.playBallImpactSound();
      }, 80);
    } catch {
      // Audio error safety fallback
    }
  }

  private playBallImpactSound() {
    if (!this.ctx || this.isMuted || this.volume <= 0) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Metallic click
      const freq = 600 + Math.random() * 1200;
      osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.volume * (0.15 + Math.random() * 0.2), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  public stopRollSound() {
    if (this.rollInterval) {
      clearInterval(this.rollInterval);
      this.rollInterval = null;
    }

    if (this.rollNoiseNode) {
      try {
        (this.rollNoiseNode as AudioBufferSourceNode).stop();
      } catch {
        // Ignore
      }
      this.rollNoiseNode = null;
    }
    this.rollGainNode = null;
  }

  /**
   * Sound when ball rolls down chute
   */
  public playChuteRoll() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignore
    }
  }

  /**
   * Triumphant chime chord when ball number is locked in
   */
  public playChimeResult() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // C Major arpeggio / chord: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];

      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        const vol = this.volume * 0.4;
        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(vol, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 1.25);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Grand fanfare trumpet sound for BINGO or completion
   */
  public playFanfare() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fanfare notes sequence: G4, C5, E5, G5, E5, G5... hold
      const notes = [
        { f: 392.00, start: 0.0, duration: 0.15 },
        { f: 523.25, start: 0.15, duration: 0.15 },
        { f: 659.25, start: 0.30, duration: 0.15 },
        { f: 783.99, start: 0.45, duration: 0.5 },
        { f: 659.25, start: 0.95, duration: 0.15 },
        { f: 783.99, start: 1.10, duration: 0.8 }
      ];

      notes.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth'; // Bright trumpet-like tone
        osc.frequency.setValueAtTime(note.f, now + note.start);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now + note.start);

        const v = this.volume * 0.35;
        gain.gain.setValueAtTime(0, now + note.start);
        gain.gain.linearRampToValueAtTime(v, now + note.start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + note.start);
        osc.stop(now + note.start + note.duration);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Sound effect when undoing a draw
   */
  public playUndo() {
    if (this.isMuted || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  /**
   * Japanese Voice Speech Readout using Web Speech API
   */
  public speakNumber(num: number, enabled: boolean) {
    if (this.isMuted || !enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // cancel any ongoing speech
      const text = `${num}番！`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 1.0;
      utterance.volume = this.volume;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech API safe fallback
    }
  }
}

export const soundManager = new SoundManager();
