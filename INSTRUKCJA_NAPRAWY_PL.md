# Naprawa błędu CMS `require() of ES Module`

Log funkcji wskazuje błąd zgodności modułów JavaScript podczas uruchamiania funkcji Netlify.

Poprawka:
- wymusza Node.js 22.12.0,
- przypina zgodną wersję `sanitize-html`,
- zachowuje `@netlify/blobs` i `sanitize-html` jako zewnętrzne moduły podczas bundlowania,
- korzysta wyłącznie z publicznego rejestru npm.

## Wgranie

1. Rozpakuj paczkę.
2. Otwórz główny katalog repozytorium GitHub, w którym znajduje się `index.html`.
3. Wgraj i nadpisz:
   - `.nvmrc`
   - `.npmrc`
   - `package.json`
   - `package-lock.json`
   - `netlify.toml`
4. Kliknij **Commit changes**.
5. W Netlify wybierz:
   **Deploys → Trigger deploy → Clear cache and deploy site**.
6. Poczekaj na status **Published**.

## Test po publikacji

Otwórz kolejno:
- https://amberatlas.solar/conseils/
- https://amberatlas.solar/faq-photovoltaique-maroc/
- https://amberatlas.solar/admin/

Po poprawce funkcje `cms-render` oraz `cms-session` nie powinny już kończyć się błędem modułów.
