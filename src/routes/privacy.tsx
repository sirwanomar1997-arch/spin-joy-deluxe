import { createFileRoute } from '@tanstack/react-router';
import { Screen } from '@/features/wheel/Screen';

export const Route = createFileRoute('/privacy')({
  head: () => ({ meta: [{ title: 'Integritetspolicy · Spin the Wheel Deluxe' }, { name: 'description', content: 'Integritetspolicy och villkor för Spin the Wheel Deluxe. Ingen data samlas in, åldersgräns 13+.' }, { property: 'og:title', content: 'Integritetspolicy · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Ingen datainsamling, inga konton, ingen spårning. Åldersgräns 13+.' }, { property: 'og:type', content: 'article' }, { name: 'twitter:card', content: 'summary' }] }),
  component: Privacy,
});

function Privacy() {
  return <Screen title="Integritet & villkor" eyebrow="SPIN THE WHEEL DELUXE"><div className="settings-body">
    <section className="settings-section"><h2 className="eyebrow">INTEGRITETSPOLICY</h2>
      <p>Spin the Wheel Deluxe samlar inte in, säljer eller delar några personuppgifter. Appen har inga konton, ingen reklam, ingen analys och ingen spårning.</p>
      <p>Dina hjul, texter och inställningar sparas endast lokalt på din enhet. De lämnar aldrig enheten och raderas om du tar bort appen eller hjulen i Mina hjul.</p>
    </section>
    <section className="settings-section"><h2 className="eyebrow">ÅLDERSGRÄNS</h2>
      <p>Appen är avsedd för användare från 13 år. Den innehåller inget spel om pengar, inga köp i appen och inga riktiga vinster — hjulet används bara för lek och beslut.</p>
    </section>
    <section className="settings-section"><h2 className="eyebrow">VILLKOR</h2>
      <p>Appen köps en gång för 20,00 kr via App Store eller Google Play. Resultaten är slumpmässiga och avgörs av hjulets faktiska position. Använd appen på eget ansvar.</p>
    </section>
  </div></Screen>;
}
