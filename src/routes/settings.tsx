import { createFileRoute, Link } from '@tanstack/react-router';
import { Library, RotateCcw, Volume2, Sparkles, ChevronRight, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Screen } from '@/features/wheel/Screen';
import { useWheels } from '@/features/wheel/context';
import { defaults } from '@/features/wheel/storage';
import { backgrounds } from '@/features/wheel/backgrounds';
import { useT, type Strings } from '@/features/wheel/i18n';
const bgNames: Record<string, keyof Strings> = { night: 'bgNight', aurora: 'bgAurora', ocean: 'bgOcean', forest: 'bgForest', satin: 'bgSatin', mist: 'bgMist', nebula: 'bgNebula', depths: 'bgDepths' };
export const Route = createFileRoute('/settings')({
  head: () => ({ meta: [{ title: 'Inställningar · Spin the Wheel Deluxe' }, { name: 'description', content: 'Välj bland åtta deluxe-bakgrunder, hjulljud och reducerade ljuseffekter.' }, { property: 'og:title', content: 'Inställningar · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Åtta exklusiva bakgrunder och personliga ljud- och ljusinställningar.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Settings,
});
function Settings() {
  const { store, commit, ready } = useWheels();
  const t = useT();
  return <Screen title={t.settings} eyebrow="SPIN THE WHEEL DELUXE"><div className="settings-body">
    <section className="settings-section"><p className="eyebrow">{t.experience}</p><div className="setting-row"><Volume2 /><label htmlFor="sound">{t.sound}</label><Switch id="sound" checked={store.settings.sound} disabled={!ready} onCheckedChange={sound => commit({ ...store, settings: { ...store.settings, sound } })} /></div><div className="setting-row"><Sparkles /><label htmlFor="motion">{t.reducedMotion}</label><Switch id="motion" checked={store.settings.reducedMotion} disabled={!ready} onCheckedChange={reducedMotion => commit({ ...store, settings: { ...store.settings, reducedMotion } })} /></div></section>
    <section className="settings-section"><h2 className="eyebrow">{t.starSky}</h2><div className="background-grid">{backgrounds.map(background => { const name = t[bgNames[background.id] ?? 'bgNight'] as string; return <Button key={background.id} variant="ghost" className="background-choice" data-background={background.id} aria-label={`${t.background}: ${name}`} aria-pressed={store.settings.background === background.id} disabled={!ready} onClick={() => commit({ ...store, settings: { ...store.settings, background: background.id } })}><div className="background-preview"><img src={background.image} width="736" height="1472" alt="" loading="lazy" /></div><span>{name}</span>{store.settings.background === background.id && <Check className="background-check" />}</Button>; })}</div></section>
    <section className="settings-section"><p className="eyebrow">{t.yourCollection}</p><Button variant="ghost" asChild className="library-link"><Link to="/wheels"><Library />{t.myWheels}<span>{store.wheels.length}</span><ChevronRight /></Link></Button></section>
    <section className="settings-section"><p className="eyebrow">{t.aboutApp}</p><Button variant="ghost" asChild className="library-link"><Link to="/privacy"><ShieldCheck />{t.privacyTerms}<span>13+</span><ChevronRight /></Link></Button></section>
    <Button variant="outline" className="reset-button" disabled={!ready} onClick={() => commit({ ...store, settings: { ...defaults } })}><RotateCcw />{t.resetSettings}</Button>
    <p className="app-signature">SPIN THE WHEEL <span>DELUXE</span></p>
  </div></Screen>;
}
