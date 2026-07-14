from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent

NEW_BLOCK = """<!-- Amber Atlas favicon — jednolite czarne tło -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="#000000">
<meta name="msapplication-config" content="/browserconfig.xml">
<meta name="theme-color" content="#000000">"""

patterns = [
    r'\s*<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]*>\s*',
    r'\s*<link[^>]+rel=["\']apple-touch-icon["\'][^>]*>\s*',
    r'\s*<link[^>]+rel=["\']manifest["\'][^>]*>\s*',
    r'\s*<meta[^>]+name=["\']msapplication-TileColor["\'][^>]*>\s*',
    r'\s*<meta[^>]+name=["\']msapplication-config["\'][^>]*>\s*',
    r'\s*<meta[^>]+name=["\']theme-color["\'][^>]*>\s*',
]

updated = 0
for html_path in ROOT.rglob("*.html"):
    if html_path.name == "HEAD_FAVICON_BLOCK.html":
        continue

    text = html_path.read_text(encoding="utf-8")
    original = text

    for pattern in patterns:
        text = re.sub(pattern, "\n", text, flags=re.IGNORECASE)

    if "</title>" in text:
        text = text.replace("</title>", "</title>\n" + NEW_BLOCK, 1)

    if text != original:
        html_path.write_text(text, encoding="utf-8")
        updated += 1
        print(f"Zaktualizowano: {html_path.relative_to(ROOT)}")

print(f"Gotowe. Liczba zaktualizowanych plików HTML: {updated}")
input("Naciśnij Enter, aby zamknąć...")
