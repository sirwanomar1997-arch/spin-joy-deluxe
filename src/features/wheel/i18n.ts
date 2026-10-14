import { useEffect, useState } from 'react';

export type Lang = 'sv' | 'en';

const sv = {
  settings: 'Inställningar',
  editWheel: 'Redigera hjul',
  yourWheel: 'DITT HJUL',
  done: 'Klar',
  wheelTitle: 'Hjulets titel',
  optional: 'Valfri',
  segmentCount: 'Antal segment',
  fewerSegments: 'Färre segment',
  moreSegments: 'Fler segment',
  segment: 'Segment',
  myWheels: 'Mina hjul',
  experience: 'UPPLEVELSE',
  sound: 'Ljud',
  reducedMotion: 'Mindre ljuseffekter',
  starSky: 'STJÄRNHIMMEL',
  background: 'Bakgrund',
  yourCollection: 'DIN SAMLING',
  aboutApp: 'OM APPEN · 13+',
  privacyTerms: 'Integritet & villkor',
  resetSettings: 'Återställ inställningar',
  newWheel: 'Nytt hjul',
  createNewWheel: 'Skapa nytt hjul',
  untitled: 'Utan titel',
  segments: 'segment',
  active: 'Aktivt',
  open: 'Öppna',
  edit: 'Redigera',
  remove: 'Ta bort',
  deleteTitle: 'Ta bort hjulet?',
  deleteBody: 'tas bort från den här enheten. Det går inte att ångra.',
  theUntitledWheel: 'Hjulet utan titel',
  cancel: 'Avbryt',
  backToWheel: 'Tillbaka till hjulet',
  closeError: 'Stäng felmeddelande',
  emptySegment: 'TOMT SEGMENT',
  errorRead: 'Dina sparade hjul kunde inte läsas. De har inte skrivits över.',
  errorWrite: 'Det gick inte att spara på enheten. Kontrollera att webbläsarlagring är tillåten och försök igen.',
  privacyPolicy: 'INTEGRITETSPOLICY',
  privacyP1: 'Spin the Wheel Deluxe samlar inte in, säljer eller delar några personuppgifter. Appen har inga konton, ingen reklam, ingen analys och ingen spårning.',
  privacyP2: 'Dina hjul, texter och inställningar sparas endast lokalt på din enhet. De lämnar aldrig enheten och raderas om du tar bort appen eller hjulen i Mina hjul.',
  ageLimit: 'ÅLDERSGRÄNS',
  ageP: 'Appen är avsedd för användare från 13 år. Den innehåller inget spel om pengar, inga köp i appen och inga riktiga vinster — hjulet används bara för lek och beslut.',
  terms: 'VILLKOR',
  termsP: 'Appen köps en gång för 20,00 kr via App Store eller Google Play. Resultaten är slumpmässiga och avgörs av hjulets faktiska position. Använd appen på eget ansvar.',
  bgNight: 'Midnattsblå', bgAurora: 'Ametist', bgOcean: 'Brons', bgForest: 'Smaragd',
  bgSatin: 'Onyx', bgMist: 'Silver', bgNebula: 'Rubin', bgDepths: 'Rosenkvarts',
};

const en: typeof sv = {
  settings: 'Settings',
  editWheel: 'Edit wheel',
  yourWheel: 'YOUR WHEEL',
  done: 'Done',
  wheelTitle: 'Wheel title',
  optional: 'Optional',
  segmentCount: 'Number of segments',
  fewerSegments: 'Fewer segments',
  moreSegments: 'More segments',
  segment: 'Segment',
  myWheels: 'My wheels',
  experience: 'EXPERIENCE',
  sound: 'Sound',
  reducedMotion: 'Reduce light effects',
  starSky: 'STAR SKY',
  background: 'Background',
  yourCollection: 'YOUR COLLECTION',
  aboutApp: 'ABOUT THE APP · 13+',
  privacyTerms: 'Privacy & terms',
  resetSettings: 'Reset settings',
  newWheel: 'New wheel',
  createNewWheel: 'Create new wheel',
  untitled: 'Untitled',
  segments: 'segments',
  active: 'Active',
  open: 'Open',
  edit: 'Edit',
  remove: 'Delete',
  deleteTitle: 'Delete the wheel?',
  deleteBody: 'will be removed from this device. This cannot be undone.',
  theUntitledWheel: 'The untitled wheel',
  cancel: 'Cancel',
  backToWheel: 'Back to the wheel',
  closeError: 'Dismiss error',
  emptySegment: 'EMPTY SEGMENT',
  errorRead: 'Your saved wheels could not be read. They have not been overwritten.',
  errorWrite: 'Could not save on this device. Check that browser storage is allowed and try again.',
  privacyPolicy: 'PRIVACY POLICY',
  privacyP1: 'Spin the Wheel Deluxe does not collect, sell or share any personal data. The app has no accounts, no ads, no analytics and no tracking.',
  privacyP2: 'Your wheels, texts and settings are stored only locally on your device. They never leave the device and are deleted if you remove the app or the wheels in My wheels.',
  ageLimit: 'AGE RATING',
  ageP: 'The app is intended for users aged 13 and up. It contains no gambling, no in-app purchases and no real prizes — the wheel is for play and decisions only.',
  terms: 'TERMS',
  termsP: 'The app is purchased once for 20.00 kr via the App Store or Google Play. Results are random and determined by the wheel’s actual position. Use the app at your own risk.',
  bgNight: 'Midnight Blue', bgAurora: 'Amethyst', bgOcean: 'Bronze', bgForest: 'Emerald',
  bgSatin: 'Onyx', bgMist: 'Silver', bgNebula: 'Ruby', bgDepths: 'Rose Quartz',
};

export type Strings = typeof sv;
export const translations: Record<Lang, Strings> = { sv, en };

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'sv';
  return navigator.language?.toLowerCase().startsWith('sv') ? 'sv' : 'en';
}

/** Returns the UI strings for the phone's language. Defaults to Swedish during SSR/first paint, then switches after mount. */
export function useT(): Strings {
  const [lang, setLang] = useState<Lang>('sv');
  useEffect(() => {
    const detected = detectLang();
    setLang(detected);
    document.documentElement.lang = detected;
  }, []);
  return translations[lang];
}
