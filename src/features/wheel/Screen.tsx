import { Link } from '@tanstack/react-router';
import { ArrowLeft, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useWheels } from './context';
import nightSky from '@/assets/night-sky.jpg';
export function Backdrop({ children }: { children: ReactNode }) {
  return <div className="app-backdrop"><img className="sky-texture" src={nightSky} width="1024" height="1536" alt="" fetchPriority="high" />{children}</div>;
}
export function StorageError() {
  const { error, clearError } = useWheels();
  if (!error) return null;
  return <div className="storage-error" role="alert"><span>{error}</span><Button variant="ghost" size="icon" aria-label="Stäng felmeddelande" onClick={clearError}><X /></Button></div>;
}
export function Screen({ title, eyebrow, children, action }: { title: string; eyebrow: string; children: ReactNode; action?: ReactNode }) {
  return <Backdrop><main className="secondary-screen"><header className="screen-header"><Button variant="outline" size="icon" asChild><Link to="/" aria-label="Tillbaka till hjulet"><ArrowLeft /></Link></Button><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</header><StorageError />{children}</main></Backdrop>;
}
