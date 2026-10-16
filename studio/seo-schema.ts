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
      description: 'Rekomendowane proporcje 1200 × 630 px.',
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
      '1200 × 630 px. Używany też na podstronach bez własnego obrazu OG.',
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
