#!/usr/bin/env bash
# Spin the Wheel Deluxe — förbereder iPhone- och Android-versionen.
# Kör från projektmappens rot:  bash scripts/setup-app.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 1/5 Kontrollerar verktyg"
node -v
npm -v

echo "==> 2/5 Installerar paket"
if command -v bun >/dev/null 2>&1 && [ -f bun.lock ]; then
  bun install
else
  npm install
fi

echo "==> 3/5 Skapar iPhone- och Android-projekt"
[ -d ios ] || npx cap add ios
[ -d android ] || npx cap add android

echo "==> 4/5 Kopierar appresurser"
npx cap sync

echo "==> 5/5 Skapar alla appikoner och startskärmar"
npx capacitor-assets generate
npx cap sync

cat <<'TXT'

================ KLART =================

iPhone:     npx cap open ios        (kräver Mac med Xcode)
Android:    npx cap open android    (kräver Android Studio)

Resten fram till App Store och Google Play står i STORE-RELEASE.md
TXT
