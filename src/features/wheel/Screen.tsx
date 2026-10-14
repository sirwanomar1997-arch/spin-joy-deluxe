import { Link } from '@tanstack/react-router';
import { ArrowLeft, X } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useWheels } from './context';
import { backgrounds } from './backgrounds';
import { useT } from './i18n';
export function Backdrop({ children }: { children: ReactNode }) {
  const { store } = useWheels();
  const background = backgrounds.find(b => b.id === store.settings.background) ?? backgrounds[0];
  const starId = useId().replace(/:/g, '');
  return <div className={`app-backdrop ${store.settings.reducedMotion ? 'reduced-effects' : ''}`} data-background={background.id}><div className="star-sky"><img className="sky-texture" src={background.image} width="736" height="1472" alt="" fetchPriority="high" /><svg className="living-stars" viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id={`${starId}-shine`}><stop offset="0" className="star-core" /><stop offset=".22" className="star-soft" /><stop offset="1" className="star-clear" /></radialGradient></defs>{Array.from({ length: 86 }, (_, i) => {
    const x = (i * 137.5 + 71) % 1000, y = (i * 271 + 43) % 1600;
    const bright = i % 11 === 0;
    return <g key={i} className={`sky-star ${bright ? 'bright-star' : ''}`}><circle cx={x} cy={y} r={bright ? 9 : 3} fill={`url(#${starId}-shine)`} /><circle className="star-point" cx={x} cy={y} r={bright ? 1.35 : i % 3 === 0 ? .9 : .55} />{bright && <path className="star-rays" d={`M${x - 4} ${y}h8 M${x} ${y - 6}v12`} />}</g>;
  })}</svg></div>{children}</div>;
}
export function StorageError() {
  const { error, clearError } = useWheels();
  const t = useT();
  if (!error) return null;
  const message = error === 'read' ? t.errorRead : error === 'write' ? t.errorWrite : error;
  return <div className="storage-error" role="alert"><span>{message}</span><Button variant="ghost" size="icon" aria-label={t.closeError} onClick={clearError}><X /></Button></div>;
}
export function Screen({ title, eyebrow, children, action }: { title: string; eyebrow: string; children: ReactNode; action?: ReactNode }) {
  const t = useT();
  return <Backdrop><main className="secondary-screen"><header className="screen-header"><Button variant="outline" size="icon" asChild><Link to="/" aria-label={t.backToWheel}><ArrowLeft /></Link></Button><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</header><StorageError />{children}</main></Backdrop>;
}
