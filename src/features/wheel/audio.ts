export class WheelAudio {
  private context: AudioContext | null = null;
  unlock() {
    try { this.context ??= new AudioContext(); void this.context.resume().catch(() => {}); } catch { /* Audio is optional. */ }
  }
  tone(frequency: number, duration: number, gain: number, offset = 0) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const start = ctx.currentTime + offset;
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(gain, start); envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope); envelope.connect(ctx.destination);
    oscillator.start(start); oscillator.stop(start + duration);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  tick() { this.tone(780, 0.025, 0.045); }
  finish() { this.tone(523.25, 0.4, 0.08); this.tone(659.25, 0.45, 0.06, 0.1); this.tone(783.99, 0.6, 0.06, 0.2); }
  close() { void this.context?.close().catch(() => {}); this.context = null; }
}
