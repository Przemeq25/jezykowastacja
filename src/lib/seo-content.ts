import { defaultSocials, type SocialLink } from './socials';
/** Shared, reviewed copy for the one-time Sanity SEO completion. */
export const homeSeo = {
  title: 'Angielski i hiszpański online | Językowa Stacja',
  description:
    'Ucz się angielskiego i hiszpańskiego online w Językowej Stacji. Lekcje indywidualne, w parze i grupowe dla dzieci, młodzieży i dorosłych.',
};
export const seoCopy: Record<string, { title: string; description: string }> = {
  'hiszpanski-online': {
    title: 'Hiszpański online — nauka i lekcje | Językowa Stacja',
    description:
      'Nauka hiszpańskiego online od podstaw i na kolejnych poziomach. Wybierz lekcje indywidualne, w parze lub grupowe dla dzieci, młodzieży i dorosłych.',
  },
  'angielski-online': {
    title: 'Angielski online — nauka i lekcje | Językowa Stacja',
    description:
      'Nauka angielskiego online dopasowana do Twojego poziomu i celów. Poznaj lekcje indywidualne, w parze i grupowe dla dzieci, młodzieży oraz dorosłych.',
  },
  'lekcje-indywidualne': {
    title: 'Lekcje indywidualne online — angielski i hiszpański',
    description:
      'Indywidualne lekcje angielskiego i hiszpańskiego online. Ucz się we własnym tempie, pracuj nad swoimi celami i korzystaj z pełnej uwagi lektora.',
  },
  'zajecia-w-parze': {
    title: 'Angielski i hiszpański w parze online | Językowa Stacja',
    description:
      'Uczcie się angielskiego lub hiszpańskiego online we dwoje. Zajęcia w parze łączą rozmowę, wzajemną motywację i program dopasowany do Waszych celów.',
  },
  'kursy-grupowe': {
    title: 'Kursy grupowe online — angielski i hiszpański',
    description:
      'Poznaj grupowe kursy angielskiego i hiszpańskiego online. Rozwijaj swobodę rozmowy, ucz się z innymi i sprawdź aktualne grupy w formularzu zapisów.',
  },
  'lekcja-probna': {
    title: 'Lekcja próbna online — angielski i hiszpański',
    description:
      'Zacznij naukę angielskiego lub hiszpańskiego online od pierwszego spotkania. Poznaj sposób pracy Językowej Stacji i zapytaj o dostępne terminy.',
  },
  'hiszpanski-mieczaki': {
    title: 'Hiszpański i Mięczaki — nauka online | Językowa Stacja',
    description:
      'Znasz hiszpański z kanału Mięczaki na YouTube? Poznaj Językową Stację i zrób kolejny krok w nauce hiszpańskiego online z lektorem.',
  },
  'o-nas': {
    title: 'O nas i kadrze — szkoła językowa online | Językowa Stacja',
    description:
      'Poznaj Językową Stację i lektorów angielskiego oraz hiszpańskiego. Uczymy online dzieci, młodzież i dorosłych, z uważnością na potrzeby każdej osoby.',
  },
  kontakt: {
    title: 'Kontakt i zapisy na lekcje online | Językowa Stacja',
    description:
      'Skontaktuj się z Językową Stacją. Zapytaj o naukę angielskiego i hiszpańskiego online, lekcję próbną, kursy grupowe oraz dostępne terminy zajęć.',
  },
  blog: {
    title: 'Blog — nauka angielskiego i hiszpańskiego | Językowa Stacja',
    description:
      'Jak uczyć się angielskiego i hiszpańskiego? Czytaj poradniki Językowej Stacji o nauce od podstaw, przełamywaniu bariery mówienia i regularności.',
  },
  'jak-zaczac-nauke-hiszpanskiego': {
    title: 'Jak zacząć naukę hiszpańskiego od zera? | Językowa Stacja',
    description:
      'Chcesz zacząć naukę hiszpańskiego od zera? Sprawdź, jak wyznaczyć cel, ćwiczyć pierwsze zdania i zbudować regularny kontakt z językiem.',
  },
  'jak-przelamac-bariere-mowienia-po-angielsku': {
    title: 'Jak przełamać barierę mówienia po angielsku?',
    description:
      'Rozumiesz angielski, ale trudno Ci mówić? Poznaj proste sposoby na ćwiczenie krótkich wypowiedzi, rozmowę bez presji i budowanie pewności siebie.',
  },
};

// Verified in the school's own website, including its link to the Google profile.
// No unverified street address, hours, ratings or legal identifiers are inserted.
export const organizationDefaults = {
  name: 'Językowa Stacja',
  url: 'https://jezykowastacja.pl/',
  description: homeSeo.description,
  googleProfileUrl: 'https://share.google/9BTeBcVja2YvKl6vM',
  email: 'jezykowastacja@gmail.com',
  telephone: '+48 881 774 936',
};

type ImageReference = {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
};
export type SeoDocument = {
  _id: string;
  _rev: string;
  _type: string;
  title?: string;
  description?: string;
  excerpt?: string;
  slug?: { current?: string };
  seo?: {
    _type?: string;
    title?: string;
    description?: string;
    image?: ImageReference;
    noIndex?: boolean;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: ImageReference;
  logo?: ImageReference;
  organization?: Partial<typeof organizationDefaults>;
  socialLinks?: SocialLink[];
  socialTitle?: string;
  socialIntro?: string;
};
export type SeoPatch = {
  id: string;
  revision: string;
  set: Record<string, unknown>;
};
const blank = (value?: string) => !value?.trim();
export function buildSeoPatches(documents: SeoDocument[]): SeoPatch[] {
  const settings = documents.find((d) => d._id === 'siteSettings');
  if (!settings?.logo?.asset?._ref)
    throw new Error('Najpierw dodaj i opublikuj logo w ustawieniach strony.');
  const logo: ImageReference = {
    _type: 'image',
    asset: { _type: 'reference', _ref: settings.logo.asset._ref },
  };
  const patches: SeoPatch[] = [];
  for (const doc of documents) {
    const set: Record<string, unknown> = {};
    if (doc._type === 'siteSettings') {
      if (!doc.socialLinks?.length)
        set.socialLinks = defaultSocials.map((link, index) => ({
          ...link,
          _key: `social-${index}`,
        }));
      if (blank(doc.socialTitle))
        set.socialTitle = 'Język żyje też między lekcjami.';
      if (blank(doc.socialIntro))
        set.socialIntro =
          'Krótkie inspiracje, przydatne zwroty i codzienność naszej stacji. Spotkajmy się także tutaj.';
      if (blank(doc.seoTitle)) set.seoTitle = homeSeo.title;
      if (blank(doc.seoDescription)) set.seoDescription = homeSeo.description;
      if (doc.seoImage?.asset?._ref !== logo.asset._ref) set.seoImage = logo;
      const organization = { ...doc.organization };
      for (const [key, value] of Object.entries(organizationDefaults)) {
        if (blank(organization[key as keyof typeof organization]))
          Object.assign(organization, { [key]: value });
      }
      if (JSON.stringify(organization) !== JSON.stringify(doc.organization))
        set.organization = { _type: 'organizationDetails', ...organization };
    } else if (['page', 'post'].includes(doc._type)) {
      const copy = seoCopy[doc.slug?.current || ''];
      const seo = { ...doc.seo, _type: 'seo' };
      if (blank(seo.title)) seo.title = copy?.title || doc.title;
      if (blank(seo.description))
        seo.description = copy?.description || doc.description || doc.excerpt;
      if (seo.noIndex == null) seo.noIndex = false;
      // Logo is an explicit owner choice, including pages with an existing OG image.
      if (seo.image?.asset?._ref !== logo.asset._ref) seo.image = logo;
      if (JSON.stringify(seo) !== JSON.stringify(doc.seo)) set.seo = seo;
    }
    if (Object.keys(set).length)
      patches.push({ id: doc._id, revision: doc._rev, set });
  }
  return patches;
}
