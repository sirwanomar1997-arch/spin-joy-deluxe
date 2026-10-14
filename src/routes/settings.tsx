import { createFileRoute, Link } from '@tanstack/react-router';
import { Library, RotateCcw, Volume2, Sparkles, ChevronRight, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Screen } from '@/features/wheel/Screen';
import { useWheels } from '@/features/wheel/context';
import { defaults } from '@/features/wheel/storage';
import { backgrounds } from '@/features/wheel/backgrounds';
export const Route = createFileRoute('/settings')({
  head: () => ({ meta: [{ title: 'Inställningar · Spin the Wheel Deluxe' }, { name: 'description', content: 'Välj bland åtta deluxe-bakgrunder, hjulljud och reducerade ljuseffekter.' }, { property: 'og:title', content: 'Inställningar · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Åtta exklusiva bakgrunder och personliga ljud- och ljusinställningar.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Settings,
});
function Settings() {
  const { store, commit, ready } = useWheels();
  return <Screen title="Inställningar" eyebrow="SPIN THE WHEEL DELUXE"><div className="settings-body">
    <section className="settings-section"><p className="eyebrow">UPPLEVELSE</p><div className="setting-row"><Volume2 /><label htmlFor="sound">Ljud</label><Switch id="sound" checked={store.settings.sound} disabled={!ready} onCheckedChange={sound => commit({ ...store, settings: { ...store.settings, sound } })} /></div><div className="setting-row"><Sparkles /><label htmlFor="motion">Mindre ljuseffekter</label><Switch id="motion" checked={store.settings.reducedMotion} disabled={!ready} onCheckedChange={reducedMotion => commit({ ...store, settings: { ...store.settings, reducedMotion } })} /></div></section>
    <section className="settings-section"><h2 className="eyebrow">STJÄRNHIMMEL</h2><div className="background-grid">{backgrounds.map(background => <Button key={background.id} variant="ghost" className="background-choice" data-background={background.id} aria-label={`Bakgrund: ${background.name}`} aria-pressed={store.settings.background === background.id} disabled={!ready} onClick={() => commit({ ...store, settings: { ...store.settings, background: background.id } })}><div className="background-preview"><img src={background.image} width="736" height="1472" alt="" loading="lazy" /></div><span>{background.name}</span>{store.settings.background === background.id && <Check className="background-check" />}</Button>)}</div></section>
    <section className="settings-section"><p className="eyebrow">DIN SAMLING</p><Button variant="ghost" asChild className="library-link"><Link to="/wheels"><Library />Mina hjul<span>{store.wheels.length}</span><ChevronRight /></Link></Button></section>
    <section className="settings-section"><p className="eyebrow">OM APPEN · 13+</p><Button variant="ghost" asChild className="library-link"><Link to="/privacy"><ShieldCheck />Integritet & villkor<span>13+</span><ChevronRight /></Link></Button></section>
    <Button variant="outline" className="reset-button" disabled={!ready} onClick={() => commit({ ...store, settings: { ...defaults } })}><RotateCcw />Återställ inställningar</Button>
    <p className="app-signature">SPIN THE WHEEL <span>DELUXE</span></p>
  </div></Screen>;
}
