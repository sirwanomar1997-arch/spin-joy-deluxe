import { createFileRoute, Link } from '@tanstack/react-router';
import { Library, RotateCcw, Volume2, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Screen } from '@/features/wheel/Screen';
import { useWheels } from '@/features/wheel/context';
import { defaults } from '@/features/wheel/storage';
export const Route = createFileRoute('/settings')({
  head: () => ({ meta: [{ title: 'Inställningar · Spin the Wheel Deluxe' }, { name: 'description', content: 'Välj ljud och reducerade ljuseffekter för ditt lyckohjul.' }, { property: 'og:title', content: 'Inställningar · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Hantera ljud, rörelse och sparade hjul på din enhet.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Settings,
});
function Settings() {
  const { store, commit, ready } = useWheels();
  return <Screen title="Inställningar" eyebrow="SPIN THE WHEEL DELUXE"><div className="settings-body">
    <section className="settings-section"><p className="eyebrow">UPPLEVELSE</p><div className="setting-row"><Volume2 /><label htmlFor="sound">Ljud</label><Switch id="sound" checked={store.settings.sound} disabled={!ready} onCheckedChange={sound => commit({ ...store, settings: { ...store.settings, sound } })} /></div><div className="setting-row"><Sparkles /><label htmlFor="motion">Mindre ljuseffekter</label><Switch id="motion" checked={store.settings.reducedMotion} disabled={!ready} onCheckedChange={reducedMotion => commit({ ...store, settings: { ...store.settings, reducedMotion } })} /></div></section>
    <section className="settings-section"><p className="eyebrow">DIN SAMLING</p><Button variant="ghost" asChild className="library-link"><Link to="/wheels"><Library />Mina hjul<span>{store.wheels.length}</span><ChevronRight /></Link></Button></section>
    <Button variant="outline" className="reset-button" disabled={!ready} onClick={() => commit({ ...store, settings: { ...defaults } })}><RotateCcw />Återställ inställningar</Button>
    <p className="app-signature">SPIN THE WHEEL <span>DELUXE</span></p>
  </div></Screen>;
}
