export class WheelAudio {
  private context: AudioContext | null = null;
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
  tick() { this.tone(520, .055, .12); this.tone(1560, .03, .035); }
  finish() {
    // A soft ascending bell phrase, with restrained harmonics and a warm final chord.
    [523.25, 659.25, 783.99, 1046.5].forEach((note, i) => {
      this.tone(note, .9, .11, i * .14);
      this.tone(note * 2, .55, .022, i * .14);
    });
    this.tone(261.63, 1.2, .065, .42); this.tone(392, 1.1, .035, .42);
  }
  close() { void this.context?.close().catch(() => {}); this.context = null; }
}
