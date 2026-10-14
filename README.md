# Spin Joy Deluxe

SPIN THE WHEEL DELUXE

Komplett byggspecifikation för Lovable

Bygg en komplett, fungerande och mobilanpassad app med namnet Spin the Wheel Deluxe. Appen ska vara en exklusiv, visuellt imponerande och lekfull digital version av ett riktigt lyckohjul.

Det viktigaste är att hjulet känns fysiskt och verkligt. Användaren ska kunna placera fingret på hjulets ytterkant, dra runt det och släppa. Ju snabbare användaren drar, desto snabbare ska hjulet fortsätta snurra. Hjulet ska bromsa naturligt, stanna på ett slumpmässigt segment och visa rätt vinnare under den fasta pekaren.

Bygg en riktig interaktiv app, inte en statisk designprototyp. Alla knappar, inställningar, redigeringsfunktioner, snurrningar och sparfunktioner ska fungera.

⸻

1. DESIGN OCH VISUELL IDENTITET

Appen ska ha en genomarbetad premiumdesign med en mörk, elegant och modern känsla.

Bakgrund

* Djup marinblå och mörkblå bakgrund.
* Ett subtilt blått ljussken bakom hjulet.
* Diskreta små ljuspunkter eller stjärnor som skapar djup.
* Mjuka gradienter och diskreta ljuseffekter.
* Bakgrunden ska vara stilren, lugn och exklusiv, aldrig plottrig.
* Undvik överdrivna animationer, stora dekorativa element och onödiga paneler.

Lyckohjulet

Hjulet ska vara stort, centrerat och tydligt synligt på skärmen.

Använd färgstarka segment i exempelvis:

* Rött
* Cyan
* Blått
* Gult
* Grönt
* Lila
* Rosa

Färgerna ska balanseras så att intilliggande segment är lätta att skilja åt.

Hjulet ska ha:

* Exakt lika stora segment.
* Tydliga men eleganta avgränsningar mellan segmenten.
* En diskret premiumkant.
* En mörk navpunkt i mitten.
* Realistisk djupkänsla och välavvägda skuggor.
* Svart text i STORA VERSALER på varje segment.

Segmenttexterna ska placeras så att de är så läsbara som möjligt. Anpassa textstorleken efter tillgängligt utrymme och långa namn. Texten får inte hamna utanför hjulet.

Pekaren

* Använd en elegant, glansig guldfärgad pekare.
* Pekaren ska ha den ursprungliga droppformen, med rundad och lyxig design.
* Använd inte en vass triangelformad pil.
* Pekaren ska sitta fast i samma position hela tiden.
* Hjulet roterar under pekaren; pekaren ska aldrig rotera tillsammans med hjulet.

Vinnarvisning

När hjulet stannar ska vinnaren visas ovanför hjulet.

* Visa endast vinnarnamnet, exempelvis RAYAN.
* Använd stora, tydliga, guldfärgade versaler.
* Lägg till en tunn och elegant gulddetalj under namnet.
* Använd ett diskret guldskimmer eller en mjuk ljuseffekt.
* Skriv inte ”Vinnaren är RAYAN” eller ”Vinnare: RAYAN”.
* Dölj tidigare resultat när en ny snurrning påbörjas.

Typografi och finish

Använd en modern och tydlig typografi med premiumkänsla. Alla komponenter ska kännas genomtänkta, välbalanserade och konsekventa.

⸻

2. HUVUDSKÄRMEN

Huvudskärmen ska vara så ren och enkel som möjligt.

Visa endast:

1. Appens aktuella, redigerbara hjultitel.
2. En inställningsikon uppe till vänster.
3. En pennikon uppe till höger.
4. Vinnarnamnet ovanför hjulet när ett resultat finns.
5. Det stora, interaktiva lyckohjulet.

Huvudskärmen får inte innehålla:

* Knappar för att välja antal segment.
* En lista med alla segment.
* En separat ”Klar”-knapp.
* En vanlig snurrknapp.
* Onödiga knappar längst ned.

Användaren ska snurra hjulet genom att dra direkt på hjulet med fingret eller musen.

Hjulet ska vara den huvudsakliga interaktiva komponenten.

⸻

3. REALISTISK SNURRNING MED FINGERDRAG

Detta är appens viktigaste funktion. Implementera den noggrant.

3.1 Användaren tar tag i ytterkanten

Användaren ska kunna placera fingret på hjulets yttre kant och dra i valfri riktning för att rotera hjulet.

* Interaktionen ska börja när användaren trycker ned eller placerar fingret på hjulets aktiva yta.
* Hjulet ska följa fingrets rörelse direkt.
* Rotationens riktning ska följa dragets riktning.
* Det ska kännas som att användaren fysiskt tar tag i och drar runt ett hjul.
* Interaktionen ska fungera med touch på mobil och surfplatta samt med mus på dator.
* Använd pointer events eller motsvarande robust metod för att stödja olika inmatningsenheter.
* Använd pointer capture där det behövs så att draget fortsätter att registreras även om pekaren tillfälligt lämnar hjulets område.
* Begränsa oavsiktlig sidscrollning under själva draget utan att försämra övrig navigering.

3.2 Hjulet följer fingret

Medan användaren håller fingret på hjulet ska det rotera i realtid.

Beräkna dragets vinkel kring hjulets centrum och använd förändringen i vinkel för att uppdatera hjulets rotation.

Undvik att basera rotationen på enbart horisontell eller vertikal rörelse. Hjulet ska följa en cirkulär bana.

Användaren ska kunna:

* Dra medurs.
* Dra moturs.
* Dra långsamt för att rotera hjulet långsamt.
* Dra snabbt för att bygga upp högre rotationshastighet.
* Ändra riktning under draget.

Om användaren drar över vinkeln där noll grader möter 360 grader ska rotationen fortsätta mjukt utan plötsliga hopp.

3.3 Hastigheten avgör eftersnurrningen

När användaren släpper fingret ska hjulet fortsätta snurra av egen kraft.

* Beräkna vinkelhastigheten utifrån de senaste rörelserna innan fingret släpptes.
* Använd en kort tidsserie av rörelseprover eller en viktad hastighetsberäkning för att få en stabil och naturlig uppskattning.
* Ju snabbare användaren drar precis innan släppet, desto högre ska hjulets starthastighet bli.
* Ett långsamt drag ska ge en långsam eftersnurrning.
* Ett snabbt drag ska kunna ge flera varv.
* Tillåt både medurs och moturs rotation.
* Undvik plötsliga, onaturliga hopp i hastighet.

Implementera en realistisk tröghetsmodell där hjulets hastighet gradvis minskar på grund av friktion.

Använd en tidsbaserad fysikmodell som inte är beroende av bildfrekvensen. En exponentiell hastighetsminskning eller en annan välkalibrerad modell för vinkelhastighet fungerar bra.

När hastigheten har sjunkit under en låg, definierad gräns ska hjulet stanna helt.

Hjulet får aldrig ändra slutposition för att tvinga fram ett visst resultat.

3.4 Ingen automatisk snurrning

* Hjulet ska inte börja snurra när appen öppnas.
* Hjulet ska inte snurra när användaren trycker på en separat knapp.
* En snurrning startar genom att användaren drar på hjulet.
* Om användaren bara trycker utan att dra ska hjulet inte automatiskt utföra en full snurrning.
* Under en pågående eftersnurrning ska användaren inte kunna starta en ny konkurrerande rotation. Vänta tills hjulet har stannat innan nästa snurrning kan påbörjas.

3.5 Känsla och respons

Hjulet ska kännas tungt men responsivt.

* Direkt respons medan fingret är i kontakt med hjulet.
* Mjuk övergång mellan fingerstyrd rotation och eftersnurrning.
* Naturlig inbromsning.
* Ingen ryckig animation.
* Ingen plötslig teleportering till en slutposition.
* Ingen artificiell extrarotation efter att hjulet redan har börjat stanna.
* Anpassa animationen till mobilens prestanda.

Använd en lämplig animationsloop, exempelvis requestAnimationFrame, med tidsbaserad fysik. Städa upp animationsloopar och eventlyssnare korrekt.

⸻

4. KORREKT VINNARE OCH RÄTTVISA SEGMENT

Vinnaren måste alltid vara det segment som faktiskt befinner sig under den fasta guldfärgade pekaren när hjulet har stannat.

Det får aldrig finnas en separat slumpning som väljer ett namn oberoende av hjulets slutposition.

Geometriska regler

* Alla segment ska ha exakt samma vinkelstorlek.
* Om hjulet har N segment ska varje segment vara 360/N grader.
* Segmentens ordning och text ska alltid stämma överens med den visuella geometrin.
* Pekarens vinkel ska definieras konsekvent.
* Rotationsvinkeln ska hanteras korrekt även efter många varv.
* Negativa vinklar och vinklar över 360 grader ska normaliseras utan fel.
* Gränsen mellan två segment ska hanteras konsekvent för att undvika felaktiga resultat.

När hjulet har stannat:

1. Läs hjulets faktiska slutrotation.
2. Beräkna vinkeln under den fasta pekaren i hjulets koordinatsystem.
3. Identifiera segmentet som täcker den vinkeln.
4. Hämta vinnarens text från exakt detta segment.
5. Visa texten ovanför hjulet.

Tomma segment ska hanteras på ett tydligt sätt. Om ett tomt segment vinner ska appen inte hitta på ett namn eller felaktigt välja en annan deltagare. Visa i stället ett lämpligt tomt resultat eller markera att segmentet saknar text.

Om det bara finns ett segment ska hjulet hanteras säkert utan division med noll eller andra geometriska fel.

⸻

5. REDIGERING AV HJULET

Pennikonen uppe till höger öppnar en separat redigeringsskärm.

På redigeringsskärmen ska användaren kunna ändra hjulets titel och samtliga segment.

Titel

* Titel är valfri.
* Användaren kan skriva, ändra eller ta bort titeln.
* Om titeln är tom ska ingen platshållartext visas som om den vore en riktig titel på huvudskärmen.
* Titeländringar ska sparas.

Antal segment

* Användaren kan välja önskat antal segment i redigeringsvyn.
* När antalet ändras ska exakt rätt antal textfält visas.
* Nya segment ska skapas som tomma fält.
* När antalet minskas ska de borttagna segmenten tas bort från den aktuella konfigurationen.
* Antalet segment ska ha en rimlig minimi- och maxgräns så att hjulet förblir användbart och läsbart.
* Alla segment ska ha samma vinkel oavsett antal.

Segmenttexter

* Varje segment ska ha ett eget redigerbart textfält.
* Alla texter är valfria.
* Användaren kan skriva namn, aktiviteter, alternativ eller vad som helst.
* Normalisera visningen till STORA VERSALER på själva hjulet.
* Behåll redigerbar text på ett användarvänligt sätt.
* Hantera långa namn genom automatisk anpassning av teckenstorlek eller radbrytning.
* Håll texten inom segmentets gränser.

Spara och återgå

* Visa knappen ”Klar” i redigeringsvyn.
* När användaren trycker på ”Klar” valideras och sparas ändringarna.
* Gå tillbaka till huvudskärmen.
* Uppdatera hjulet omedelbart med det nya antalet segment och de nya texterna.
* Bevara alla giltiga ändringar.
* Huvudskärmen ska inte visa ”Klar”-knappen.

⸻

6. INSTÄLLNINGAR

Inställningsikonen uppe till vänster öppnar en separat inställningsvy.

Tillhandahåll följande funktioner:

Ljud

* Ljud på/av.
* Diskret snurrljud, om aktiverat.
* Ett subtilt ljud när hjulet stannar, om aktiverat.
* Ljud ska aldrig spelas upp automatiskt utan lämplig användarinteraktion.
* Om ljud skapas programmatiskt ska det fungera på mobil och dator utan att kräva externa ljudfiler.

Rörelse

* Ett alternativ för reducerad eller mindre intensiv rörelse.
* Respektera systeminställningen för reducerad rörelse där det är möjligt.
* Bevara den grundläggande interaktionen även om visuella effekter minskas.

Lagring

* Spara inställningarna lokalt.
* Återställ standardinställningar när användaren uttryckligen väljer detta.
* Återställning ska inte oavsiktligt radera sparade hjul.

Alla inställningar ska fungera och inte bara vara visuella reglage.

⸻

7. SPARA OCH HANTERA EGNA HJUL

Appen ska fungera utan användarkonto och utan obligatorisk backend.

Användaren ska kunna skapa och spara flera egna hjul lokalt på enheten.

Spara följande:

* Hjulets titel.
* Antal segment.
* Segmenttexter.
* Segmentordning.
* Relevanta hjulinställningar.
* Övrig konfiguration som behövs för att återskapa hjulet.

Funktioner

* Skapa ett nytt hjul.
* Spara det aktuella hjulet.
* Öppna ett tidigare sparat hjul.
* Redigera ett sparat hjul.
* Byta mellan olika sparade hjul.
* Ta bort ett sparat hjul med tydlig bekräftelse.

Sparade hjul ska finnas kvar efter omladdning av sidan och efter att webbläsaren stängts, så länge lokal webbläsarlagring finns kvar.

Använd localStorage eller IndexedDB efter behov.

Visa begripliga felmeddelanden om lagring misslyckas. Påstå aldrig att data har sparats om lagringen misslyckades.

Ingen inloggning ska krävas.

⸻

8. ANIMATION OCH LJUSEFFEKTER

Använd diskreta animationer som förstärker premiumkänslan.

* Mjukt blått bakgrundsljus.
* Diskreta reflektioner på gulddetaljerna.
* En subtil vinstanimation när hjulet stannar.
* En elegant övergång när redigeringsvyn öppnas och stängs.
* Mjuk uppdatering av vinnartexten.
* Eventuellt diskreta visuella markeringar kring pekaren när hjulet roterar.

Effekterna får aldrig störa hjulets fysik eller påverka resultatet.

Undvik överdrivet många partiklar, blinkande ljus och kraftiga effekter.

⸻

9. MOBIL, SURFPLATTA OCH DATOR

Bygg mobil först, men säkerställ att appen fungerar bra på alla skärmstorlekar.

Mobil

* Hjulet ska vara stort och centralt.
* Hjulet ska få plats på skärmen utan att kapas.
* Pekaren ska vara tydlig.
* Fingerdrag på ytterkanten ska fungera exakt.
* Använd lämplig touchhantering för att undvika att sidan scrollar när användaren avsiktligt drar hjulet.
* Redigeringsfält och knappar ska vara lätta att använda med en hand.

Surfplatta och dator

* Hjulet ska skalas upp på ett balanserat sätt.
* Musdrag ska ge samma grundläggande beteende som fingerdrag.
* Markören och fokusmarkeringar ska vara tydliga.
* Innehållet ska behålla samma visuella hierarki.

Tillgänglighet

* Ge ikoner och kontroller tillgängliga etiketter.
* Säkerställ tillräcklig kontrast.
* Stöd tangentbordsnavigering för redigeringsfunktioner och menyer.
* Respektera reducerad rörelse.
* Se till att gränssnittet inte blir beroende av färg ensam för viktig information.

⸻

10. TEKNISK IMPLEMENTATION

Använd en stabil modern webbteknik som stöds av Lovable, exempelvis React, TypeScript och Tailwind CSS.

Rita hjulet dynamiskt med SVG eller Canvas. Välj den lösning som ger bäst kontroll över segmentgeometri, textplacering och smidig rotation.

Separera koden för:

* Hjulritning.
* Segmentgeometri.
* Pekarens position.
* Finger- och musdrag.
* Hastighetsberäkning.
* Tröghet och friktion.
* Vinnarberäkning.
* Redigering.
* Lokal lagring.
* Inställningar.

Håll rotationstillstånd och den faktiska hjulpositionen konsekventa. Undvik att låta flera animationssystem styra rotationen samtidigt.

Se till att:

* Eventlyssnare städas bort när komponenter avmonteras.
* Animationer avbryts när de inte längre behövs.
* Det inte finns minnesläckor.
* Ändringar i antal segment inte lämnar kvar gamla vinklar eller felaktiga resultat.
* Lagrade data valideras innan de används.
* Fel hanteras utan att appen kraschar.

Använd inte en färdig bild av ett hjul som ersättning för den interaktiva hjulkomponenten.

⸻

11. TESTNING OCH GODKÄNNANDE

Testa hela appen innan den betraktas som färdig.

Snurrning

1. Dra långsamt längs ytterkanten och kontrollera att hjulet följer fingret.
2. Dra snabbt och släpp; hjulet ska fortsätta snurra snabbare.
3. Dra i båda riktningarna.
4. Ändra riktning under ett drag.
5. Kontrollera att hjulet bromsar mjukt.
6. Kontrollera att hjulet aldrig hoppar till en annan slutposition.
7. Kontrollera att användaren kan snurra igen efter att hjulet stannat.
8. Kontrollera att en ny snurrning inte kan konkurrera med en pågående rotation.

Vinnare

1. Testa olika antal segment.
2. Kontrollera att alla segment är lika stora.
3. Verifiera att vinnartexten alltid matchar segmentet under pekaren.
4. Testa rotation över flera hela varv och negativa vinklar.
5. Testa tomma texter och ett enda segment.
6. Säkerställ att ingen separat slumpning kan ge en vinnare som inte matchar hjulet.

Redigering och lagring

1. Ändra titeln.
2. Ändra antalet segment.
3. Lägg till och ta bort alternativ.
4. Lämna fält tomma.
5. Spara, ladda om sidan och kontrollera att hjulet återställs korrekt.
6. Skapa och öppna flera sparade hjul.
7. Testa inställningarna för ljud och rörelse.

Slutligt kvalitetskrav

Appen ska kännas som ett riktigt, välbyggt lyckohjul: användaren greppar ytterkanten, drar, släpper, ser hjulet fortsätta med fysisk tröghet och får ett korrekt resultat när hjulet stannar.

Prioritera verklighetstrogen fingerstyrning, korrekt geometri och rättvis vinnarberäkning framför dekorativa effekter. Leverera en fungerande app, inte bara en snygg prototyp. 

( Bilden jag skickat är min design idé, jag vill att du bygger åt det hållet )

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://spin-joy-deluxe.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/01272084-1367-4346-8d3b-b1aa84b45a82).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
