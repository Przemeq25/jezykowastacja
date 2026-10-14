# Językowa Stacja — demo do akceptacji

Next.js App Router + TypeScript + Tailwind CSS 4. Odtworzona identyfikacja wizualna obecnej strony, osobne strony oferty i blog. Bez shadcn: obecny zakres nie wymaga dodatkowej biblioteki komponentów.

## Lokalnie

```sh
npm ci
npm run dev
```

## Wersja testowa

- Wszystkie formularze są lokalnymi symulacjami. Dane nie są wysyłane ani utrwalane.
- Nie są ładowane skrypty ActiveNow, analityka ani produkcyjne dane Sanity.
- Dane kontaktowe, ceny i terminy służą wyłącznie demonstracji. Logo, zdjęcia i stylistyka pochodzą z obecnej witryny za zgodą właściciela projektu.
- Strona nie jest jeszcze wdrożona. Publikacja wymaga zatwierdzenia wyglądu przez właściciela.
- Workflow Pages jest tylko ręczny; sam commit nie publikuje strony.

## Sprawdzenie eksportu

```sh
NEXT_PUBLIC_BASE_PATH=/jezykowastacja NEXT_PUBLIC_SITE_URL=https://przemeq25.github.io/jezykowastacja npm run build
npm run typecheck
npm run check:export
```

Pliki gotowe do hostowania są w `out/`. `output: export` i `trailingSlash` umożliwiają hosting GitHub Pages i zwykły hosting statyczny. Pod Vercel lub domenę główną pozostaw pusty `NEXT_PUBLIC_BASE_PATH` i ustaw właściwy `NEXT_PUBLIC_SITE_URL`.

## Sanity — przygotowana integracja, nieaktywna w demo

Oddzielny panel `studio/` zawiera schematy podstron, sekcji, FAQ, artykułów i ustawień strony głównej. Strona używa publicznego API Content Lake w czasie budowania; nie dokłada SDK CMS do przeglądarki.

Po osobnej zgodzie na aktywację utwórz nowy projekt Sanity i publiczny dataset testowy. Skopiuj `.env.example` do `.env.local` i ustaw ID, dataset oraz `NEXT_PUBLIC_ENABLE_LIVE_DATA=true`. W `studio/.env` ustaw `SANITY_STUDIO_PROJECT_ID` i `SANITY_STUDIO_DATASET`, potem uruchom `npm install && npm run dev` w katalogu `studio`.

Treści początkowe można wygenerować przez `node scripts/create-sanity-seed.mjs`, następnie zaimportować `studio/seed.ndjson` przez CLI Sanity. Demo celowo nie zawiera projektu, tokenów ani połączenia z datasetem.

Na GitHub Pages nowe treści CMS wymagają ponownego builda. Po aktywacji CMS można użyć webhooka i workflow z zatwierdzonymi uprawnieniami. Workflow demo pozostaje bez połączenia z CMS.

## Docelowe formularze

Zastąp `src/components/signup-form.tsx` zatwierdzonym embedem ActiveNow. `contact-form.tsx` jest obecnie mockiem; do automatycznej wysyłki potrzebny jest osobny endpoint/usługa e-mail, ponieważ GitHub Pages nie uruchamia backendu. Nie umieszczaj kluczy SMTP/API w `NEXT_PUBLIC_*`.

## SEO i GEO

Każda oferta ma własny HTML, H1, opis i canonical. Są sitemap.xml, robots.txt, semantyczne treści, FAQ i linkowanie wewnętrzne. JSON-LD opisuje organizację, ścieżkę podstrony i artykuły, bez wymyślonych ocen i opinii. Widoczność w Google i odpowiedziach AI nie jest gwarantowana.


## CMS Sanity — skonfigurowany projekt

Project ID: `f1yzh257`, dataset: `stacja` (publiczny). Strona pobiera wyłącznie opublikowane dokumenty podczas builda. Formularze nadal są mockami — włączenie CMS nie aktywuje formularzy ani danych produkcyjnych. Dopóki dataset jest pusty, strona używa treści demo.

Panel: https://przemeq25.github.io/jezykowastacja/studio/

1. W Sanity Manage → projekt → API → CORS origins dodaj `https://przemeq25.github.io` z **Allow credentials**. To dostęp przeglądarkowego panelu; zapis nadal wymaga konta z uprawnieniami do projektu.
2. Zaloguj się w panelu jako członek projektu.
3. Zakładka **Uruchomienie CMS → Wczytaj treści demo** importuje 13 dokumentów i zdjęcia do pustego datasetu. Import zatrzyma się, jeśli znajdzie istniejące treści.
4. Edytuj w **Treści strony**, kliknij **Publish**. GitHub przebudowuje stronę co godzinę (harmonogram może być opóźniony przez GitHub), po zmianach kodu i ręcznie przez Actions → Run workflow.

Panel obejmuje nagłówek i opis strony głównej, główne zdjęcie, logo, opis podejścia, kafelki odbiorców, formy zajęć i ceny, FAQ strony głównej, kontakt, podstrony z SEO i FAQ oraz blog. Stałe etykiety nawigacji i elementy dekoracyjne pozostają w kodzie. Nie przechowuj w publicznym datasecie danych uczniów, haseł ani tokenów.

Lokalnie: `npm ci --prefix studio`, `npm run dev --prefix studio`. Dla lokalnego panelu dodaj też origin `http://localhost:3333` w CORS. Identyfikatory projektu i datasetu są publiczne; żaden token zapisu nie trafia do kodu ani workflow.
