/**
 * Xingling Web Sound Engine (SFX & Cosmic Ambient Audio)
 * Utilizes Web Audio API for zero-latency, high-performance procedural UI feedback,
 * and manages background cosmic soundtrack with smooth fading.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmAudio: HTMLAudioElement | null = null;

  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = false;
  private volume: number = 0.5;
  private lastHoverTime: number = 0;

  constructor() {
    // Read persisted sound preferences
    try {
      const raw = localStorage.getItem('xingling-reader-settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.sfx === 'boolean') this.sfxEnabled = parsed.sfx;
        if (typeof parsed.bgm === 'boolean') this.bgmEnabled = parsed.bgm;
        if (typeof parsed.volume === 'number') this.volume = parsed.volume;
      }
    } catch {
      /* ignore */
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 1 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? 0.35 : 0, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.initBgm();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private initBgm() {
    if (typeof window === 'undefined') return;
    if (this.bgmAudio) return;

    try {
      this.bgmAudio = new Audio('/audio/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.crossOrigin = 'anonymous';

      if (this.ctx && this.bgmGain) {
        const source = this.ctx.createMediaElementSource(this.bgmAudio);
        source.connect(this.bgmGain);
      }
    } catch {
      /* fallback if media source fails */
    }
  }

  /**
   * Must be called during or after a user interaction to unlock AudioContext.
   */
  public unlockAudio() {
    const ctx = this.initContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (this.bgmEnabled && this.bgmAudio && this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? 1 : 0, this.ctx.currentTime, 0.05);
    }
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    this.initContext();

    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(enabled ? 0.35 : 0, this.ctx.currentTime, 0.2);
    }

    if (this.bgmAudio) {
      if (enabled) {
        this.bgmAudio.play().catch(() => {});
      } else {
        setTimeout(() => {
          if (!this.bgmEnabled && this.bgmAudio) {
            this.bgmAudio.pause();
          }
        }, 300);
      }
    }
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  // ── Procedural Sound Effects ──

  /** Subtle high-tech hover tick with rate limiter */
  public playHover() {
    if (!this.sfxEnabled) return;
    const nowMs = performance.now();
    // throttle hover sounds to max 1 per 60ms to avoid audio clutter
    if (nowMs - this.lastHoverTime < 60) return;
    this.lastHoverTime = nowMs;

    try {
      const ctx = this.initContext();
      if (!ctx || !this.sfxGain) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.04);

      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch {
      /* ignore */
    }
  }

  /** Tactical sci-fi confirm blip */
  public playClick() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.sfxGain) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.06);

      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      /* ignore */
    }
  }

  /** Smooth modal open / card select tone */
  public playCardSelect() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.sfxGain) return;
      const t = ctx.currentTime;

      [523.25, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.03);

        gain.gain.setValueAtTime(0.04, t + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.03 + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(t + idx * 0.03);
        osc.stop(t + idx * 0.03 + 0.15);
      });
    } catch {
      /* ignore */
    }
  }

  /** Cosmic Warp transition sound for chapter switching */
  public playWarp() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.sfxGain) return;
      const t = ctx.currentTime;

      // Sub swoop
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(90, t);
      sub.frequency.exponentialRampToValueAtTime(320, t + 0.35);
      sub.frequency.exponentialRampToValueAtTime(50, t + 0.7);

      subGain.gain.setValueAtTime(0.08, t);
      subGain.gain.linearRampToValueAtTime(0.12, t + 0.3);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      sub.connect(subGain);
      subGain.connect(this.sfxGain);
      sub.start(t);
      sub.stop(t + 0.7);

      // Noise wash
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(2800, t + 0.25);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.6);
      filter.Q.value = 4;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, t);
      noiseGain.gain.linearRampToValueAtTime(0.08, t + 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + 0.6);
    } catch {
      /* ignore */
    }
  }

  /** Ethereal chime cascade for reading milestones and celebrations */
  public playChime() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.sfxGain) return;
      const t = ctx.currentTime;

      // Pentatonic crystal notes: C5, E5, G5, B5, C6
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.07);

        gain.gain.setValueAtTime(0, t + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.06 / (i * 0.3 + 1), t + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.5);
      });
    } catch {
      /* ignore */
    }
  }

  /** Soft page turn / flip sound */
  public playPageTurn() {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.initContext();
      if (!ctx || !this.sfxGain) return;
      const t = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + 0.12);
    } catch {
      /* ignore */
    }
  }
}

export const sfx = new SoundEngine();
