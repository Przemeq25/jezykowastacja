// Retired from the public website at the owner's request. Retain CMS history.
export const isEnabledPageSlug = (slug: string) =>
  slug !== 'hiszpanski-mieczaki';

export const isIndexablePage = (page: {
  documentStatus?: string;
  seo?: { noIndex?: boolean };
}) => page.documentStatus !== 'review' && !page.seo?.noIndex;
