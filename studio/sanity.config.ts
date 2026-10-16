import { defineConfig, defineType, defineField } from 'sanity';
import { structureTool } from 'sanity/structure';
import { SetupTool } from './setup-tool';
import { communitySchema } from './community-schema';
import { SeoSetupTool } from './seo-setup-tool';
import { seoSchema, siteSeoFields, organizationSchema } from './seo-schema';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'f1yzh257';
if (!projectId) throw new Error('Set SANITY_STUDIO_PROJECT_ID in studio/.env');
const section = defineType({
  name: 'section',
  title: 'Sekcja',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Nagłówek',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'text',
      title: 'Treść',
      type: 'text',
      rows: 6,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'items',
      title: 'Lista punktów',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
const faq = defineType({
  name: 'faq',
  title: 'Pytanie i odpowiedź',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pytanie',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Odpowiedź',
      type: 'text',
      validation: (r) => r.required(),
    }),
  ],
});
const common = [
  defineField({ name: 'seo', title: 'SEO i udostępnianie', type: 'seo' }),
  defineField({
    name: 'title',
    title: 'Tytuł',
    type: 'string',
    validation: (r) => r.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Adres strony',
    type: 'slug',
    options: { source: 'title' },
    validation: (r) => r.required(),
  }),
  defineField({
    name: 'image',
    title: 'Zdjęcie',
    type: 'image',
    options: { hotspot: true },
  }),
  defineField({
    name: 'sections',
    title: 'Sekcje treści',
    type: 'array',
    of: [{ type: 'section' }],
  }),
];
export default defineConfig({
  name: 'default',
  title: 'Językowa Stacja',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'stacja',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Treści strony')
          .items([
            S.listItem()
              .title('Kadra i opinie')
              .child(
                S.document()
                  .schemaType('communitySettings')
                  .documentId('communitySettings'),
              ),
            S.listItem()
              .title('Strona główna i ustawienia')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            ...S.documentTypeListItems().filter(
              (item) =>
                !['siteSettings', 'communitySettings'].includes(
                  item.getId() || '',
                ),
            ),
          ]),
    }),
  ],
  tools: [
    { name: 'setup', title: 'Uruchomienie CMS', component: SetupTool },
    { name: 'seo-setup', title: 'Uzupełnianie SEO', component: SeoSetupTool },
  ],
  document: {
    newDocumentOptions: (options) =>
      options.filter(
        (option) =>
          !['siteSettings', 'communitySettings'].includes(option.templateId),
      ),
    actions: (actions, context) =>
      ['siteSettings', 'communitySettings'].includes(context.schemaType)
        ? actions.filter(
            (action) =>
              !['delete', 'duplicate', 'unpublish'].includes(
                action.action || '',
              ),
          )
        : actions,
  },
  schema: {
    types: [
      ...communitySchema,
      seoSchema,
      organizationSchema,
      section,
      faq,
      defineType({
        name: 'page',
        title: 'Podstrony',
        type: 'document',
        fields: [
          ...common,
          defineField({
            name: 'description',
            title: 'Opis i SEO',
            type: 'text',
            validation: (r) => r.required(),
          }),
          defineField({ name: 'eyebrow', title: 'Nadtytuł', type: 'string' }),
          defineField({
            name: 'faq',
            title: 'FAQ',
            type: 'array',
            of: [{ type: 'faq' }],
          }),
          defineField({
            name: 'kind',
            title: 'Rodzaj strony',
            type: 'string',
            options: {
              list: [
                { title: 'Zwykła podstrona', value: 'standard' },
                { title: 'Zapisy indywidualne', value: 'individual' },
                { title: 'Zapisy grupowe', value: 'group' },
                { title: 'Kontakt', value: 'contact' },
                { title: 'Lista bloga', value: 'blog' },
              ],
            },
          }),
        ],
      }),
      defineType({
        name: 'post',
        title: 'Artykuły bloga',
        type: 'document',
        fields: [
          ...common,
          defineField({
            name: 'excerpt',
            title: 'Zajawka i SEO',
            type: 'text',
            validation: (r) => r.required(),
          }),
        ],
      }),
      defineType({
        name: 'siteSettings',
        title: 'Strona główna i kontakt',
        type: 'document',
        fields: [
          ...siteSeoFields,
          defineField({
            name: 'organization',
            title: 'Organizacja i wizytówka Google',
            type: 'organizationDetails',
          }),
          defineField({
            name: 'title',
            title: 'Główny nagłówek',
            type: 'string',
          }),
          defineField({ name: 'intro', title: 'Wprowadzenie', type: 'text' }),
          defineField({
            name: 'philosophy',
            title: 'Nasze podejście — treść',
            type: 'text',
            rows: 8,
          }),
          defineField({
            name: 'formats',
            title: 'Formy zajęć i ceny',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  { name: 'title', title: 'Nazwa', type: 'string' },
                  {
                    name: 'slug',
                    title: 'Adres podstrony bez ukośników',
                    type: 'string',
                  },
                  { name: 'text', title: 'Opis', type: 'text' },
                  { name: 'price', title: 'Cena (tekst)', type: 'string' },
                ],
              },
            ],
          }),
          defineField({
            name: 'audiences',
            title: 'Dla kogo — kafelki',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  { name: 'title', title: 'Nagłówek', type: 'string' },
                  { name: 'text', title: 'Opis', type: 'text' },
                  { name: 'image', title: 'Nazwa zdjęcia', type: 'string' },
                ],
              },
            ],
          }),
          defineField({
            name: 'homeFaq',
            title: 'Pytania na stronie głównej',
            type: 'array',
            of: [{ type: 'faq' }],
          }),
          defineField({
            name: 'email',
            title: 'E-mail biura',
            type: 'string',
            validation: (r) => r.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
          }),
          defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
          defineField({ name: 'logo', title: 'Logo', type: 'image' }),
          defineField({
            name: 'heroImage',
            title: 'Zdjęcie główne',
            type: 'image',
            options: { hotspot: true },
          }),
        ],
      }),
    ],
  },
});
