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
    <div className={`wheel-stage ${motion.spinning ? 'is-spinning' : ''}`}>
      <div className="wheel-surface" aria-label="Lyckohjul" {...motion.handlers} data-spinning={motion.spinning}>
        <svg ref={motion.svgRef} className="rotating-wheel" viewBox="0 0 600 600" role="img" aria-label={`${count} lika stora segment`} data-rotation="0">
          <defs>
            <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1"><stop className="metal-dark" offset="0" /><stop className="metal-light" offset=".24" /><stop className="metal-dark" offset=".45" /><stop className="metal-medium" offset=".7" /><stop className="metal-dark" offset="1" /></linearGradient>
            <radialGradient id={`${uid}-glass`} cx=".35" cy=".2" r=".9"><stop className="glass-highlight" offset="0" /><stop className="glass-clear" offset=".4" /><stop className="glass-shadow" offset="1" /></radialGradient>
            <linearGradient id={`${uid}-hub`} x1="0" y1="0" x2="1" y2="1"><stop className="metal-medium" offset="0" /><stop className="metal-dark" offset=".4" /><stop className="metal-medium" offset=".51" /><stop className="metal-dark" offset=".7" /><stop className="metal-medium" offset="1" /></linearGradient>
            <linearGradient id={`${uid}-peg`} x1="0" y1="0" x2="1" y2="1"><stop className="metal-light" offset="0" /><stop className="metal-dark" offset=".45" /><stop className="metal-medium" offset=".7" /><stop className="metal-dark" offset="1" /></linearGradient>
            {wheel.segments.map((_, i) => <clipPath id={`${uid}-clip-${i}`} key={i}><path d={segmentPath(i, count)} /></clipPath>)}
          </defs>
          <circle cx="300" cy="300" r="293" fill={`url(#${uid}-rim)`} className="rim-outline" />
          <circle cx="300" cy="300" r="282" className="inner-rim" />
          {wheel.segments.map((label, i) => {
            const middle = -90 + (i + .5) * 360 / count;
            const pos = point(middle, 181);
            const left = middle > 90 && middle < 270;
            const text = label.toLocaleUpperCase('sv-SE');
            const fontSize = Math.min(count > 16 ? 15 : 19, 136 / Math.max(text.length * .64, 1));
            const color = i === count - 1 && i % 7 === 0 ? 3 : i % 7;
            return <g key={i}>
              <path d={segmentPath(i, count)} className={`segment segment-${color}`} />
              <path d={segmentPath(i, count)} fill={`url(#${uid}-glass)`} className="segment-reflection" />
              <g clipPath={`url(#${uid}-clip-${i})`}><text x={pos.x} y={pos.y} fontSize={fontSize} transform={`rotate(${middle + (left ? 180 : 0)} ${pos.x} ${pos.y})`} textAnchor="middle" dominantBaseline="central" className="segment-label">{text}</text></g>
            </g>;
          })}
          <circle cx="300" cy="300" r="280" className="segment-inner-edge" />
          {count > 1 && wheel.segments.map((_, i) => {
            const angle = -90 + i * 360 / count;
            const pos = point(angle, 282);
            return <g key={i} transform={`translate(${pos.x} ${pos.y}) rotate(${angle + 90})`}><rect x="-6" y="-13" width="12" height="28" rx="6" fill={`url(#${uid}-peg)`} className="peg" /><circle cy="-6" r="2" className="peg-highlight" /></g>;
          })}
          <circle cx="300" cy="303" r="91" className="hub-shadow" />
          <circle cx="300" cy="300" r="89" fill={`url(#${uid}-hub)`} className="hub-edge" />
          <circle cx="300" cy="300" r="85" className="hub-hairline" />
        </svg>
      </div>
      <svg className="gold-pointer" viewBox="0 0 64 96" aria-hidden="true"><defs><linearGradient id={`${uid}-gold`} x1="0" y1=".4" x2="1" y2=".6"><stop className="gold-deep" offset="0"/><stop className="gold-bright" offset=".18"/><stop className="gold-light" offset=".35"/><stop className="gold-bright" offset=".65"/><stop className="gold-deep" offset="1"/></linearGradient></defs><path d="M32 92 C27 78 6 40 6 28 C6 -4 58 -4 58 28 C58 40 37 78 32 92Z" fill={`url(#${uid}-gold)`} className="pointer-edge"/><path d="M29 82 C23 63 11 37 11 27 C11 14 20 8 29 7" className="pointer-shine" /></svg>
    </div>
    <BusySignal spinning={motion.spinning} onBusy={onBusy} />
  </>;
}
import { useEffect } from 'react';
function BusySignal({ spinning, onBusy }: { spinning: boolean; onBusy: (busy: boolean) => void }) {
  useEffect(() => { onBusy?.(spinning); return () => onBusy?.(false); }, [spinning, onBusy]);
  return null;
}
