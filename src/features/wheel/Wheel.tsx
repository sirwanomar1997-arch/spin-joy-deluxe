import { useId } from 'react';
import { point, segmentPath } from './geometry';
import { useWheelMotion } from './use-wheel-motion';
import type { Wheel as WheelConfig } from './storage';
export function Wheel({ wheel, sound, onBusy }: { wheel: WheelConfig; sound: boolean; onBusy: (busy: boolean) => void }) {
  const motion = useWheelMotion(wheel.segments, sound);
  const uid = useId().replace(/:/g, '');
  const count = wheel.segments.length;
  return <>
    <div className="result-space" aria-live="polite" aria-atomic="true">
      {motion.winner !== null && <div className={`winner-name ${motion.winner.length > 16 ? 'winner-long' : ''}`}><span>{motion.winner.toLocaleUpperCase('sv-SE')}</span><div className="winner-rule" /></div>}
    </div>
    <div className={`wheel-stage ${motion.spinning ? 'is-spinning' : ''} ${motion.winner !== null ? 'has-winner' : ''}`}>
      <div className="wheel-surface" aria-label="Lyckohjul" {...motion.handlers} data-spinning={motion.spinning}>
        <svg ref={motion.svgRef} className="rotating-wheel" viewBox="0 0 600 600" role="img" aria-label={`${count} lika stora segment`} data-rotation="0">
          <defs>
            <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1"><stop className="metal-medium" offset="0" /><stop className="metal-light" offset=".18" /><stop className="metal-dark" offset=".36" /><stop className="metal-medium" offset=".65" /><stop className="metal-light" offset=".82" /><stop className="metal-dark" offset="1" /></linearGradient>
            {Array.from({ length: 7 }, (_, i) => <radialGradient key={i} id={`${uid}-enamel-${i}`} cx=".38" cy=".28" r=".8"><stop className={`enamel-light segment-${i}`} offset="0" /><stop className={`enamel-base segment-${i}`} offset=".55" /><stop className={`enamel-deep segment-${i}`} offset="1" /></radialGradient>)}
            <radialGradient id={`${uid}-glass`} cx=".35" cy=".2" r=".9"><stop className="glass-highlight" offset="0" /><stop className="glass-clear" offset=".4" /><stop className="glass-shadow" offset="1" /></radialGradient>
            <linearGradient id={`${uid}-hub`} x1="0" y1="0" x2="1" y2="1"><stop className="metal-medium" offset="0" /><stop className="metal-dark" offset=".4" /><stop className="metal-medium" offset=".51" /><stop className="metal-dark" offset=".7" /><stop className="metal-medium" offset="1" /></linearGradient>
            <linearGradient id={`${uid}-peg`} x1="0" y1="0" x2="1" y2="1"><stop className="metal-light" offset="0" /><stop className="metal-dark" offset=".45" /><stop className="metal-medium" offset=".7" /><stop className="metal-dark" offset="1" /></linearGradient>
            {wheel.segments.map((_, i) => <clipPath id={`${uid}-clip-${i}`} key={i}><path d={segmentPath(i, count)} /></clipPath>)}
          </defs>
          <circle cx="300" cy="300" r="293" fill={`url(#${uid}-rim)`} className="rim-outline" />
          <circle cx="300" cy="300" r="290" className="rim-hairline" />
          <circle cx="300" cy="300" r="284" className="rim-inlay" />
          <circle cx="300" cy="300" r="282" className="inner-rim" />
          {wheel.segments.map((label, i) => {
            const middle = -90 + (i + .5) * 360 / count;
            const pos = point(middle, 187);
            const left = middle > 90 && middle < 270;
            const text = label.toLocaleUpperCase('sv-SE');
            const fontSize = Math.min(count > 16 ? 23 : count > 12 ? 28 : 34, 158 / Math.max(text.length * .66, 1), count === 1 ? 34 : 2 * 108 * Math.sin(Math.PI / count) * .8);
            const color = i === count - 1 && i % 7 === 0 ? 3 : i % 7;
            return <g key={i}>
              <path d={segmentPath(i, count)} className="segment" fill={`url(#${uid}-enamel-${color})`} />
              <path d={segmentPath(i, count)} fill={`url(#${uid}-glass)`} className="segment-reflection" />
              <path d={segmentPath(i, count)} className="segment-bevel" />
              <g clipPath={`url(#${uid}-clip-${i})`}><text x={pos.x} y={pos.y} fontSize={fontSize} transform={`rotate(${middle + (left ? 180 : 0)} ${pos.x} ${pos.y})`} textAnchor="middle" dominantBaseline="central" className="segment-label">{text}</text></g>
            </g>;
          })}
          <circle cx="300" cy="300" r="280" className="segment-inner-edge" />
          <circle cx="300" cy="300" r="277" className="face-hairline" />
          {wheel.segments.map((_, i) => {
            const pos = point(-90 + i * 360 / count, 287);
            return <g key={`peg-${i}`} className="rim-pin"><ellipse cx={pos.x} cy={pos.y + 2.5} rx="5.2" ry="5.8" className="pin-shadow" /><circle cx={pos.x} cy={pos.y} r="4.7" fill={`url(#${uid}-peg)`} className="peg" /><circle cx={pos.x - 1.2} cy={pos.y - 1.5} r="1.25" className="peg-highlight" /></g>;
          })}
          <circle cx="300" cy="304" r="76" className="hub-shadow" />
          <circle cx="300" cy="300" r="73" fill={`url(#${uid}-rim)`} className="hub-edge" />
          <circle cx="300" cy="300" r="70" className="hub-inlay" />
          <circle cx="300" cy="300" r="68" fill={`url(#${uid}-hub)`} />
          <circle cx="300" cy="300" r="64" className="hub-hairline" />
          <path d="M257 275 A50 50 0 0 1 328 258" className="hub-reflection" />
          <circle cx="300" cy="300" r="8" fill={`url(#${uid}-peg)`} className="hub-axle" />
          <path d="M296 300 H304" className="axle-slot" />
        </svg>
      </div>
      <svg className="gold-pointer" viewBox="0 0 64 96" aria-hidden="true"><defs><linearGradient id={`${uid}-gold`} x1="0" y1=".4" x2="1" y2=".6"><stop className="gold-deep" offset="0"/><stop className="gold-bright" offset=".18"/><stop className="gold-light" offset=".35"/><stop className="gold-bright" offset=".65"/><stop className="gold-deep" offset="1"/></linearGradient></defs><circle cx="32" cy="18" r="24" fill={`url(#${uid}-hub)`} className="pointer-mount" /><g ref={motion.pointerRef} className="pointer-flapper"><path d="M32 92 C27 78 6 40 6 28 C6 -4 58 -4 58 28 C58 40 37 78 32 92Z" fill={`url(#${uid}-gold)`} className="pointer-edge"/><path d="M29 82 C23 63 11 37 11 27 C11 14 20 8 29 7" className="pointer-shine" /></g><circle cx="32" cy="18" r="7" fill={`url(#${uid}-peg)`} className="pointer-pivot" /><path d="M29 18 H35" className="axle-slot" /></svg>
    </div>
    <BusySignal spinning={motion.spinning} onBusy={onBusy} />
  </>;
}
import { useEffect } from 'react';
function BusySignal({ spinning, onBusy }: { spinning: boolean; onBusy: (busy: boolean) => void }) {
  useEffect(() => { onBusy?.(spinning); return () => onBusy?.(false); }, [spinning, onBusy]);
  return null;
}
