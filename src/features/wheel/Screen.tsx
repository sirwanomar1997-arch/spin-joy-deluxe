import { Link } from '@tanstack/react-router';
import { ArrowLeft, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useWheels } from './context';
import { backgrounds } from './backgrounds';
export function Backdrop({ children }: { children: ReactNode }) {
  const { store } = useWheels();
  const background = backgrounds.find(b => b.id === store.settings.background) ?? backgrounds[0];
  return <div className={`app-backdrop ${store.settings.reducedMotion ? 'reduced-effects' : ''}`} data-background={background.id}><img key={background.id} className="sky-texture" src={background.image} width="768" height="1152" alt="" fetchPriority="high" />{children}</div>;
}
export function StorageError() {
  const { error, clearError } = useWheels();
  if (!error) return null;
  return <div className="storage-error" role="alert"><span>{error}</span><Button variant="ghost" size="icon" aria-label="Stäng felmeddelande" onClick={clearError}><X /></Button></div>;
}
export function Screen({ title, eyebrow, children, action }: { title: string; eyebrow: string; children: ReactNode; action?: ReactNode }) {
  return <Backdrop><main className="secondary-screen"><header className="screen-header"><Button variant="outline" size="icon" asChild><Link to="/" aria-label="Tillbaka till hjulet"><ArrowLeft /></Link></Button><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</header><StorageError />{children}</main></Backdrop>;
}
