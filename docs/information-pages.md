# FAQ, regulamin i polityka prywatności

Źródła sprawdzono 2026-10-16. Oryginalna witryna `https://jezykowastacja.pl/`
i jej publiczne API WordPress udostępniały jedną stronę główną, bez odrębnego
FAQ i polityki prywatności. W bibliotece mediów nie znaleziono PDF-ów.

Regulamin odnaleziono w zgodzie formularza ActiveNow 181238. Dokładny URL
źródłowy jest zapisany w `src/lib/information-pages.json`. Oryginalny PDF ma
cztery strony i jest przechowywany bez zmian w
`public/documents/regulamin-kursow-jezykowych.pdf`.
SHA-256: `04f88cf996b877ea07355cac8c7ec006c6cbddbafc107c20686413e470c5abef`.
Transkrypcja zachowuje treść i numerację wszystkich dziewięciu paragrafów;
porównanie tekstu po pominięciu białych znaków potwierdza zgodność.
Nie poprawiano cen, literówek ani warunków umowy. Ceny w PDF i na stronie
oryginalnej różnią się — właściciel powinien ustalić aktualną wersję dokumentu.

FAQ jest opracowaniem odpowiedzi na podstawie regulaminu i opisu szkoły,
a nie kopią nieodnalezionej sekcji pytań. Nie dopisuje gwarancji wyników,
bezpłatnej lekcji próbnej ani niepotwierdzonych terminów i cen.

Polityka prywatności jest **projektem**, nie dokumentem z oryginalnej witryny.
Zawiera dane szkoły z regulaminu i opis bieżących integracji. Nie ustala
nieznanych okresów retencji, podstaw prawnych ani warunków transferów danych.
Właściciel musi uzupełnić i zweryfikować treść. Źródła ogólnego opisu praw:
https://uodo.gov.pl/pl/493/155 oraz
https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en .

## Sanity

Studio → **FAQ i dokumenty** → **Przenieś FAQ i dokumenty do Sanity**.
Wymaga zalogowanej sesji z prawem zapisu; nie ma publicznego endpointu zapisującego.
Import przesyła PDF do zasobów Sanity i tworzy wyłącznie brakujące dokumenty:
FAQ i regulamin jako opublikowane, politykę jako `drafts.page-polityka-prywatnosci`.
Nie nadpisuje istniejących dokumentów ani szkiców. Ponowienie jest bezpieczne.

W **Podstronach** można edytować pytania, rozdziały, SEO, źródła i załącznik PDF.
Własny PDF należy wgrać w pole **Załącznik PDF**. Pole **Status dokumentu**
steruje oznaczeniem projektu i indeksowaniem. Po zweryfikowaniu polityki ustaw
**Treść zatwierdzona**, następnie **Publish**. Zmiana jest widoczna po buildzie.
Puste ustawienie SEO obrazu korzysta z logo, a import przypisuje istniejące logo CMS.

Strona korzysta z wersji bazowych dopóki ich odpowiedniki nie są opublikowane
w Sanity. Opublikowany dokument ma pierwszeństwo. Projekt ma widoczną informację,
`noindex` i nie trafia do sitemapy. FAQ emituje dokładnie jeden `FAQPage` z pytaniami
widocznymi dla czytelnika; regulamin ma zwykły `WebPage` i metadane załącznika PDF.

Po migracji domeny ustaw `SANITY_STUDIO_SITE_URL` w buildzie Studio, aby import
pobierał PDF z właściwej witryny. Domyślnie jest to obecna strona GitHub Pages.

Zmiana regulaminu lub załącznika w Sanity nie aktualizuje pliku przy zgodzie w zewnętrznym ActiveNow. Przy zmianie warunków szkoła powinna zaktualizować obie wersje.
