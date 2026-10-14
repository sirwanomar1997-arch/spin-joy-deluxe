import { createFileRoute } from '@tanstack/react-router';
import { Screen } from '@/features/wheel/Screen';
import { useT } from '@/features/wheel/i18n';

export const Route = createFileRoute('/privacy')({
  head: () => ({ meta: [{ title: 'Integritetspolicy · Spin the Wheel Deluxe' }, { name: 'description', content: 'Integritetspolicy och villkor för Spin the Wheel Deluxe. Ingen data samlas in, åldersgräns 13+.' }, { property: 'og:title', content: 'Integritetspolicy · Spin the Wheel Deluxe' }, { property: 'og:description', content: 'Ingen datainsamling, inga konton, ingen spårning. Åldersgräns 13+.' }, { property: 'og:type', content: 'article' }, { name: 'twitter:card', content: 'summary' }] }),
  component: Privacy,
});

function Privacy() {
  const t = useT();
  return <Screen title={t.privacyTerms} eyebrow="SPIN THE WHEEL DELUXE"><div className="settings-body">
    <section className="settings-section"><h2 className="eyebrow">{t.privacyPolicy}</h2>
      <p>{t.privacyP1}</p>
      <p>{t.privacyP2}</p>
    </section>
    <section className="settings-section"><h2 className="eyebrow">{t.ageLimit}</h2>
      <p>{t.ageP}</p>
    </section>
    <section className="settings-section"><h2 className="eyebrow">{t.terms}</h2>
      <p>{t.termsP}</p>
    </section>
  </div></Screen>;
}
