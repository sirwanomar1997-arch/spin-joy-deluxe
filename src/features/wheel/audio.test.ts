import { afterEach, describe, expect, it, vi } from 'vitest';
import { WheelAudio } from './audio';

afterEach(() => vi.unstubAllGlobals());

describe('wheel audio', () => {
  it('keeps mechanical clicks and the winner chime without a looping noise buffer', () => {
    const sources: { loop: boolean; start: ReturnType<typeof vi.fn> }[] = [];
    const frequencies: number[] = [];
    const oscillatorTypes: string[] = [];
    const peaks: number[] = [];
    const parameter = () => ({ setValueAtTime: vi.fn(), exponentialRampToValueAtTime: (value: number) => peaks.push(value) });
    class FakeContext {
      state = 'running'; sampleRate = 48000; currentTime = 0; destination = {};
      resume = vi.fn().mockResolvedValue(undefined);
      close = vi.fn().mockResolvedValue(undefined);
      createBuffer = vi.fn(() => ({}));
      createBufferSource() {
        const source = { loop: false, start: vi.fn(), connect: vi.fn(), disconnect: vi.fn(), buffer: {}, onended: null };
        sources.push(source); return source;
      }
      createGain() { return { gain: parameter(), connect: vi.fn(), disconnect: vi.fn() }; }
      createOscillator() {
        const oscillator = { type: '', frequency: { setValueAtTime: (f: number) => frequencies.push(f) }, connect: vi.fn(), disconnect: vi.fn(), start: () => oscillatorTypes.push(oscillator.type), stop: vi.fn(), onended: null };
        return oscillator;
      }
    }
    vi.stubGlobal('AudioContext', FakeContext);
    const audio = new WheelAudio();
    audio.unlock(); audio.tick(); audio.finish();
    expect(sources).toHaveLength(1); // Only the silent mobile unlock, never a noise loop.
    expect(sources.every(source => !source.loop)).toBe(true);
    expect(frequencies.slice(0, 2)).toEqual([420, 1260]);
    expect(oscillatorTypes.slice(0, 2)).toEqual(['triangle', 'sine']);
    expect(peaks.slice(0, 4)).toEqual([.28, .0001, .085, .0001]);
    expect(frequencies.slice(2)).toEqual([523.25, 1046.5, 659.25, 1318.5, 783.99, 1567.98, 1046.5, 2093, 261.63, 392]);
    audio.close();
  });
  it('resumes interrupted audio before playing the next spin click', async () => {
    let context: FakeContext | undefined;
    const started = vi.fn();
    const param = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
    class FakeContext {
      state = 'suspended'; currentTime = 0; sampleRate = 48000; destination = {};
      constructor() { context = this; }
      resume = vi.fn(async () => { this.state = 'running'; });
      createBuffer() { return {}; }
      createBufferSource() { return { connect: vi.fn(), start: vi.fn(), disconnect: vi.fn() }; }
      createOscillator() { return { frequency: param, connect: vi.fn(), start: started, stop: vi.fn() }; }
      createGain() { return { gain: param, connect: vi.fn() }; }
    }
    vi.stubGlobal('AudioContext', FakeContext);
    const audio = new WheelAudio(); audio.unlock();
    if (!context) throw new Error('Missing audio context');
    context.state = 'suspended';
    audio.tick(); await Promise.resolve();
    expect(context.resume).toHaveBeenCalledTimes(2);
    expect(started).toHaveBeenCalledTimes(2);
  });
});