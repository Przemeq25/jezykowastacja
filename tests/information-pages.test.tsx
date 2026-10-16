import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  informationPages,
  withInformationPages,
} from '@/lib/information-pages';
import { isIndexablePage } from '@/lib/page-visibility';
import { Faq } from '@/components/ui';
import { pageGraph } from '@/lib/seo';
import { defaultSettings } from '@/lib/site';
import { formats, audiences, philosophy, homeFaq } from '@/lib/content';
import {
  buildInformationDocuments,
  missingInformationPages,
} from '../studio/information-import';
const settings = {
  ...defaultSettings,
  formats,
  audiences,
  philosophy,
  homeFaq,
};
describe('dokumenty informacyjne', () => {
  it('udostępnia trzy strony i daje pierwszeństwo opublikowanej treści CMS', () => {
    const edited = {
      ...informationPages[0],
      title: 'FAQ zmienione w CMS',
      faq: [],
    };
    const pages = withInformationPages([edited]);
    expect(pages).toHaveLength(3);
    expect(pages.find((p) => p.slug === 'faq')).toEqual(edited);
  });
  it('nie indeksuje projektu polityki przed zatwierdzeniem', () => {
    const policy = informationPages.find(
      (p) => p.slug === 'polityka-prywatnosci',
    )!;
    expect(isIndexablePage(policy)).toBe(false);
    expect(isIndexablePage({ ...policy, documentStatus: 'approved' })).toBe(
      true,
    );
    expect(
      isIndexablePage({
        ...policy,
        documentStatus: 'approved',
        seo: { noIndex: true },
      }),
    ).toBe(false);
  });
  it('import zachowuje istniejące dokumenty i szkice, a politykę tworzy wyłącznie jako szkic', () => {
    expect(
      missingInformationPages(['page-faq', 'drafts.page-regulamin']),
    ).toHaveLength(1);
    const docs = buildInformationDocuments([], 'logo-asset', 'pdf-asset');
    expect(docs.map((d) => d._id)).toEqual([
      'page-faq',
      'page-regulamin',
      'drafts.page-polityka-prywatnosci',
    ]);
    expect(docs[1]).toMatchObject({
      attachment: { _type: 'file', asset: { _ref: 'pdf-asset' } },
    });
    expect(
      buildInformationDocuments([
        'page-faq',
        'drafts.page-regulamin',
        'page-polityka-prywatnosci',
      ]),
    ).toEqual([]);
    expect(() => buildInformationDocuments([])).toThrow(/PDF/);
  });
  it('generuje jeden FAQPage z odpowiedziami identycznymi z widoczną treścią', () => {
    const page = informationPages[0];
    const graph = pageGraph(page, settings)['@graph'];
    const faq = graph.find((item) => item['@type'] === 'FAQPage')!;
    expect(faq.mainEntity).toEqual(
      page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    );
    const markup = renderToStaticMarkup(
      <Faq items={page.faq} structured={false} />,
    );
    expect(markup).not.toContain('application/ld+json');
    expect((markup.match(/<summary/g) || []).length).toBe(page.faq.length);
  });
  it('zachowuje oryginalne bajty regulaminu i wszystkie dziewięć rozdziałów', () => {
    const file = readFileSync(
      'public/documents/regulamin-kursow-jezykowych.pdf',
    );
    expect(createHash('sha256').update(file).digest('hex')).toBe(
      '04f88cf996b877ea07355cac8c7ec006c6cbddbafc107c20686413e470c5abef',
    );
    const terms = informationPages.find((p) => p.slug === 'regulamin')!;
    expect(terms.sections).toHaveLength(9);
    expect(terms.sections[0].text).toContain('NIP 5552049202');
    expect(terms.sections[8].text).toContain('Sąd Powszechny w Gdańsku');
  });
});
