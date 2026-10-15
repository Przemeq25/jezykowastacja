export type Section = { title: string; text: string; items?: string[] };
export type Page = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  image: string;
  sections: Section[];
  faq: { question: string; answer: string }[];
  kind?: 'individual' | 'group' | 'contact' | 'blog';
};
export const philosophy =
  'Nie wierzymy w jeden sposób nauki dla wszystkich. Każde zajęcia przygotowujemy z myślą o konkretnej osobie: jej tempie, zainteresowaniach i celach. Dzięki temu nauka staje się naturalna, a zdobywanie kolejnych umiejętności daje satysfakcję zamiast stresu. Błędy są częścią procesu. Traktujemy je z życzliwością, bo wiemy, że właśnie dzięki nim rozwijamy się najbardziej.';
export const formats = [
  {
    title: 'Lekcje 1:1',
    slug: 'lekcje-indywidualne',
    price: 'od 99 zł',
    text: 'Cała lekcja skupiona wyłącznie na Tobie; Twoim tempie, celach i tematach, które naprawdę Cię interesują. To najszybsza droga do postępów, bo program dopasowujemy na bieżąco do Twoich potrzeb, a Ty masz pełną uwagę lektora przez całe zajęcia.',
  },
  {
    title: 'Zajęcia w parze',
    slug: 'zajecia-w-parze',
    price: '75 zł / osoba',
    text: 'Nauka w małej, kameralnej grupie z jedną drugą osobą; więcej okazji do rozmowy niż w grupie, a jednocześnie odrobina zdrowej motywacji i wsparcia, gdy uczysz się z kimś obok. To świetna równowaga między indywidualną uwagą a energią wspólnej nauki.',
  },
  {
    title: 'Zajęcia grupowe',
    slug: 'kursy-grupowe',
    price: '60 zł / osoba',
    text: 'Nauka w grupie to przede wszystkim żywy język; dyskusje, wymiana zdań, więcej okazji do słuchania różnych akcentów i sposobów mówienia. To naturalne środowisko do ćwiczenia swobodnej komunikacji, a atmosfera grupy dodaje motywacji do regularnej nauki.',
  },
];
export const audiences = [
  {
    title: 'Dzieci',
    image: 'children.webp',
    text: 'Nauka poprzez zabawę, piosenki i historie; w tempie dopasowanym do dziecka. Budujemy ciekawość języka od najmłodszych lat.',
  },
  {
    title: 'Młodzież',
    image: 'teens.webp',
    text: 'Lekcje dopasowane do prawdziwych potrzeb nastolatków; od nadrabiania szkolnych zaległości i przygotowania do egzaminów, po pewność siebie w rozmowie.',
  },
  {
    title: 'Dorośli',
    image: 'adults.webp',
    text: 'Dla dorosłych mamy coś, czego brakuje w wielu szkołach: elastyczność, brak oceniania i lekcje skrojone pod Twoje cele; czy to praca, podróże, czy po prostu satysfakcja z mówienia płynnie.',
  },
];
const commonFaq = [
  {
    question: 'Jak odbywają się zajęcia online?',
    answer:
      'Spotykamy się z lektorem przez internet. Potrzebujesz stabilnego połączenia, mikrofonu i urządzenia z kamerą. Szczegóły spotkania ustalamy przy zapisie.',
  },
  {
    question: 'Czy mogę zacząć od zera?',
    answer:
      'Tak. Nauka jest dopasowana do Twojego poziomu i celów. Przy zgłoszeniu opowiedz nam, czy zaczynasz od podstaw, czy chcesz wrócić do nauki.',
  },
  {
    question: 'Czy zajęcia są dla dzieci, młodzieży i dorosłych?',
    answer:
      'Tak. Pracujemy z każdą z tych grup, dobierając sposób nauki do wieku, zainteresowań i potrzeb ucznia.',
  },
];
export const pages: Page[] = [
  ...(['hiszpanski', 'angielski'] as const).map((language) => ({
    slug: `${language}-online`,
    title:
      language === 'hiszpanski'
        ? 'Hiszpański online. Z odwagą do rozmowy.'
        : 'Angielski online. Bliżej Twoich celów.',
    description:
      language === 'hiszpanski'
        ? 'Nauka hiszpańskiego online dla dzieci, młodzieży i dorosłych. Wybierz lekcje indywidualne, w parze lub grupowe i rozwijaj swobodę mówienia.'
        : 'Nauka angielskiego online dopasowana do Twojego poziomu i celów. Lekcje indywidualne, w parze i grupowe dla dzieci, młodzieży i dorosłych.',
    eyebrow:
      language === 'hiszpanski'
        ? '¡Hola! Poznaj hiszpański'
        : 'Hello! Poznaj angielski',
    image: 'hero.webp',
    sections: [
      {
        title: 'Ucz się tak, jak lubisz',
        text: 'Chcesz swobodniej rozmawiać w podróży, lepiej radzić sobie w szkole albo pewniej używać języka w pracy? Zaczynamy od Twojego celu. Ćwiczymy mówienie, słuchanie, czytanie i pisanie w spokojnej atmosferze.',
        items: [
          'Lekcje 1:1 dopasowane do Ciebie',
          'Zajęcia w parze z bliską osobą',
          'Nauka w grupie i wspólna motywacja',
        ],
      },
      {
        title: 'Od pierwszych słów do prawdziwej rozmowy',
        text: 'Nie musisz od razu mówić bezbłędnie. Ważne, żeby próbować. Na zajęciach pracujemy z sytuacjami, które możesz spotkać poza lekcją, a nowe słownictwo wykorzystujesz w kontekście.',
      },
    ],
    faq: commonFaq,
  })),
  ...formats.map((f, i) => ({
    slug: f.slug,
    title: f.title,
    description: f.text,
    eyebrow: 'Twój sposób na naukę',
    image: i === 2 ? 'philosophy.webp' : 'hero.webp',
    sections: [
      { title: 'Język w Twoim rytmie', text: f.text },
      {
        title:
          i === 0
            ? 'Dla kogo są lekcje indywidualne?'
            : i === 1
              ? 'Razem łatwiej utrzymać motywację'
              : 'Rozmowa, która daje pewność siebie',
        text:
          i === 0
            ? 'Idealne dla osób, które chcą uczyć się w swoim rytmie, mają konkretny cel (np. rozmowa kwalifikacyjna, egzamin, wyjazd) albo wolą pracować bez presji porównywania się z innymi.'
            : i === 1
              ? 'Idealne dla znajomych, par, rodzeństwa lub osób, które uczą się na podobnym poziomie i chcą razem trzymać się celu.'
              : 'Idealne dla osób, które lubią uczyć się w towarzystwie i chcą rozwijać pewność siebie w rozmowie z różnymi ludźmi.',
      },
      {
        title: 'Cena zajęć',
        text: `${f.price}. Informacje o długości lekcji, dostępności i warunkach zapisu otrzymasz od biura przed rozpoczęciem zajęć.`,
      },
    ],
    faq: commonFaq,
    kind:
      i === 0
        ? ('individual' as const)
        : i === 2
          ? ('group' as const)
          : undefined,
  })),
  {
    slug: 'lekcja-probna',
    title: 'Poznajmy się na pierwszej lekcji.',
    description:
      'Zgłoś się na pierwsze spotkanie z Językową Stacją. Opowiedz o swoich celach i poznaj sposób nauki angielskiego lub hiszpańskiego online.',
    eyebrow: 'Pierwszy przystanek',
    image: 'hero.webp',
    sections: [
      {
        title: 'Zacznijmy od Ciebie',
        text: 'Pierwsze spotkanie to okazja, żeby porozmawiać o Twoich oczekiwaniach, poziomie i tym, jak lubisz się uczyć. Przy zgłoszeniu zaznacz, że interesuje Cię lekcja próbna; biuro potwierdzi dostępność, cenę i szczegóły.',
      },
    ],
    faq: [],
    kind: 'individual',
  },
  {
    slug: 'o-nas',
    title: 'Miejsce, w którym możesz mówić po swojemu.',
    description:
      'Poznaj Językową Stację: szkołę angielskiego i hiszpańskiego online, która stawia na indywidualne podejście i odwagę w komunikacji.',
    eyebrow: 'O Językowej Stacji',
    image: 'founder.webp',
    sections: [
      { title: 'Nasza filozofia', text: philosophy },
      {
        title: 'Odwaga, nie perfekcja',
        text: 'Moim celem nigdy nie było tylko uczyć języka, chodziło o to, żeby dać ludziom odwagę, by się nim posługiwali. Dlatego stawiam na wszechstronny rozwój: słuchanie, mówienie, pisanie, czytanie; każdą umiejętność, która buduje prawdziwą swobodę w komunikacji.',
      },
    ],
    faq: [],
  },
  {
    slug: 'kontakt',
    title: 'Porozmawiajmy o Twojej nauce.',
    description:
      'Skontaktuj się z biurem Językowej Stacji. Zapytaj o angielski i hiszpański online, dostępne terminy i warianty zajęć.',
    eyebrow: 'Jesteśmy w kontakcie',
    image: 'hero.webp',
    sections: [],
    faq: [],
    kind: 'contact',
  },
  {
    slug: 'hiszpanski-mieczaki',
    title: 'Hiszpański, Mięczaki i Twój kolejny krok.',
    description:
      'Szukasz nauki hiszpańskiego po lekcjach na kanale Mięczaki? Poznaj ofertę hiszpańskiego online w Językowej Stacji.',
    eyebrow: 'Od inspiracji do rozmowy',
    image: 'philosophy.webp',
    sections: [
      {
        title: 'Trafiasz tu po hiszpańskim na kanale Mięczaki?',
        text: 'Materiały na YouTube mogą być świetnym początkiem. Jeśli chcesz uporządkować podstawy i zacząć używać języka w rozmowie, poznaj nasze zajęcia online. Napisz, które tematy już znasz i czego chcesz nauczyć się dalej.',
      },
      {
        title: 'Przećwicz to, co już znasz',
        text: 'Na lekcjach masz przestrzeń na pytania, własne zdania i rozmowę z lektorem. Wybierz naukę indywidualną, w parze albo w grupie; pomożemy dobrać formę do Twoich potrzeb.',
      },
    ],
    faq: [
      {
        question: 'Czy muszę wcześniej obejrzeć lekcje na YouTube?',
        answer:
          'Nie. Możesz zacząć od podstaw albo wykorzystać wiedzę zdobytą samodzielnie. Opowiedz nam o niej przy zapisie.',
      },
    ],
  },
  {
    slug: 'blog',
    title: 'Małe kroki. Coraz więcej słów.',
    description:
      'Poradniki Językowej Stacji o nauce angielskiego i hiszpańskiego, rozmowie i budowaniu nawyku nauki.',
    eyebrow: 'Na językowej trasie',
    image: 'philosophy.webp',
    sections: [],
    faq: [],
    kind: 'blog',
  },
];
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  sections: Section[];
};
export const posts: Post[] = [
  {
    slug: 'jak-zaczac-nauke-hiszpanskiego',
    title: 'Jak zacząć naukę hiszpańskiego od zera?',
    excerpt:
      'Nie musisz znać setek słów, żeby zrobić pierwszy krok. Zacznij od celu, krótkich zdań i regularnego kontaktu z językiem.',
    image: 'philosophy.webp',
    sections: [
      {
        title: 'Wybierz sytuację, w której chcesz mówić',
        text: 'Zamówienie kawy, przedstawienie się lub krótka rozmowa w podróży — konkretny cel pomaga wybrać pierwsze słowa i zwroty. Zapisz trzy sytuacje, w których chcesz użyć hiszpańskiego.',
      },
      {
        title: 'Ucz się zdań, nie tylko pojedynczych słów',
        text: '„Me llamo…” oznacza „Mam na imię…”, a „Quisiera un café” — „Poproszę kawę”. Powtarzaj całe zdania na głos i zmieniaj ich elementy. Dzięki temu od początku ćwiczysz używanie języka.',
      },
      {
        title: 'Zostaw miejsce na regularność',
        text: 'Wybierz krótką, możliwą do utrzymania rutynę. Przypomnij sobie słownictwo, posłuchaj krótkiego nagrania i ułóż własne zdanie. Regularne powroty pomagają utrwalać materiał.',
      },
      {
        title: 'Próbuj rozmawiać, nawet jeśli popełniasz błędy',
        text: 'Nie czekaj na idealny moment. Na zajęciach z lektorem możesz ćwiczyć rozmowę i zadawać pytania. W Językowej Stacji błędy traktujemy jako część procesu nauki.',
      },
    ],
  },
  {
    slug: 'jak-przelamac-bariere-mowienia-po-angielsku',
    title: 'Jak przełamać barierę mówienia po angielsku?',
    excerpt:
      'Rozumiesz coraz więcej, ale trudno Ci odpowiedzieć? Daj sobie przestrzeń na krótkie wypowiedzi i rozmowy bez presji.',
    image: 'hero.webp',
    sections: [
      {
        title: 'Zacznij od krótkiej odpowiedzi',
        text: 'Nie każda wypowiedź musi być długa. Ćwicz odpowiadanie jednym zdaniem, a następnie dodaj drugi szczegół. Możesz opowiedzieć, jak minął dzień albo co planujesz na weekend.',
      },
      {
        title: 'Przygotuj przydatne zwroty',
        text: '„Could you repeat that?” pomaga poprosić o powtórzenie, a „Let me think” daje chwilę na zebranie myśli. Warto mieć kilka takich zdań, żeby spokojniej reagować w rozmowie.',
      },
      {
        title: 'Zamień ocenianie na ciekawość',
        text: 'Zamiast analizować każdy błąd podczas wypowiedzi, skup się na przekazaniu myśli. Po rozmowie wybierz jeden element, który chcesz poprawić następnym razem.',
      },
      {
        title: 'Wybierz formę zajęć, w której czujesz się dobrze',
        text: 'Lekcje indywidualne dają pełną uwagę lektora. Nauka w parze pozwala ćwiczyć z bliską osobą, a grupa daje możliwość rozmowy z różnymi uczniami. Wybierz przestrzeń, w której łatwiej Ci próbować.',
      },
    ],
  },
];

export const homeFaq = [
  {
    question: 'Których języków mogę się uczyć?',
    answer:
      'Angielskiego i hiszpańskiego online. Do wyboru masz zajęcia indywidualne, w parze lub grupowe.',
  },
  {
    question: 'Czy mogę zacząć od podstaw?',
    answer:
      'Tak. Program i tempo dobieramy do Twojego poziomu, wieku i celu nauki.',
  },
  {
    question: 'Jak wygląda pierwsze spotkanie?',
    answer:
      'To okazja do poznania lektora i porozmawiania o Twoich potrzebach. W demo możesz sprawdzić przykładowy formularz zapisu.',
  },
];
