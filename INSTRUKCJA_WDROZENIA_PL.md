# Amber Atlas — czarny favicon bez białej obwódki

Paczka została przygotowana na podstawie aktualnego pliku `logo.png`
pobranego ze strony Amber Atlas. Znak i złote elementy pozostały zgodne
z obecnym logo, natomiast tło faviconów jest jednolicie czarne i
nie zawiera przezroczystych ani białych marginesów.

## Najprostsze wdrożenie przez GitHub

1. Rozpakuj ZIP.
2. Wgraj do głównego katalogu repozytorium, obok `index.html`:

- `favicon.ico`
- `favicon.png`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `favicon-96x96.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`
- `manifest.json`
- `browserconfig.xml`

3. W pliku `index.html` usuń stare linie favicon, które wskazują
   na `/logo.png`, i wklej w sekcji `<head>` zawartość pliku:

`HEAD_FAVICON_BLOCK.html`

4. Dla artykułów i FAQ nadpisz również:

`netlify/functions/cms-render.mjs`

5. Kliknij `Commit changes` i poczekaj na deploy Netlify ze statusem
   `Published`.

## Aktualizacja pozostałych podstron

Możesz ręcznie wkleić blok z `HEAD_FAVICON_BLOCK.html` do pozostałych
plików HTML albo uruchomić lokalnie `PATCH_ALL_HTML.bat` w skopiowanym
folderze repozytorium. Skrypt zaktualizuje wszystkie pliki `.html`
rekurencyjnie.

Przed uruchomieniem skryptu warto zachować kopię repozytorium.

## Sprawdzenie po wdrożeniu

Otwórz:

- https://amberatlas.solar/favicon-48x48.png
- https://amberatlas.solar/favicon.ico
- https://amberatlas.solar/site.webmanifest

Następnie wykonaj `Ctrl + F5`.

## Google

W Google Search Console sprawdź adres strony głównej i wybierz
`Poproś o zindeksowanie`. Google przechowuje favicon w pamięci
podręcznej, dlatego zmiana w wynikach wyszukiwania może pojawić się
po kilku dniach lub po ponownym crawlowaniu strony.

Google może nadal wyświetlać favicon w okrągłym interfejsie wyników,
ale sam plik nie ma już białej ani przezroczystej obwódki.
