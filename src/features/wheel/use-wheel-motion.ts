import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { angleDelta, normalize, winnerIndex } from './geometry';
import { advance, releaseVelocity, type Sample } from './physics';
import { WheelAudio } from './audio';
export function useWheelMotion(segments: string[], sound: boolean) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rotation = useRef(0);
  const frame = useRef(0);
  const busy = useRef(false);
  const drag = useRef<{ id: number; angle: number; samples: Sample[]; moved: number } | null>(null);
  const audio = useRef<WheelAudio | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const lastTick = useRef(0);
  useEffect(() => () => { cancelAnimationFrame(frame.current); audio.current?.close(); }, []);
  function paint(angle: number) {
    const previous = rotation.current;
    rotation.current = angle;
    if (svgRef.current) { svgRef.current.style.transform = `rotate(${angle}deg)`; svgRef.current.dataset['rotation'] = String(angle); }
    if (sound && Math.floor(previous / (360 / segments.length)) !== Math.floor(angle / (360 / segments.length)) && performance.now() - lastTick.current > 45) { audio.current?.tick(); lastTick.current = performance.now(); }
  }
  function finish() {
    busy.current = false; setSpinning(false);
    paint(normalize(rotation.current));
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
    paint(rotation.current + delta);
    const now = performance.now();
    current.samples.push({ time: now, angle: rotation.current });
    current.samples = current.samples.filter(s => now - s.time < 150);
  }
  function release(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (current.moved <= 2) return;
    const velocity = cancelled ? 0 : releaseVelocity(current.samples, performance.now());
    if (Math.abs(velocity) <= 4) { finish(); return; }
    busy.current = true; setSpinning(true);
    let speed = velocity, last = performance.now();
    function step(now: number) {
      const next = advance(rotation.current, speed, (now - last) / 1000);
      last = now; speed = next.velocity; paint(next.rotation);
      if (speed === 0) finish(); else frame.current = requestAnimationFrame(step);
    }
    frame.current = requestAnimationFrame(step);
  }
  return { svgRef, spinning, winner, handlers: { onPointerDown, onPointerMove, onPointerUp: (e: PointerEvent<HTMLDivElement>) => release(e), onPointerCancel: (e: PointerEvent<HTMLDivElement>) => release(e, true), onLostPointerCapture: (e: PointerEvent<HTMLDivElement>) => { if (drag.current) release(e, true); } } };
}
