export class WheelAudio {
  private context: AudioContext | null = null;
  unlock() {
    try {
      // iOS: play through the silent switch like a media app instead of as a muted ringer sound.
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session && session.type !== 'playback') session.type = 'playback';
      if (!this.context || this.context.state === 'closed') {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.context = new Ctx({ latencyHint: 'interactive' });
      }
      void this.context.resume().catch(() => {});
      // Prime mobile audio hardware inside the pointer gesture, without audible autoplay.
      const source = this.context.createBufferSource();
      source.buffer = this.context.createBuffer(1, 1, this.context.sampleRate);
      source.connect(this.context.destination); source.start();
      source.onended = () => source.disconnect();
    } catch { /* Audio is optional. */ }
  }
  tone(frequency: number, duration: number, gain: number, offset = 0, type: OscillatorType = 'sine') {
    const ctx = this.context;
    if (!ctx || ctx.state === 'closed') return;
    if (ctx.state !== 'running') void ctx.resume().catch(() => {});
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const start = ctx.currentTime + offset;
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start); envelope.gain.exponentialRampToValueAtTime(gain, start + (type === 'triangle' ? .002 : .006)); envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope); envelope.connect(ctx.destination);
    oscillator.start(start); oscillator.stop(start + duration);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  tick() {
    const ctx = this.context;
    if (!ctx || ctx.state === 'closed') return;
    const play = () => { this.tone(520, .075, .28, 0, 'triangle'); this.tone(1560, .045, .085); };
    // Mobile browsers may interrupt audio when backgrounded; recover on the next pin contact.
    if (ctx.state !== 'running') { void ctx.resume().then(play).catch(() => {}); return; }
    play();
  }
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
