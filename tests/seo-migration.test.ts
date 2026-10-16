import { describe, expect, it } from 'vitest';
import { buildSeoPatches, homeSeo, type SeoDocument } from '@/lib/seo-content';
import { pageGraph, siteGraph } from '@/lib/seo';
import { defaultSettings } from '@/lib/site';
import {
  pages,
  posts,
  formats,
  audiences,
  philosophy,
  homeFaq,
} from '@/lib/content';
const settings = {
  ...defaultSettings,
  formats,
  audiences,
  philosophy,
  homeFaq,
};
const logo = {
  _type: 'image' as const,
  asset: { _type: 'reference' as const, _ref: 'image-logo-300x300-webp' },
};
const documents: SeoDocument[] = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    _rev: 'settings-revision',
    logo,
  },
  {
    _id: 'page-hiszpanski-online',
    _type: 'page',
    _rev: 'page-revision',
    slug: { current: 'hiszpanski-online' },
  },
];
describe('uzupełnianie SEO w Sanity', () => {
  it('uzupełnia pola, używa logo i po ponowieniu nie proponuje zmian', () => {
    const patches = buildSeoPatches(documents);
    expect(patches[0]).toMatchObject({
      revision: 'settings-revision',
      set: { seoTitle: homeSeo.title, seoImage: logo },
    });
    expect(patches[1]).toMatchObject({
      revision: 'page-revision',
      set: {
        seo: {
          title: expect.stringContaining('Hiszpański online'),
          noIndex: false,
          image: logo,
        },
      },
    });
    const updated = documents.map((doc) => ({
      ...doc,
      ...patches.find((p) => p.id === doc._id)?.set,
    }));
    expect(buildSeoPatches(updated)).toEqual([]);
  });
  it('zachowuje istniejące teksty, noindex i nie publikuje pozostałej zawartości szkiców', () => {
    const draft = {
      ...documents[1],
      _id: 'drafts.page-hiszpanski-online',
      title: 'Nieopublikowany nagłówek',
      seo: { title: 'Własny tytuł', description: '  ', noIndex: true },
    };
    const patch = buildSeoPatches([documents[0], draft])[1];
    expect(patch.id).toBe(draft._id);
    expect(patch.set.seo).toMatchObject({
      title: 'Własny tytuł',
      description: expect.stringContaining('hiszpańskiego online'),
      noIndex: true,
    });
    expect(patch.set).not.toHaveProperty('title');
    expect(patch.set).not.toHaveProperty('sections');
  });
  it('wymaga istniejącego logo zamiast tworzyć puste referencje', () => {
    expect(() => buildSeoPatches([])).toThrow(/logo/);
  });
});
describe('JSON-LD odpowiedni do rodzaju podstrony', () => {
  it('łączy ofertę z usługą i wspólnym identyfikatorem organizacji', () => {
    const page = pages.find((p) => p.slug === 'hiszpanski-online')!;
    const graph = pageGraph(page, settings)['@graph'];
    const service = graph.find((x) => x['@type'] === 'Service')!;
    expect(graph[0].mainEntity).toEqual({ '@id': service['@id'] });
    expect(service).toMatchObject({
      provider: { '@id': expect.stringContaining('#organization') },
      serviceType: 'Nauka języka hiszpańskiego online',
    });
  });
  it('rozróżnia kontakt, opis szkoły i listę prawdziwych wpisów', () => {
    for (const [slug, type] of [
      ['kontakt', 'ContactPage'],
      ['o-nas', 'AboutPage'],
      ['blog', 'CollectionPage'],
    ]) {
      const graph = pageGraph(
        pages.find((p) => p.slug === slug)!,
        settings,
        posts,
      )['@graph'];
      expect(graph[0]['@type']).toBe(type);
      if (slug === 'blog')
        expect(graph.find((x) => x['@type'] === 'ItemList')).toMatchObject({
          numberOfItems: posts.length,
        });
    }
  });
  it('dodaje profil Google i publiczne dane organizacji, bez ocen i fikcyjnego adresu', () => {
    const organization = {
      ...settings.organization,
      name: 'Językowa Stacja',
      email: 'szkola@domena.pl',
      telephone: '+48 123 456 789',
      googleProfileUrl: 'https://share.google/profile',
    };
    const graph = siteGraph({ ...settings, organization })['@graph'][0];
    expect(graph).toMatchObject({
      email: organization.email,
      telephone: organization.telephone,
      logo: { '@type': 'ImageObject' },
    });
    expect(graph).toHaveProperty(
      'sameAs',
      expect.arrayContaining([organization.googleProfileUrl]),
    );
    expect(graph).not.toHaveProperty('address');
    expect(graph).not.toHaveProperty('aggregateRating');
  });
});
