import { describe, it, expect, vi } from 'vitest';
import { normalize, angleDelta, winnerIndex, segmentPath, pointerDeflection } from './geometry';
import { advance, releaseVelocity, FRICTION, STOP_SPEED } from './physics';
import { initialStore, newWheel, validateStore, writeStore, STORAGE_KEY } from './storage';
import { labelMetrics } from './labels';
describe('emoji labels', () => {
  it('keeps joined emojis intact and makes them larger than surrounding text', () => { const m=labelMetrics('Alma 👨‍👩‍👧‍👦',12); expect(m.glyphs.filter(g=>g.emoji).map(g=>g.text)).toEqual(['👨‍👩‍👧‍👦']); expect(m.emojiSize).toBeGreaterThan(m.fontSize); });
  it('fits emoji-only labels in a narrow wedge', () => { const m=labelMetrics('🎉',24); expect(m.emojiSize).toBeLessThanOrEqual(2*108*Math.sin(Math.PI/24)*.8); expect(m.fontSize).toBeGreaterThan(0); });
});
describe('wheel geometry', () => {
  it('normalizes signed rotations and many revolutions', () => { expect(normalize(-721)).toBe(359); expect(normalize(1081)).toBe(1); });
  it('crosses zero smoothly in both directions', () => { expect(angleDelta(1,359)).toBe(2); expect(angleDelta(359,1)).toBe(-2); });
  it('matches actual top pointer for every segment and count', () => {
    for(let n=1;n<=24;n++) for(let i=0;i<n;i++) for(const turns of [-30,0,40]) expect(winnerIndex(-(i+.5)*360/n+turns*360,n)).toBe(i);
  });
  it('has consistent boundaries and single segment', () => { expect(winnerIndex(0,12)).toBe(0); expect(winnerIndex(-30,12)).toBe(1); expect(winnerIndex(30,12)).toBe(11); expect(winnerIndex(-999,1)).toBe(0); expect(winnerIndex(0,0)).toBe(-1); expect(segmentPath(0,1)).toContain('A 278 278'); });
  it('yields at actual pins in both directions and clears away from contact', () => { expect(pointerDeflection(-1.5,12,1)).toBeCloseTo(-23); expect(pointerDeflection(1.5,12,-1)).toBeCloseTo(23); expect(pointerDeflection(15,12,1)).toBe(0); expect(pointerDeflection(0,12,0)).toBe(0); expect(pointerDeflection(1078.5,12,1)).toBeCloseTo(-23); });
});
describe('wheel physics', () => {
  it('estimates signed speed and ignores stale release', () => { const s=[{time:0,angle:0},{time:50,angle:20},{time:100,angle:40}]; expect(releaseVelocity(s,100)).toBeCloseTo(400); expect(releaseVelocity(s.map(x=>({...x,angle:-x.angle})),100)).toBeCloseTo(-400); expect(releaseVelocity(s,250)).toBe(0); });
  it('conserves exact frame-independent exponential trajectory', () => { const full=advance(0,1000,1); let r=0,v=1000; for(let i=0;i<120;i++) { const step=advance(r,v,1/120); r=step.rotation; v=step.velocity; } expect(r).toBeCloseTo(full.rotation,8); expect(v).toBeCloseTo(full.velocity,8); });
  it('slows smoothly in either direction and stops without snapping', () => { for(const direction of [-1,1]) { let r=0,v=direction*800; for(let i=0;i<2000&&v;i++) { const step=advance(r,v,1/60); expect(Math.abs(step.velocity)).toBeLessThan(Math.abs(v)); expect(direction*(step.rotation-r)).toBeGreaterThanOrEqual(0); r=step.rotation; v=step.velocity; } expect(v).toBe(0); expect(r).toBeCloseTo(direction*(800-STOP_SPEED)/FRICTION,5); } });
  it('builds suspense with a longer gentle coast and sub-degree final movement', () => { expect(Math.log(800/STOP_SPEED)/FRICTION).toBeGreaterThan(15); const slow=advance(100,2,1/60); expect(slow.rotation-100).toBeLessThan(.04); expect(advance(0,0,1)).toEqual({rotation:0,velocity:0}); });
  it('fast release travels farther than slow release', () => { expect(advance(0,1200,20).rotation).toBeGreaterThan(advance(0,200,20).rotation*5); });
});
describe('local wheel store', () => {
  it('starts a first installation with an empty title', () => { expect(initialStore().wheels[0]?.title).toBe(''); });
  it('starts a first installation with exactly 14 empty fields', () => { expect(initialStore().wheels[0]?.segments).toEqual(Array(14).fill('')); });
  it('creates additional blank wheels with 14 empty fields', () => { const w = newWheel(); expect(w.title).toBe(''); expect(w.segments).toEqual(Array(14).fill('')); });
  it('replaces only the untouched shipped sample on upgrade', () => {
    const s = initialStore();
    const sample = { id: 'deluxe-original', title: 'WHOOO PAYS?!', segments: ['Rayan', 'Alma', 'Noah', 'Leila', 'Adam', 'Maya', 'Leo', 'Sara', 'Elias', 'Nora', 'Omar', 'Ella'] };
    s.wheels = [sample];
    expect(validateStore(s).wheels[0]).toEqual(initialStore().wheels[0]);
    const edited = { ...sample, title: 'My own wheel' };
    expect(validateStore({ ...s, wheels: [edited] }).wheels[0]).toEqual(edited);
    const editedLabels = { ...sample, segments: ['My choice', ...sample.segments.slice(1)] };
    expect(validateStore({ ...s, wheels: [editedLabels] }).wheels[0]).toEqual(editedLabels);
  });
  it('migrates old settings while preserving sound and wheels', () => { const s=initialStore(); const { background, ...oldSettings } = s.settings; expect(background).toBe('night'); const migrated=validateStore({...s, settings:{...oldSettings,sound:false}}); expect(migrated.settings.background).toBe('night'); expect(migrated.settings.sound).toBe(false); expect(migrated.wheels).toEqual(s.wheels); });
  it('persists all eight backgrounds and rejects unknown choices', () => { const s=initialStore(); for (const background of ['night','aurora','ocean','forest','satin','mist','nebula','depths']) expect(validateStore({...s, settings:{...s.settings,background}}).settings.background).toBe(background); expect(()=>validateStore({...s,settings:{...s.settings,background:'unknown'}})).toThrow('Ogiltig bakgrund'); });
  it('preserves order, empty text and several wheels', () => { const s=initialStore(); s.wheels.push({id:'test',title:'',segments:['','A','']}); s.activeId='test'; expect(validateStore(JSON.parse(JSON.stringify(s)))).toEqual(s); });
  it('rejects corrupt data and invalid segment counts', () => { expect(()=>validateStore({})).toThrow(); const s=initialStore(); const first=s.wheels[0]; if (!first) throw new Error('Missing fixture'); first.segments=[]; expect(()=>validateStore(s)).toThrow(); });
  it('persists settings without deleting wheels and surfaces failures', () => { const s=initialStore(); writeStore(s); expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')).toEqual(s); const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Quota');}); expect(()=>writeStore(s)).toThrow('Quota'); spy.mockRestore(); });
});
