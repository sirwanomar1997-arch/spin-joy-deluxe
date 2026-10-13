import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Settings2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Wheel } from '@/features/wheel/Wheel';
import { Backdrop, StorageError } from '@/features/wheel/Screen';
import { useWheels } from '@/features/wheel/context';
import { DEFAULT_WHEEL } from '@/features/wheel/storage';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Spin the Wheel Deluxe · Ditt lyckohjul' }, { name: 'description', content: 'Ett exklusivt fingerstyrt lyckohjul med fysisk tröghet. Skapa och spara dina egna hjul, utan konto.' }, { property: 'og:title', content: 'Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Dra, släpp och låt hjulet avgöra. Ditt personliga lyckohjul.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Index,
});
function Index() {
  const { store, ready } = useWheels();
  const wheel = store.wheels.find(w => w.id === store.activeId) ?? DEFAULT_WHEEL;
  const [busy, setBusy] = useState(false);
  return <div className={store.settings.reducedMotion ? 'reduced-effects' : ''}><Backdrop><main className="home-screen"><header className="home-header">
    <Button variant="neonWarm" size="deluxeIcon" disabled={busy || !ready} asChild={!busy && ready}>{busy || !ready ? <Settings2 /> : <Link to="/settings" aria-label="Inställningar" title="Inställningar"><Settings2 /></Link>}</Button>
    <div className="title-capsule">{wheel.title && <h1 className={`wheel-title ${wheel.title.length > 22 ? 'wheel-title-long' : ''}`}>{wheel.title}</h1>}</div>
    <Button variant="neon" size="deluxeIcon" disabled={busy || !ready} asChild={!busy && ready}>{busy || !ready ? <Pencil /> : <Link to="/edit" aria-label="Redigera hjul" title="Redigera hjul"><Pencil /></Link>}</Button>
  </header><StorageError />{ready && <Wheel key={`${wheel.id}-${JSON.stringify(wheel.segments)}`} wheel={wheel} sound={store.settings.sound} onBusy={setBusy} />}</main></Backdrop></div>;
}
