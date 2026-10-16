# SEO w Sanity

Pola tytułów i opisów są osobne dla strony głównej, każdej podstrony i wpisu.
Obraz SEO wskazuje logo, zgodnie z wyborem właściciela. Zdjęcia w treści pozostają
niezmienione. Canonical, Open Graph, Twitter i JSON-LD powstają podczas builda.

Uzupełnienie: Studio → **Uzupełnianie SEO** → **Sprawdź brakujące SEO**.
Podgląd pokazuje dokładne zmiany. **Uzupełnij i opublikuj SEO** zapisuje je
w istniejących dokumentach. Operacja nie zastępuje niepustych tytułów i opisów,
zachowuje noindex, ustawia logo jako obraz SEO i wypełnia organizację.
Pozostała treść szkiców nie jest publikowana. Transakcja wymaga zgodnych rewizji;
w razie równoczesnej edycji trzeba odświeżyć podgląd. Ponowne uruchomienie po
uzupełnieniu pól niczego nie zmienia.

Teksty i plan uzupełnienia: `src/lib/seo-content.ts`.
Edytowalne dane organizacji: Studio → Strona główna i ustawienia →
**Organizacja i wizytówka Google**. Nazwa, opis, witryna, Google, telefon i e-mail.
Publiczny kontakt organizacji jest niezależny od tymczasowego adresu odbiorcy
formularza FormSubmit. Obecność danych organizacji nie zmienia flagi demo opinii.

Źródło organizacji: https://jezykowastacja.pl/ (2026-10-16).
Profil Google wskazany przez oryginalną witrynę:
https://share.google/9BTeBcVja2YvKl6vM . Google ograniczył odczyt szczegółów profilu,
więc nie kopiujemy niepotwierdzonego adresu, godzin, współrzędnych ani ocen.
Nie generujemy `AggregateRating`, fikcyjnego założyciela ani nieistniejącej wyszukiwarki.

JSON-LD:

- wspólna tożsamość `EducationalOrganization` i `WebSite`;
- `WebPage` i `BreadcrumbList` dla podstron;
- `Service` dla oferty i pierwszej lekcji, bez fikcyjnych ofert cenowych;
- `AboutPage` dla „O nas”, `ContactPage` dla kontaktu;
- `CollectionPage` + `ItemList` dla listy bloga;
- `BlogPosting` + `WebPage` + `BreadcrumbList` dla wpisów;
- `FAQPage` tylko dla pytań i odpowiedzi faktycznie widocznych na stronie.

Frazy kluczowe są naturalnie użyte w tytułach i opisach, bez upychania fraz
w meta keywords. Dane strukturalne opisują treść, nie gwarantują pozycji w Google
ani obecności w odpowiedziach AI. GitHub Pages potrzebuje builda po zmianie CMS.

Przy braku własnych tytułów i opisów CMS strona korzysta z tych samych propozycji jako wartości domyślnych. Nie zapisuje ich automatycznie do Content Lake: ten zapis nadal wymaga uwierzytelnienia. Podstrona Mięczaków została wycofana z publikacji i uzupełniania SEO na życzenie właściciela; dokument pozostaje w historii CMS.
