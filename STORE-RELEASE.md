# Spin the Wheel Deluxe — från kod till App Store och Google Play

Appen är redan byggd och publicerad på https://spin-joy-deluxe.lovable.app
Den laddar den sidan, så den behöver internet. Integritetssidan finns på
https://spin-joy-deluxe.lovable.app/privacy

Allt nedan görs på din dator.

## 1. Hämta koden

1. I Lovable: **Plus (+) → GitHub → Connect project** och skapa repository:t.
2. På datorn:

```
git clone <adressen till ditt GitHub-repo>
cd <repo-mappen>
```

## 2. Bygg app-versionerna (ett kommando)

```
bash scripts/setup-app.sh
```

Skriptet installerar paket, skapar iPhone- och Android-projekten, och gör
färdiga appikoner och startskärmar av `assets/icon.png` och `assets/splash.png`.

## 3. iPhone till App Store

```
npx cap open ios
```

1. I Xcode: välj din **Team** under *Signing & Capabilities* och ett unikt
   **Bundle Identifier**.
2. Appikonen är redan ifylld av skriptet.
3. **Product → Archive**. När arkivet klart: **Distribute App → App Store Connect → Upload**.
4. I **App Store Connect**:
   - Pris: **20,00 kr** (betalbar nedladdning, nivå 2).
   - Åldersgräns: **13+** (inget spel om pengar, ingen reklam, inga köp i appen).
   - Integritetspolicy: https://spin-joy-deluxe.lovable.app/privacy
   - **App Privacy: Data Not Collected** (appen sparar bara på telefonen).
   - Ladda upp skärmbilder från telefonen (minst en per telefonstorlek).
5. **Submit for Review**. Granskningen tar oftast 1–3 dagar.

## 4. Android till Google Play

```
npx cap open android
```

1. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**.
2. Skapa en ny nyckelfil. **Spara nyckelfilen och lösenorden!** Utan den kan
   du aldrig uppdatera appen.
3. I **Play Console**:
   - Ny app, betald nedladdning, pris **20,00 kr**.
   - Åldersklassning: fyll i frågeformuläret (ger ca 12+/13+).
   - Datasäkerhet: **ingen data samlas in**, dela inte med tredjepart.
   - Integritetspolicy: https://spin-joy-deluxe.lovable.app/privacy
   - Ladda upp .aab-filen under **Testning → Produktion**.
4. **Skicka till granskning**.

## 5. Bra att veta

- **Apple** kan neka appar som bara visar en webbsida (regel 4.2). Vill det
  hända görs om appen så allt ligger lokalt i stället — säg till så fixar jag det.
- **Nya personliga Google-konton** kan kräva 14 dagars testning med 12 testare
  innan produktion släpps. Kolla i Play Console om det gäller ditt konto.
- Ett betalt Android-konto behöver en kopplad **betalprofil**.
- Mappen `ios/` och `android/` skapas lokalt av skriptet och synkas inte
  tillbaka till Lovable (de står i `.gitignore`).
- Innehållet i appen ändras inte av sig självt: nya hjul sparas som egna hjul
  och det gamla ligger kvar i **Mina hjul** tills du raderar det där.
