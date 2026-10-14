import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { angleDelta, pointerDeflection, winnerIndex } from './geometry';
import { advance, releaseVelocity, STOP_SPEED, type Sample } from './physics';
import { WheelAudio } from './audio';
export function useWheelMotion(segments: string[], sound: boolean) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const rotation = useRef(0);
  const frame = useRef(0);
  const busy = useRef(false);
  const drag = useRef<{ id: number; angle: number; samples: Sample[]; moved: number } | null>(null);
  const audio = useRef<WheelAudio | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const lastTick = useRef(0);
  useEffect(() => () => { cancelAnimationFrame(frame.current); audio.current?.close(); }, []);
  // Touch pointerdown is not a user activation in mobile browsers; touchend/pointerup/click are.
  useEffect(() => {
    if (!sound) return;
    const wake = () => { audio.current ??= new WheelAudio(); audio.current.unlock(); };
    const events = ['pointerup', 'touchend', 'click', 'keydown'] as const;
    events.forEach(name => window.addEventListener(name, wake, { passive: true }));
    return () => events.forEach(name => window.removeEventListener(name, wake));
  }, [sound]);
  function paint(angle: number) {
    const previous = rotation.current;
    rotation.current = angle;
    if (svgRef.current) { svgRef.current.style.transform = `rotate(${angle}deg)`; svgRef.current.dataset['rotation'] = String(angle); }
    pointerRef.current?.setAttribute('transform', `rotate(${pointerDeflection(angle, segments.length, angle - previous)} 32 18)`);
    if (sound && Math.floor(previous / (360 / segments.length)) !== Math.floor(angle / (360 / segments.length)) && performance.now() - lastTick.current > 45) { audio.current?.tick(); lastTick.current = performance.now(); }
  }
  function finish() {
    busy.current = false; setSpinning(false);
    // Keep the exact final angle: no rebase, snapping or extra turn at rest.
    pointerRef.current?.setAttribute('transform', 'rotate(0 32 18)');
    setWinner(segments[winnerIndex(rotation.current, segments.length)]?.trim() || 'TOMT SEGMENT');
    if (sound) audio.current?.finish();
  }
  function pointerAngle(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - box.top - box.height / 2, event.clientX - box.left - box.width / 2) * 180 / Math.PI;
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (busy.current || drag.current || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const box = event.currentTarget.getBoundingClientRect();
    const distance = Math.hypot(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2);
    if (distance < box.width * 0.16 || distance > box.width * 0.5) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    if (sound) { audio.current ??= new WheelAudio(); audio.current.unlock(); }
    drag.current = { id: event.pointerId, angle: pointerAngle(event), samples: [{ time: performance.now(), angle: rotation.current }], moved: 0 };
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const angle = pointerAngle(event), delta = angleDelta(angle, current.angle);
    current.angle = angle; current.moved += Math.abs(delta);
    if (current.moved > 2) setWinner(null);
    const now = performance.now();
    paint(rotation.current + delta);
    current.samples.push({ time: now, angle: rotation.current });
    current.samples = current.samples.filter(s => now - s.time < 150);
  }
  function release(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (sound) { audio.current ??= new WheelAudio(); audio.current.unlock(); }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (current.moved <= 2) return;
    const velocity = cancelled ? 0 : releaseVelocity(current.samples, performance.now());
    if (Math.abs(velocity) <= STOP_SPEED) { finish(); return; }
    busy.current = true; setSpinning(true);
    let speed = velocity, last = performance.now();
    let settlingAt: number | null = null;
    let settledDeflection = 0;
    function step(now: number) {
      if (settlingAt !== null) {
        const progress = Math.min(1, (now - settlingAt) / 240);
        pointerRef.current?.setAttribute('transform', `rotate(${settledDeflection * (1 - progress) ** 3} 32 18)`);
        if (progress === 1) finish(); else frame.current = requestAnimationFrame(step);
        return;
      }
      const previous = rotation.current;
      const next = advance(rotation.current, speed, (now - last) / 1000);
      last = now; speed = next.velocity; paint(next.rotation);
      if (speed === 0) {
        settledDeflection = pointerDeflection(next.rotation, segments.length, next.rotation - previous);
        settlingAt = now;
      }
      frame.current = requestAnimationFrame(step);
    }
    frame.current = requestAnimationFrame(step);
  }
  return { svgRef, pointerRef, spinning, winner, handlers: { onPointerDown, onPointerMove, onPointerUp: (e: PointerEvent<HTMLDivElement>) => release(e), onPointerCancel: (e: PointerEvent<HTMLDivElement>) => release(e, true), onLostPointerCapture: (e: PointerEvent<HTMLDivElement>) => { if (drag.current) release(e, true); } } };
}
// Hook-order changes cannot be hot-swapped into a mounted wheel; reload the page instead.
if (import.meta.hot) import.meta.hot.accept(() => window.location.reload());
