import { afterEach, describe, expect, it, vi } from 'vitest';
import { WheelAudio } from './audio';

afterEach(() => vi.unstubAllGlobals());

describe('wheel audio', () => {
  it('keeps mechanical clicks and the winner chime without a looping noise buffer', () => {
    const sources: { loop: boolean; start: ReturnType<typeof vi.fn> }[] = [];
    const frequencies: number[] = [];
    const parameter = () => ({ setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
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
        return { type: '', frequency: { setValueAtTime: (f: number) => frequencies.push(f) }, connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
      }
    }
    vi.stubGlobal('AudioContext', FakeContext);
    const audio = new WheelAudio();
    audio.unlock(); audio.tick(); audio.finish();
    expect(sources).toHaveLength(1); // Only the silent mobile unlock, never a noise loop.
    expect(sources.every(source => !source.loop)).toBe(true);
    expect(frequencies.slice(0, 2)).toEqual([520, 1560]);
    expect(frequencies.slice(2)).toEqual([523.25, 1046.5, 659.25, 1318.5, 783.99, 1567.98, 1046.5, 2093, 261.63, 392]);
    audio.close();
  });
});