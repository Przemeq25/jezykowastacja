import { defineField, defineType } from 'sanity';
import defaults from '../src/lib/community.json';

export const communitySchema = [
  defineType({
    name: 'teamMember',
    title: 'Osoba w zespole',
    type: 'object',
    fields: [
      defineField({
        name: 'name',
        title: 'Imię i nazwisko',
        type: 'string',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'role',
        title: 'Język / rola',
        type: 'string',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'bio',
        title: 'Krótki opis',
        type: 'text',
        rows: 4,
        description:
          'Opisy początkowe są propozycją redakcyjną. Możesz je dowolnie dopasować.',
        validation: (r) => r.required().max(500),
      }),
      defineField({
        name: 'photo',
        title: 'Zdjęcie',
        type: 'image',
        options: { hotspot: true },
        description: 'Prześlij nowe zdjęcie, aby zastąpić zdjęcie początkowe.',
      }),
      defineField({
        name: 'photoUrl',
        title: 'Adres zdjęcia początkowego',
        type: 'url',
        description:
          'Zdjęcie z oryginalnej strony. Używane, dopóki nie prześlesz nowego zdjęcia.',
        validation: (r) => r.uri({ scheme: ['https'] }),
      }),
      defineField({
        name: 'photoAlt',
        title: 'Opis zdjęcia dla czytników ekranu',
        type: 'string',
      }),
    ],
    preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
  }),
  defineType({
    name: 'testimonial',
    title: 'Opinia ucznia',
    type: 'object',
    fields: [
      defineField({
        name: 'author',
        title: 'Imię / podpis autora',
        type: 'string',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'course',
        title: 'Zajęcia / kontekst',
        type: 'string',
      }),
      defineField({
        name: 'quote',
        title: 'Treść opinii',
        type: 'text',
        rows: 6,
        description: 'Dodawaj autentyczne opinie, które możesz opublikować.',
        validation: (r) => r.required().max(1500),
      }),
      defineField({
        name: 'sourceUrl',
        title: 'Link do źródła (opcjonalny)',
        type: 'url',
        validation: (r) => r.uri({ scheme: ['https'] }),
      }),
    ],
    preview: { select: { title: 'author', subtitle: 'course' } },
  }),
  defineType({
    name: 'communitySettings',
    title: 'Kadra i opinie',
    type: 'document',
    initialValue: defaults,
    groups: [
      { name: 'team', title: 'Kadra', default: true },
      { name: 'testimonials', title: 'Opinie' },
    ],
    fields: [
      defineField({
        name: 'teamVisible',
        title: 'Pokaż sekcję kadry',
        type: 'boolean',
        group: 'team',
        initialValue: true,
      }),
      defineField({
        name: 'teamEyebrow',
        title: 'Nadtytuł',
        type: 'string',
        group: 'team',
      }),
      defineField({
        name: 'teamTitle',
        title: 'Nagłówek sekcji',
        type: 'string',
        group: 'team',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'teamIntro',
        title: 'Wprowadzenie',
        type: 'text',
        rows: 2,
        group: 'team',
      }),
      defineField({
        name: 'team',
        title: 'Osoby w zespole',
        description: 'Przeciągnij elementy, aby zmienić kolejność na stronie.',
        type: 'array',
        of: [{ type: 'teamMember' }],
        group: 'team',
      }),
      defineField({
        name: 'testimonialsVisible',
        title: 'Pokaż sekcję opinii',
        type: 'boolean',
        group: 'testimonials',
        initialValue: true,
      }),
      defineField({
        name: 'testimonialsEyebrow',
        title: 'Nadtytuł',
        type: 'string',
        group: 'testimonials',
      }),
      defineField({
        name: 'testimonialsTitle',
        title: 'Nagłówek sekcji',
        type: 'string',
        group: 'testimonials',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'testimonialsIntro',
        title: 'Wprowadzenie',
        type: 'text',
        rows: 2,
        group: 'testimonials',
      }),
      defineField({
        name: 'testimonials',
        title: 'Opinie uczniów',
        description: 'Możesz dodawać, usuwać i zmieniać kolejność opinii.',
        type: 'array',
        of: [{ type: 'testimonial' }],
        group: 'testimonials',
      }),
    ],
    preview: {
      prepare: () => ({
        title: 'Kadra i opinie',
        subtitle: 'Zespół oraz głosy uczniów',
      }),
    },
  }),
];
