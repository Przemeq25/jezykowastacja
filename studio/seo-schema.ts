import { defineType, defineField } from 'sanity';
import { defaultSocials } from '../src/lib/socials';
export const seoSchema = defineType({
  name: 'seo',
  title: 'SEO i udostępnianie',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł w wyszukiwarkach',
      type: 'string',
      validation: (r) =>
        r.max(90).warning('Warto użyć krótszego, konkretnego tytułu.'),
    }),
    defineField({
      name: 'description',
      title: 'Opis w wyszukiwarkach',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Obraz do udostępniania (OG)',
      type: 'image',
      description:
        'Obecnie używamy logo szkoły. Możesz zastąpić je własną grafiką OG.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Ukryj tę podstronę przed indeksowaniem',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
export const siteSeoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO — tytuł strony głównej',
    type: 'string',
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO — opis strony głównej',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'seoImage',
    title: 'SEO — domyślny obraz OG',
    type: 'image',
    description:
      'Domyślnie logo szkoły; używany też na podstronach bez własnego obrazu OG.',
  }),
  defineField({
    name: 'socialLinks',
    title: 'Profile społecznościowe',
    type: 'array',
    initialValue: defaultSocials,
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'platform',
            title: 'Platforma',
            type: 'string',
            options: {
              list: [
                { title: 'Instagram', value: 'instagram' },
                { title: 'TikTok', value: 'tiktok' },
                { title: 'Facebook', value: 'facebook' },
              ],
            },
            validation: (r) => r.required(),
          },
          {
            name: 'label',
            title: 'Nazwa linku',
            type: 'string',
            validation: (r) => r.required(),
          },
          {
            name: 'url',
            title: 'Adres profilu',
            type: 'url',
            validation: (r) => r.required().uri({ scheme: ['https'] }),
          },
        ],
        preview: { select: { title: 'label', subtitle: 'url' } },
      },
    ],
  }),
  defineField({
    name: 'socialTitle',
    title: 'Social media — nagłówek sekcji',
    type: 'string',
  }),
  defineField({
    name: 'socialIntro',
    title: 'Social media — opis sekcji',
    type: 'text',
    rows: 3,
  }),
];

export const organizationSchema = defineType({
  name: 'organizationDetails',
  title: 'Organizacja — dane do JSON-LD',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Nazwa szkoły', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Opis organizacji',
      type: 'text',
    }),
    defineField({
      name: 'url',
      title: 'Oficjalna witryna szkoły',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'googleProfileUrl',
      title: 'Link do wizytówki Google',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'email',
      title: 'Publiczny e-mail szkoły',
      type: 'string',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'telephone',
      title: 'Publiczny telefon szkoły',
      type: 'string',
    }),
  ],
});
