/**
 * Enhanced procedural SFX generator using Web Audio API.
 * Produces game-quality sounds with layered synthesis.
 *
 * To replace with real audio files later:
 * 1. Download from https://kenney.nl/assets or https://pixabay.com/sound-effects/
 * 2. Place .ogg files in public/assets/sfx/
 * 3. Call sfx.loadFromFiles(scene) in Preloader
 */
export class SFXManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.7;

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) this.masterGain.gain.value = this.volume;
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private getDest(): AudioNode {
    this.getCtx();
    return this.masterGain!;
  }

  // ── Attack hit: layered noise + tone sweep + low thud ──
  playAttack(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      // Low thud
      const thud = ctx.createOscillator();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(120, now);
      thud.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      const thudGain = ctx.createGain();
      thudGain.gain.setValueAtTime(0.4, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      thud.connect(thudGain).connect(dest);
      thud.start(now); thud.stop(now + 0.15);

      // Mid crack
      const crack = ctx.createOscillator();
      crack.type = 'sawtooth';
      crack.frequency.setValueAtTime(300, now);
      crack.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.15, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      crack.connect(crackGain).connect(dest);
      crack.start(now); crack.stop(now + 0.08);

      // High noise burst
      const noise = this.createNoise(ctx, 0.06);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      const hiFilter = ctx.createBiquadFilter();
      hiFilter.type = 'highpass';
      hiFilter.frequency.value = 3000;
      noise.connect(hiFilter).connect(noiseGain).connect(dest);
      noise.start(now); noise.stop(now + 0.06);
    } catch { /* audio unavailable */ }
  }

  // ── Block: resonant metallic ping + low rumble ──
  playBlock(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      // Metallic ping
      [600, 1200, 1800].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const t = now + i * 0.015;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12 / (i + 1), t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + 0.25);
      });

      // Low rumble
      const rumble = this.createNoise(ctx, 0.1);
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.1, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 400;
      rumble.connect(lp).connect(rumbleGain).connect(dest);
      rumble.start(now); rumble.stop(now + 0.1);
    } catch { /* audio unavailable */ }
  }

  // ── Card play: quick whoosh with pitch bend ──
  playCardPlay(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      // Filtered noise sweep
      const noise = this.createNoise(ctx, 0.15);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(800, now);
      bp.frequency.exponentialRampToValueAtTime(3000, now + 0.05);
      bp.frequency.exponentialRampToValueAtTime(500, now + 0.15);
      bp.Q.value = 3;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      noise.connect(bp).connect(gain).connect(dest);
      noise.start(now); noise.stop(now + 0.15);

      // Subtle tonal element
      const tone = ctx.createOscillator();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(400, now);
      tone.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      const toneGain = ctx.createGain();
      toneGain.gain.setValueAtTime(0.06, now);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      tone.connect(toneGain).connect(dest);
      tone.start(now); tone.stop(now + 0.1);
    } catch { /* audio unavailable */ }
  }

  // ── Heal: ascending arpeggio with shimmer ──
  playHeal(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const t = now + i * 0.07;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + 0.35);
      });

      // Shimmer layer
      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 2093; // C7
      const shimGain = ctx.createGain();
      shimGain.gain.setValueAtTime(0, now + 0.1);
      shimGain.gain.linearRampToValueAtTime(0.04, now + 0.15);
      shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      shimmer.connect(shimGain).connect(dest);
      shimmer.start(now + 0.1); shimmer.stop(now + 0.5);
    } catch { /* audio unavailable */ }
  }

  // ── Energy: rising synth sweep ──
  playEnergy(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain).connect(dest);
      osc.start(now); osc.stop(now + 0.2);

      // Sub bass
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = 80;
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.08, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      sub.connect(subGain).connect(dest);
      sub.start(now); sub.stop(now + 0.15);
    } catch { /* audio unavailable */ }
  }

  // ── Form switch: dramatic multi-layer sweep ──
  playFormSwitch(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      // Rising saw
      const saw = ctx.createOscillator();
      saw.type = 'sawtooth';
      saw.frequency.setValueAtTime(80, now);
      saw.frequency.exponentialRampToValueAtTime(600, now + 0.25);
      saw.frequency.exponentialRampToValueAtTime(200, now + 0.5);
      const sawGain = ctx.createGain();
      sawGain.gain.setValueAtTime(0.08, now);
      sawGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2000;
      saw.connect(lp).connect(sawGain).connect(dest);
      saw.start(now); saw.stop(now + 0.5);

      // Impact at peak
      const impact = ctx.createOscillator();
      impact.type = 'sine';
      impact.frequency.value = 200;
      const impGain = ctx.createGain();
      impGain.gain.setValueAtTime(0, now + 0.24);
      impGain.gain.linearRampToValueAtTime(0.3, now + 0.26);
      impGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      impact.connect(impGain).connect(dest);
      impact.start(now + 0.24); impact.stop(now + 0.5);

      // Noise crash
      const crash = this.createNoise(ctx, 0.15);
      const crashGain = ctx.createGain();
      crashGain.gain.setValueAtTime(0, now + 0.24);
      crashGain.gain.linearRampToValueAtTime(0.15, now + 0.26);
      crashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      crash.connect(crashGain).connect(dest);
      crash.start(now + 0.24); crash.stop(now + 0.4);
    } catch { /* audio unavailable */ }
  }

  // ── Victory: triumphant fanfare ──
  playVictory(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      const notes = [
        { freq: 523, time: 0, dur: 0.2 },     // C5
        { freq: 659, time: 0.15, dur: 0.2 },   // E5
        { freq: 784, time: 0.3, dur: 0.2 },    // G5
        { freq: 1047, time: 0.45, dur: 0.6 },  // C6 (sustained)
      ];
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const gain = ctx.createGain();
        const t = now + note.time;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
        gain.gain.setValueAtTime(0.12, t + note.dur * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + note.dur);
      });

      // Sparkle layer
      [2093, 2637].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const t = now + 0.5 + i * 0.1;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + 0.4);
      });
    } catch { /* audio unavailable */ }
  }

  // ── Defeat: descending sad tone ──
  playDefeat(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();

      const notes = [
        { freq: 440, time: 0, dur: 0.4 },
        { freq: 392, time: 0.3, dur: 0.4 },
        { freq: 330, time: 0.6, dur: 0.4 },
        { freq: 262, time: 0.9, dur: 0.8 },
      ];
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        const gain = ctx.createGain();
        const t = now + note.time;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        gain.gain.setValueAtTime(0.1, t + note.dur * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + note.dur);
      });
    } catch { /* audio unavailable */ }
  }

  // ── Poison: bubbling ──
  playPoison(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const t = now + i * 0.06;
        osc.frequency.setValueAtTime(200 + Math.random() * 300, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + 0.1);
      }
    } catch { /* audio unavailable */ }
  }

  // ── Burn: crackling fire ──
  playBurn(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();
      const noise = this.createNoise(ctx, 0.2);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 4000;
      bp.Q.value = 1;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      noise.connect(bp).connect(gain).connect(dest);
      noise.start(now); noise.stop(now + 0.2);
    } catch { /* audio unavailable */ }
  }

  // ── Click ──
  playClick(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain).connect(this.getDest());
      osc.start(now); osc.stop(now + 0.04);
    } catch { /* audio unavailable */ }
  }

  // ── Enhance success: anvil ring ──
  playEnhanceSuccess(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const dest = this.getDest();
      [800, 1200, 1600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const t = now + i * 0.05;
        gain.gain.setValueAtTime(0.1 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain).connect(dest);
        osc.start(t); osc.stop(t + 0.4);
      });
    } catch { /* audio unavailable */ }
  }

  // ── Enhance fail: dull thud ──
  playEnhanceFail(): void {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain).connect(this.getDest());
      osc.start(now); osc.stop(now + 0.2);
    } catch { /* audio unavailable */ }
  }

  private createNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    return source;
  }

  // ── Procedural Battle BGM ──

  private bgmGain: GainNode | null = null;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private bgmPlaying: boolean = false;

  /** Start a procedural battle BGM loop. */
  startBattleBGM(): void {
    if (this.bgmPlaying) return;
    try {
      const ctx = this.getCtx();
      const dest = this.getDest();

      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.value = 0.08;
      this.bgmGain.connect(dest);

      // Simple 4-bar bass pattern in A minor
      const bassNotes = [110, 110, 130.81, 130.81, 146.83, 146.83, 130.81, 130.81]; // A2, A2, C3, C3, D3, D3, C3, C3
      const beatDuration = 0.4; // seconds per beat
      let beatIndex = 0;

      const playBeat = () => {
        if (!this.bgmPlaying || !this.bgmGain) return;
        const now = ctx.currentTime;
        const freq = bassNotes[beatIndex % bassNotes.length];

        // Bass
        const bass = ctx.createOscillator();
        bass.type = 'triangle';
        bass.frequency.value = freq;
        const bassGain = ctx.createGain();
        bassGain.gain.setValueAtTime(0.3, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + beatDuration * 0.8);
        bass.connect(bassGain).connect(this.bgmGain!);
        bass.start(now);
        bass.stop(now + beatDuration * 0.9);

        // Kick on beats 0, 4
        if (beatIndex % 4 === 0) {
          const kick = ctx.createOscillator();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(150, now);
          kick.frequency.exponentialRampToValueAtTime(40, now + 0.1);
          const kickGain = ctx.createGain();
          kickGain.gain.setValueAtTime(0.2, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          kick.connect(kickGain).connect(this.bgmGain!);
          kick.start(now);
          kick.stop(now + 0.15);
        }

        // Hi-hat on even beats
        if (beatIndex % 2 === 0) {
          const hat = this.createNoise(ctx, 0.04);
          const hatGain = ctx.createGain();
          hatGain.gain.setValueAtTime(0.06, now);
          hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 8000;
          hat.connect(hp).connect(hatGain).connect(this.bgmGain!);
          hat.start(now);
          hat.stop(now + 0.04);
        }

        // Chord stab every 4 beats
        if (beatIndex % 8 === 0) {
          [220, 261.63, 329.63].forEach((f) => { // A3, C4, E4 — A minor
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = f;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.03, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + beatDuration * 3);
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 1200;
            osc.connect(lp).connect(g).connect(this.bgmGain!);
            osc.start(now);
            osc.stop(now + beatDuration * 3);
          });
        }

        beatIndex++;
      };

      this.bgmPlaying = true;
      this.bgmInterval = setInterval(playBeat, beatDuration * 1000);
      playBeat(); // Start immediately
    } catch { /* audio unavailable */ }
  }

  /** Stop the procedural battle BGM. */
  stopBattleBGM(): void {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
  }
}

/** Singleton instance */
export const sfx = new SFXManager();
