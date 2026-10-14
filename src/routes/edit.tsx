import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Check, Library, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Screen } from '@/features/wheel/Screen';
import { useWheels } from '@/features/wheel/context';
import { DEFAULT_WHEEL, newWheel } from '@/features/wheel/storage';
import { useT } from '@/features/wheel/i18n';
export const Route = createFileRoute('/edit')({
  head: () => ({ meta: [{ title: 'Redigera hjul · Spin the Wheel Deluxe' }, { name: 'description', content: 'Anpassa titel och lika stora segment på ditt eget lyckohjul.' }, { property: 'og:title', content: 'Redigera hjul · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Skapa ett personligt lyckohjul med egna alternativ.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Edit,
});
function Edit() {
  const { store, ready, commit } = useWheels();
  const active = store.wheels.find(w => w.id === store.activeId) ?? DEFAULT_WHEEL;
  const [title, setTitle] = useState(active.title);
  const [segments, setSegments] = useState([...active.segments]);
  const navigate = useNavigate();
  const t = useT();
  useEffect(() => { if (ready) { setTitle(active.title); setSegments([...active.segments]); } }, [ready, active.id]);
  function save() {
    // Ändringar sparas alltid som ett NYTT hjul — det gamla ligger kvar i Mina hjul tills användaren raderar det manuellt.
    const created = { ...newWheel(), title: title.trim(), segments };
    if (commit({ ...store, wheels: [...store.wheels, created], activeId: created.id })) void navigate({ to: '/' });
  }
  function resize(count: number) { const n = Math.min(24, Math.max(1, count)); setSegments(s => Array.from({ length: n }, (_, i) => s[i] ?? '')); }
  return <Screen title={t.editWheel} eyebrow={t.yourWheel} action={<Button onClick={save} disabled={!ready}><Check />{t.done}</Button>}>
    <div className="editor-body"><div className="form-section"><label htmlFor="wheel-title" className="field-heading">{t.wheelTitle} <span>{t.optional}</span></label><input id="wheel-title" className="deluxe-input title-input" value={title} maxLength={80} onChange={e => setTitle(e.target.value)} autoComplete="off" /></div>
    <div className="segment-count-row"><label htmlFor="segment-count" className="field-heading">{t.segmentCount}</label><div className="stepper"><Button variant="ghost" size="icon" aria-label={t.fewerSegments} disabled={segments.length <= 1} onClick={() => resize(segments.length - 1)}><Minus /></Button><input id="segment-count" type="number" min="1" max="24" value={segments.length} onChange={e => resize(Number(e.target.value) || 1)} /><Button variant="ghost" size="icon" aria-label={t.moreSegments} disabled={segments.length >= 24} onClick={() => resize(segments.length + 1)}><Plus /></Button></div></div>
    <div className="segment-fields">{segments.map((value, i) => <label key={i} className="segment-field"><span className={`segment-number segment-${i === segments.length - 1 && i % 7 === 0 ? 3 : i % 7}`}>{String(i + 1).padStart(2, '0')}</span><input aria-label={`${t.segment} ${i + 1}`} className="deluxe-input" value={value} maxLength={60} onChange={e => setSegments(s => s.map((v, j) => j === i ? e.target.value : v))} autoComplete="off" /></label>)}</div>
    <div className="editor-footer"><Button variant="outline" asChild><Link to="/wheels"><Library />{t.myWheels}</Link></Button></div></div>
  </Screen>;
}
