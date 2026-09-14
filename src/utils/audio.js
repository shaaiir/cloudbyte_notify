// Web Audio API Paper Page Flip Sound Synthesizer

class PageFlipSoundEffect {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlipSound(direction = 'forward') {
    if (!this.enabled) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // 1. Noise buffer generation for paper swoosh
      const bufferSize = this.ctx.sampleRate * 0.18; // 180ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Filtered white noise with random decay
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.8);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // 2. High-pass and Band-pass filter to sound like paper sliding
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(direction === 'forward' ? 1200 : 950, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
      filter.Q.setValueAtTime(1.5, now);

      // 3. Gain envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      // Connect nodes
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.18);
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundFx = new PageFlipSoundEffect();
