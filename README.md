# Językowa Stacja — demo do akceptacji

Next.js App Router + TypeScript + Tailwind CSS 4. Odtworzona identyfikacja wizualna obecnej strony, osobne strony oferty i blog. Bez shadcn: obecny zakres nie wymaga dodatkowej biblioteki komponentów.

## Lokalnie

```sh
npm ci
npm run dev
```

## Wersja testowa

- Opublikowana na https://przemeq25.github.io/jezykowastacja/ po zatwierdzeniu wyglądu przez właściciela.
- Zapisy korzystają z aktywnych formularzy ActiveNow szkoły. Kontakt używa FormSubmit i wymaga potwierdzenia adresu odbiorcy. Szczegóły: [formularze](docs/forms.md).
- Pozostałe przykładowe dane biura i opinie demonstracyjne zachowują oznaczenia wersji testowej. Aktualne terminy i ceny w formularzach ActiveNow pochodzą od szkoły.
- Logo i zdjęcia pochodzą z obecnej witryny za zgodą właściciela. Analityka nie jest uruchomiona.
- GitHub Actions publikuje stronę po zmianach na main, ręcznie i według harmonogramu aktualizacji CMS.

## Sprawdzenie eksportu

```sh
NEXT_PUBLIC_BASE_PATH=/jezykowastacja NEXT_PUBLIC_SITE_URL=https://przemeq25.github.io/jezykowastacja npm run build
npm run typecheck
npm run check:export
```

Pliki gotowe do hostowania są w `out/`. `output: export` i `trailingSlash` umożliwiają hosting GitHub Pages i zwykły hosting statyczny. Pod Vercel lub domenę główną pozostaw pusty `NEXT_PUBLIC_BASE_PATH` i ustaw właściwy `NEXT_PUBLIC_SITE_URL`.

## Sanity i formularze

Oddzielny panel `studio/` zawiera schematy podstron, sekcji, FAQ, artykułów i ustawień strony głównej. Strona używa publicznego API Content Lake w czasie budowania; nie dokłada SDK CMS do przeglądarki. Konfiguracja projektu i edycji znajduje się poniżej.

Formularze ActiveNow i kontakt są niezależne od flagi `NEXT_PUBLIC_ENABLE_LIVE_DATA`, która nadal steruje pozostałymi oznaczeniami demo. Zasady działania, ochrony przed spamem i aktywacji poczty opisuje [docs/forms.md](docs/forms.md). Nie umieszczaj kluczy SMTP/API w `NEXT_PUBLIC_*`.

## SEO i GEO

Każda oferta ma własny HTML, H1, opis i canonical. Są sitemap.xml, robots.txt, semantyczne treści, FAQ i linkowanie wewnętrzne. JSON-LD opisuje organizację, ścieżkę podstrony i artykuły, bez wymyślonych ocen i opinii. Widoczność w Google i odpowiedziach AI nie jest gwarantowana.

## CMS Sanity — skonfigurowany projekt

Project ID: `f1yzh257`, dataset: `stacja` (publiczny). Strona pobiera wyłącznie opublikowane dokumenty podczas builda. Formularze zapisów i kontakt mają osobne integracje opisane powyżej. Dopóki dataset jest pusty, strona używa treści demo.

Panel: https://przemeq25.github.io/jezykowastacja/studio/

1. W Sanity Manage → projekt → API → CORS origins dodaj `https://przemeq25.github.io` z **Allow credentials**. To dostęp przeglądarkowego panelu; zapis nadal wymaga konta z uprawnieniami do projektu.
2. Zaloguj się w panelu jako członek projektu.
3. Zakładka **Uruchomienie CMS → Wczytaj treści demo** importuje 13 dokumentów i zdjęcia do pustego datasetu. Import zatrzyma się, jeśli znajdzie istniejące treści.
4. Edytuj w **Treści strony**, kliknij **Publish**. GitHub przebudowuje stronę co godzinę (harmonogram może być opóźniony przez GitHub), po zmianach kodu i ręcznie przez Actions → Run workflow.

Panel obejmuje nagłówek i opis strony głównej, główne zdjęcie, logo, opis podejścia, kafelki odbiorców, formy zajęć i ceny, FAQ strony głównej, kontakt, podstrony z SEO i FAQ oraz blog. Stałe etykiety nawigacji i elementy dekoracyjne pozostają w kodzie. Nie przechowuj w publicznym datasecie danych uczniów, haseł ani tokenów.

Lokalnie: `npm ci --prefix studio`, `npm run dev --prefix studio`. Dla lokalnego panelu dodaj też origin `http://localhost:3333` w CORS. Identyfikatory projektu i datasetu są publiczne; żaden token zapisu nie trafia do kodu ani workflow.

## Kadra i opinie

Sekcje są wyświetlane na stronie głównej i „O nas”. W Studio wybierz **Kadra i opinie**. Nowy dokument ma od razu wypełnione dane początkowe: cztery osoby z oryginalnej strony, propozycje krótkich opisów oraz krótki, autentyczny fragment opinii Kamili. Przy pierwszej edycji kliknij **Publish**, aby zapisać dokument w Sanity. Do tego momentu strona korzysta z identycznych danych początkowych zapisanych w kodzie. Istniejące treści CMS nie są nadpisywane.

Możesz edytować nagłówki, opisy, nazwiska, role, zdjęcia i tekst alternatywny, zmieniać kolejność osób i opinii, dodawać kolejne lub ukryć każdą sekcję. Zdjęcia początkowe to kopie oryginalnych zdjęć hostowane wraz ze stroną; zdjęcie przesłane w polu „Zdjęcie” ma pierwszeństwo i jest przechowywane w Sanity. Opisy kadry są propozycjami redakcyjnymi, bez dopisywania kwalifikacji ani stażu. Opinia jest oznaczona jako fragment i ma link do oryginału. Nie dodano ocen liczbowych. Przykładowe opinie są jawnie oznaczone jako demonstracyjne.

## Kontrola jakości i formatowanie

Projekt korzysta z konfiguracji ESLint Next.js **Core Web Vitals + TypeScript** oraz Prettiera. Reguły Next.js nie są wyłączane na potrzeby formatowania; `eslint-config-prettier` usuwa konflikty reguł stylistycznych.

- `npm run lint` — sprawdza kod aplikacji, Studio i skryptów; ostrzeżenia również blokują kontrolę.
- `npm run lint:fix` — stosuje dostępne automatyczne poprawki ESLint.
- `npm run format` — formatuje kod, konfigurację i dokumentację.
- `npm run format:check` — sprawdza formatowanie bez zapisywania zmian.

Wygenerowane pliki, zależności, obrazy, lockfile i dane importu są pomijane przez formatter. GitHub Actions uruchamia lint i kontrolę formatowania przed sprawdzaniem typów i buildem. W Next.js 16 używamy bezpośrednio CLI ESLint.

## Nawigacja, formularze i social media

Menu jest pełnoekranowym natywnym dialogiem na wszystkich rozmiarach ekranu. Linki, zamknięcie i Escape uruchamiają animację zamykania, przywracają przewijanie i fokus. Animacje respektują ograniczenie ruchu w systemie. Formularz kontaktowy pokazuje błędy pod polami i przenosi fokus do pierwszego błędu. Zapisy korzystają z walidacji i obsługi ActiveNow.

Ikony interfejsu: `lucide-react`; znaki platform: `@icons-pack/react-simple-icons`. Instagram, TikTok i Facebook pochodzą z linków na oryginalnej stronie. Edycja: **Strona główna i ustawienia → Profile społecznościowe**, wraz z tekstem sekcji social mediów. Linki do obcych domen nie są renderowane jako profile tych platform.

Karuzela opinii jest sterowana przyciskami, kropkami, klawiaturą i gestem przesunięcia. Nie ma automatycznego przewijania. W trybie demo do prawdziwych opinii z CMS dołączają dwa jednoznacznie oznaczone przykłady; przy `NEXT_PUBLIC_ENABLE_LIVE_DATA=true` przykłady znikają. Nie są przedstawiane jako opinie rzeczywistych osób ani uwzględniane w danych ocen. Autentyczne opinie nadal edytujesz w **Kadra i opinie**.

## SEO i dane strukturalne

Metadane są generowane z opublikowanych danych Sanity podczas builda: tytuły i opisy, canonical, Open Graph, Twitter Cards. Podstrony i artykuły mają obiekt **SEO i udostępnianie** z opcjonalnym tytułem, opisem, własnym obrazem OG i noindex. Domyślna grafika OG ma 1200 × 630 px; można zastąpić ją w ustawieniach Studio. Puste pola SEO korzystają z tytułu/opisu treści i ustawień całej strony.

JSON-LD obejmuje `EducationalOrganization`, `WebSite`, `WebPage`, breadcrumbs, widoczne FAQ, osoby w widocznej sekcji kadry, usługi online i artykuły z datami z CMS. Przykładowe kontakty nie są dodawane do danych organizacji w trybie demo. Nie generujemy fikcyjnych ocen, adresów ani współrzędnych. Sitemap zawiera daty aktualizacji z CMS i pomija treści oznaczone noindex; robots wyklucza Studio. Kontrola eksportu sprawdza metadane, poprawność JSON-LD, nagłówki i linki.

To podstawa techniczna SEO i czytelności dla systemów AI, bez gwarancji indeksacji lub pozycji. Po migracji na domenę docelową trzeba ustawić `NEXT_PUBLIC_SITE_URL` i ścieżki, wdrożyć stronę oraz zweryfikować domenę i sitemapę w Search Console. Na GitHub Pages zmiana treści aktualizuje metadane przy następnym buildzie. Zapisy ActiveNow są aktywne; kontakt wymaga aktywacji odbiorcy w FormSubmit. Analityka nie jest włączona.

`npm run test` uruchamia testy interakcji (menu, walidacja, karuzela) i generowania metadanych/JSON-LD. Są też częścią GitHub Actions. W tym środowisku testy DOM nie zastępują pełnej wizualnej kontroli w przeglądarce.
