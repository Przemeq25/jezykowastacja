import { informationPages } from '../src/lib/information-pages';

export const informationIds = informationPages.map(
  (page) => `page-${page.slug}`,
);
export function missingInformationPages(existing: string[]) {
  return informationPages.filter(
    (page) =>
      !existing.includes(`page-${page.slug}`) &&
      !existing.includes(`drafts.page-${page.slug}`),
  );
}
export function buildInformationDocuments(
  existing: string[],
  logoAssetId?: string,
  pdfAssetId?: string,
) {
  const image = logoAssetId
    ? { _type: 'image', asset: { _type: 'reference', _ref: logoAssetId } }
    : undefined;
  return missingInformationPages(existing).map((page) => {
    if (page.attachment && !pdfAssetId)
      throw new Error('Brakuje przesłanego PDF regulaminu.');
    return {
      _id: `${page.documentStatus === 'review' ? 'drafts.' : ''}page-${page.slug}`,
      _type: 'page',
      title: page.title,
      description: page.description,
      eyebrow: page.eyebrow,
      slug: { _type: 'slug', current: page.slug },
      kind: page.kind,
      documentStatus: page.documentStatus,
      sourceUrl: page.sourceUrl,
      sourceNote: page.sourceNote,
      ...(image ? { image } : {}),
      seo: { ...page.seo, _type: 'seo', ...(image ? { image } : {}) },
      sections: page.sections.map((section, index) => ({
        ...section,
        _key: `section-${index}`,
        _type: 'section',
      })),
      faq: page.faq.map((item, index) => ({
        ...item,
        _key: `faq-${index}`,
        _type: 'faq',
      })),
      ...(page.attachment
        ? {
            attachment: {
              _type: 'file',
              asset: { _type: 'reference', _ref: pdfAssetId },
            },
          }
        : {}),
    };
  });
}
