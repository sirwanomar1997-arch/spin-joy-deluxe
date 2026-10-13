import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, Circle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/ui/button';
import { Screen } from '@/features/wheel/Screen';
import { useWheels } from '@/features/wheel/context';
import { newWheel, type Wheel } from '@/features/wheel/storage';
export const Route = createFileRoute('/wheels')({
  head: () => ({ meta: [{ title: 'Mina hjul · Spin the Wheel Deluxe' }, { name: 'description', content: 'Skapa, öppna och hantera dina egna lokalt sparade lyckohjul.' }, { property: 'og:title', content: 'Mina hjul · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Din personliga samling av lyckohjul, utan konto.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Wheels,
});
function Wheels() {
  const { store, commit, ready } = useWheels();
  const [deleting, setDeleting] = useState<Wheel | null>(null);
  const navigate = useNavigate();
  function open(wheel: Wheel, edit = false) {
    if (commit({ ...store, activeId: wheel.id })) void navigate({ to: edit ? '/edit' : '/' });
  }
  function create() { const wheel = newWheel(); if (commit({ ...store, activeId: wheel.id, wheels: [...store.wheels, wheel] })) void navigate({ to: '/edit' }); }
  function remove() {
    if (!deleting) return;
    let remaining = store.wheels.filter(w => w.id !== deleting.id);
    if (!remaining.length) remaining = [newWheel()];
    const first = remaining[0];
    if (!first) return;
    if (commit({ ...store, wheels: remaining, activeId: store.activeId === deleting.id ? first.id : store.activeId })) setDeleting(null);
  }
  return <Screen title="Mina hjul" eyebrow="DIN SAMLING" action={<Button aria-label="Skapa nytt hjul" onClick={create} disabled={!ready || store.wheels.length >= 100}><Plus />Nytt hjul</Button>}><div className="wheel-library">{store.wheels.map(w => <article key={w.id} className="saved-wheel"><div className="mini-wheel" aria-hidden="true"><Circle /></div><div className="saved-wheel-info"><h2>{w.title || 'Utan titel'}</h2><p>{w.segments.length} segment{w.id === store.activeId && <span> · Aktivt</span>}</p><Button variant="link" onClick={() => open(w)} disabled={!ready}>Öppna</Button></div><div className="saved-wheel-actions"><Button variant="ghost" size="icon" aria-label={`Redigera ${w.title || 'hjul'}`} title="Redigera" onClick={() => open(w, true)}><Pencil /></Button><Button variant="ghost" size="icon" aria-label={`Ta bort ${w.title || 'hjul'}`} title="Ta bort" onClick={() => setDeleting(w)}><Trash2 /></Button></div></article>)}</div>
    <Dialog.Root open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null); }}><Dialog.Portal><Dialog.Overlay className="confirm-overlay"/><Dialog.Content className="confirm-dialog"><Dialog.Title className="confirm-title">Ta bort hjulet?</Dialog.Title><Dialog.Description className="confirm-description">{deleting?.title || 'Hjulet utan titel'} tas bort från den här enheten. Det går inte att ångra.</Dialog.Description><div className="confirm-actions"><Dialog.Cancel asChild><Button variant="outline">Avbryt</Button></Dialog.Cancel><Button variant="destructive" onClick={remove}><Trash2 />Ta bort</Button></div></Dialog.Content></Dialog.Portal></Dialog.Root>
  </Screen>;
}
