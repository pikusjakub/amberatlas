# Amber Atlas — Conseils, FAQ i panel CMS

## Co zostało dodane

- `/conseils/` — francuska sekcja artykułów eksperckich.
- `/faq-photovoltaique-maroc/` — francuska podstrona FAQ.
- `/admin/` — logowanie i panel dodawania/edycji/usuwania treści.
- prosty edytor tekstu z nagłówkami, pogrubieniem, listami i linkami,
- przesyłanie grafik JPG, PNG i WEBP do 5 MB,
- status `Brouillon` / `Publié`,
- automatyczna schema `Article` i `FAQPage`,
- dynamiczna mapa `/sitemap.xml`, która sama dodaje opublikowane artykuły,
- zapis treści i grafik w Netlify Blobs — bez konieczności nowego deployu po publikacji.

## Wdrożenie

1. Rozpakuj paczkę.
2. Wgraj **zawartość folderu** do głównego katalogu repozytorium GitHub i nadpisz pliki.
3. Nie usuwaj obecnych grafik strony, np. `logo.png`, `hotel.jpg`, `mag.jpg`, `wiat.jpg`, `grunt.jpg`.
4. Zrób commit do gałęzi `main`.
5. Poczekaj, aż Netlify pokaże `Published`.

## Jedna obowiązkowa konfiguracja hasła

W Netlify przejdź do:

`Project configuration → Environment variables → Add a variable`

Dodaj zmienną:

- Key: `CMS_ADMIN_PASSWORD`
- Value: `AmberAtlas123!`
- Scope: Functions / Runtime, jeżeli Netlify pyta o zakres

Login jest ustawiony domyślnie na:

`AmberAtlas`

Możesz opcjonalnie dodać `CMS_ADMIN_USER`, aby zmienić login.

Po zapisaniu zmiennej uruchom ponowny deploy: `Deploys → Trigger deploy → Deploy site`.

## Logowanie

Na dole francuskiej strony głównej znajduje się przycisk `Connexion`.
Można też wejść bezpośrednio na:

`https://amberatlas.solar/admin/`

## Test po wdrożeniu

Sprawdź:

- `https://amberatlas.solar/conseils/`
- `https://amberatlas.solar/faq-photovoltaique-maroc/`
- `https://amberatlas.solar/admin/`
- `https://amberatlas.solar/sitemap.xml`

Po opublikowaniu artykułu jego adres ma postać:

`https://amberatlas.solar/conseils/nazwa-artykulu/`

## Ważne bezpieczeństwo

Hasło nie jest zapisane w HTML ani JavaScript przeglądarki. Jest sprawdzane po stronie Netlify Functions. Sesja używa bezpiecznego ciasteczka `HttpOnly`, `Secure` i `SameSite=Strict`. Po pierwszym uruchomieniu warto zmienić hasło na dłuższe i unikalne, ponieważ wskazane hasło zostało wcześniej ustalone w rozmowie.

## Uwagi techniczne

- Dodanie lub edycja treści nie wymaga ponownego wdrożenia strony.
- Bloby powstają przy pierwszym zapisie artykułu, FAQ lub grafiki.
- Artykuły ze statusem `Brouillon` nie są publiczne i nie trafiają do mapy strony.
- Panel `/admin/` ma `noindex`, więc nie powinien być indeksowany przez Google.
