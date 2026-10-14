export class WheelAudio {
  private context: AudioContext | null = null;
  private spinSource: AudioBufferSourceNode | null = null;
  private spinGain: GainNode | null = null;
  private spinFilter: BiquadFilterNode | null = null;
  unlock() {
    try {
      this.context ??= new AudioContext();
      void this.context.resume().catch(() => {});
      // Prime mobile audio hardware inside the pointer gesture, without audible autoplay.
      const source = this.context.createBufferSource();
      source.buffer = this.context.createBuffer(1, 1, this.context.sampleRate);
      source.connect(this.context.destination); source.start();
      source.onended = () => source.disconnect();
    } catch { /* Audio is optional. */ }
  }
  tone(frequency: number, duration: number, gain: number, offset = 0) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const start = ctx.currentTime + offset;
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start); envelope.gain.exponentialRampToValueAtTime(gain, start + .006); envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope); envelope.connect(ctx.destination);
    oscillator.start(start); oscillator.stop(start + duration);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  updateSpin(speed: number) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    if (speed < .7) { this.spinGain?.gain.setTargetAtTime(.0001, ctx.currentTime, .05); return; }
    if (!this.spinSource) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.spinSource = ctx.createBufferSource(); this.spinSource.buffer = buffer; this.spinSource.loop = true;
      this.spinFilter = ctx.createBiquadFilter(); this.spinFilter.type = 'bandpass'; this.spinFilter.Q.value = .65;
      this.spinGain = ctx.createGain(); this.spinGain.gain.value = 0;
      this.spinSource.connect(this.spinFilter); this.spinFilter.connect(this.spinGain); this.spinGain.connect(ctx.destination);
      this.spinSource.start();
    }
    const intensity = Math.min(speed / 1500, 1);
    this.spinFilter?.frequency.setTargetAtTime(160 + intensity * 900, ctx.currentTime, .08);
    this.spinGain?.gain.setTargetAtTime(.003 * Math.min(speed / 20, 1) + intensity * .07, ctx.currentTime, .08);
  }
  stopSpin() {
    this.spinSource?.stop(); this.spinSource?.disconnect(); this.spinGain?.disconnect(); this.spinFilter?.disconnect();
    this.spinSource = null; this.spinGain = null; this.spinFilter = null;
  }
  tick() { this.tone(520, .055, .12); this.tone(1560, .03, .035); }
  finish() {
    this.stopSpin();
    // A soft ascending bell phrase, with restrained harmonics and a warm final chord.
    [523.25, 659.25, 783.99, 1046.5].forEach((note, i) => {
      this.tone(note, .9, .11, i * .14);
      this.tone(note * 2, .55, .022, i * .14);
    });
    this.tone(261.63, 1.2, .065, .42); this.tone(392, 1.1, .035, .42);
  }
  close() { this.stopSpin(); void this.context?.close().catch(() => {}); this.context = null; }
}
