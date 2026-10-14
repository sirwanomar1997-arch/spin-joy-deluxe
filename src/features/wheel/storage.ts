export type Wheel = { id: string; title: string; segments: string[] };
export type BackgroundId = 'night' | 'aurora' | 'ocean' | 'forest' | 'satin' | 'mist' | 'nebula' | 'depths';
export type Settings = { sound: boolean; reducedMotion: boolean; background: BackgroundId };
export type Store = { version: 1; activeId: string; wheels: Wheel[]; settings: Settings };
export const STORAGE_KEY = 'spin-wheel-deluxe-v1';
export const defaults: Settings = { sound: true, reducedMotion: false, background: 'night' };
export const DEFAULT_WHEEL: Wheel = { id: 'deluxe-original', title: '', segments: Array(14).fill('') };
const LEGACY_SAMPLE = ['Rayan', 'Alma', 'Noah', 'Leila', 'Adam', 'Maya', 'Leo', 'Sara', 'Elias', 'Nora', 'Omar', 'Ella'];
export function newWheel(): Wheel {
  return { id: crypto.randomUUID(), title: '', segments: Array(14).fill('') };
}
export function initialStore(): Store {
  return { version: 1, activeId: DEFAULT_WHEEL.id, settings: { ...defaults }, wheels: [{ ...DEFAULT_WHEEL, segments: [...DEFAULT_WHEEL.segments] }] };
}
export function validateStore(value: unknown): Store {
  if (!value || typeof value !== 'object') throw new Error('Ogiltig lagring');
  const v = value as Partial<Store>;
  if (v.version !== 1 || !Array.isArray(v.wheels) || !v.wheels.length || v.wheels.length > 100 || !v.settings || typeof v.settings.sound !== 'boolean' || typeof v.settings.reducedMotion !== 'boolean') throw new Error('Ogiltig lagring');
  for (const w of v.wheels) {
    if (!w || typeof w.id !== 'string' || typeof w.title !== 'string' || w.title.length > 80 || !Array.isArray(w.segments) || w.segments.length < 1 || w.segments.length > 24 || w.segments.some(s => typeof s !== 'string' || s.length > 60)) throw new Error('Ogiltigt hjul');
  }
  if (new Set(v.wheels.map(w => w.id)).size !== v.wheels.length || !v.wheels.some(w => w.id === v.activeId)) throw new Error('Ogiltigt aktivt hjul');
  const background = v.settings.background ?? defaults.background;
  if (!['night', 'aurora', 'ocean', 'forest', 'satin', 'mist', 'nebula', 'depths'].includes(background)) throw new Error('Ogiltig bakgrund');
  // Replace only the untouched shipped sample; never overwrite a user's own edits.
  const wheels = v.wheels.map(w => w.id === DEFAULT_WHEEL.id && w.title === 'WHOOO PAYS?!' && w.segments.length === LEGACY_SAMPLE.length && w.segments.every((s, i) => s === LEGACY_SAMPLE[i])
    ? { ...DEFAULT_WHEEL, segments: [...DEFAULT_WHEEL.segments] }
    : w);
  return { ...(v as Store), wheels, settings: { ...v.settings, background } };
}
export function writeStore(store: Store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validateStore(store)));
}
