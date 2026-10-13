import { describe, it, expect, vi } from 'vitest';
import { normalize, angleDelta, winnerIndex, segmentPath } from './geometry';
import { advance, releaseVelocity, FRICTION } from './physics';
import { initialStore, validateStore, writeStore, STORAGE_KEY } from './storage';
describe('wheel geometry', () => {
  it('normalizes signed rotations and many revolutions', () => { expect(normalize(-721)).toBe(359); expect(normalize(1081)).toBe(1); });
  it('crosses zero smoothly in both directions', () => { expect(angleDelta(1,359)).toBe(2); expect(angleDelta(359,1)).toBe(-2); });
  it('matches actual top pointer for every segment and count', () => {
    for(let n=1;n<=24;n++) for(let i=0;i<n;i++) for(const turns of [-30,0,40]) expect(winnerIndex(-(i+.5)*360/n+turns*360,n)).toBe(i);
  });
  it('has consistent boundaries and single segment', () => { expect(winnerIndex(0,12)).toBe(0); expect(winnerIndex(-30,12)).toBe(1); expect(winnerIndex(30,12)).toBe(11); expect(winnerIndex(-999,1)).toBe(0); expect(winnerIndex(0,0)).toBe(-1); expect(segmentPath(0,1)).toContain('A 278 278'); });
});
describe('wheel physics', () => {
  it('estimates signed speed and ignores stale release', () => { const s=[{time:0,angle:0},{time:50,angle:20},{time:100,angle:40}]; expect(releaseVelocity(s,100)).toBeCloseTo(400); expect(releaseVelocity(s.map(x=>({...x,angle:-x.angle})),100)).toBeCloseTo(-400); expect(releaseVelocity(s,250)).toBe(0); });
  it('conserves exact frame-independent exponential trajectory', () => { const full=advance(0,1000,1); let r=0,v=1000; for(let i=0;i<120;i++) { const step=advance(r,v,1/120); r=step.rotation; v=step.velocity; } expect(r).toBeCloseTo(full.rotation,8); expect(v).toBeCloseTo(full.velocity,8); });
  it('slows smoothly in either direction and stops without snapping', () => { for(const direction of [-1,1]) { let r=0,v=direction*800; for(let i=0;i<2000&&v;i++) { const step=advance(r,v,1/60); expect(Math.abs(step.velocity)).toBeLessThan(Math.abs(v)); expect(direction*(step.rotation-r)).toBeGreaterThanOrEqual(0); r=step.rotation; v=step.velocity; } expect(v).toBe(0); expect(r).toBeCloseTo(direction*(800-4)/FRICTION,5); } });
  it('fast release travels farther than slow release', () => { expect(advance(0,1200,20).rotation).toBeGreaterThan(advance(0,200,20).rotation*5); });
});
describe('local wheel store', () => {
  it('migrates old settings while preserving sound and wheels', () => { const s=initialStore(); const { background, ...oldSettings } = s.settings; expect(background).toBe('night'); const migrated=validateStore({...s, settings:{...oldSettings,sound:false}}); expect(migrated.settings.background).toBe('night'); expect(migrated.settings.sound).toBe(false); expect(migrated.wheels).toEqual(s.wheels); });
  it('persists all eight backgrounds and rejects unknown choices', () => { const s=initialStore(); for (const background of ['night','aurora','ocean','forest','satin','mist','nebula','depths']) expect(validateStore({...s, settings:{...s.settings,background}}).settings.background).toBe(background); expect(()=>validateStore({...s,settings:{...s.settings,background:'unknown'}})).toThrow('Ogiltig bakgrund'); });
  it('preserves order, empty text and several wheels', () => { const s=initialStore(); s.wheels.push({id:'test',title:'',segments:['','A','']}); s.activeId='test'; expect(validateStore(JSON.parse(JSON.stringify(s)))).toEqual(s); });
  it('rejects corrupt data and invalid segment counts', () => { expect(()=>validateStore({})).toThrow(); const s=initialStore(); const first=s.wheels[0]; if (!first) throw new Error('Missing fixture'); first.segments=[]; expect(()=>validateStore(s)).toThrow(); });
  it('persists settings without deleting wheels and surfaces failures', () => { const s=initialStore(); writeStore(s); expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')).toEqual(s); const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Quota');}); expect(()=>writeStore(s)).toThrow('Quota'); spy.mockRestore(); });
});
