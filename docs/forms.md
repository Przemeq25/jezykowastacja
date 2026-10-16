# Formularze

## Zapisy — aktywne ActiveNow

Oryginał: https://jezykowastacja.pl (zweryfikowano 2026-10-16).
Szkoła 19620; grupy 179720, indywidualne i próbne 181238.
Publiczny kod integracji pochodzi z osadzenia szkoły i nie jest sekretem API.

`SignupForm` osadza dokumenty `public/forms/{group,individual}.html`.
Każda ramka ma własny kontekst skryptów: ponowne wejście na podstronę nie
zostawia pustego formularza ani globalnych stylów ActiveNow w aplikacji.
Oryginalny skrypt pobiera aktualne kursy, terminy, zgody i regulamin szkoły.
Nie zapisujemy danych uczestników po naszej stronie.

Dostosowanie kolorów: `public/forms/brand.css`. Obecny skrypt generuje zwykły DOM,
więc przyciski można stylować. Integracja zachowuje mechanikę i walidację dostawcy.
Przyszłe zmiany klas HTML po stronie ActiveNow mogą wymagać aktualizacji CSS.
Komunikaty między ramką a stroną zawierają tylko wysokość i gotowość; odbiorca
sprawdza origin oraz źródłową ramkę. Dokumenty osadzeń mają noindex.

## Kontakt — FormSubmit

Statyczny GitHub Pages nie uruchamia endpointów Next.js ani SMTP.
Formularz używa natywnego POST do FormSubmit.co z odbiorcą wskazanym przez
właściciela: przemyslaw.cichon.1997@gmail.com. Nie wymaga klucza API.
Wiadomość i adres nadawcy trafiają do tej usługi. Informacja o niej jest przy formularzu.

**Pierwsze uruchomienie:** wyślij formularz z opublikowanej strony, przejdź CAPTCHA,
a następnie potwierdź adres linkiem w mailu aktywacyjnym od FormSubmit.
Przed aktywacją nie należy uznawać dostarczania poczty za uruchomione.
Po aktywacji sprawdź jedną wiadomość (także Spam). Przy zmianie domeny sprawdź
ponownie wymagania aktywacji. Nie przeprowadzono rzeczywistego testu doręczenia.

Ochrona: weryfikowana przez usługę CAPTCHA (nie wyłączamy jej przez AJAX),
filtrowanie spamu dostawcy, honeypot `_honey`, blokada podwójnego kliknięcia,
60 sekund między próbami w tej samej sesji przeglądarki i walidacja pól.
Blokada w przeglądarce jest pomocnicza i można ją ominąć; nie jest limitem per IP.
Nie obiecujemy całkowitego wyeliminowania spamu ani nieudokumentowanego limitu dostawcy.
Jeśli potrzebny jest ścisły limit per IP lub własny SMTP, należy uruchomić backend
(np. na cyber_Folks), weryfikować CAPTCHA po stronie serwera i przechowywać tam
liczniki oraz sekrety. Nie umieszczać kluczy SMTP w NEXT_PUBLIC_*.

Dokumentacja: https://formsubmit.co/documentation i https://formsubmit.co/help.
Testy automatyczne nie wysyłają maili ani zgłoszeń do ActiveNow.
