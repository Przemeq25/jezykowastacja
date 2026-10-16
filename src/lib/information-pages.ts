import content from './information-pages.json';
import type { Page } from './content';

/** Required information pages remain available before the authenticated import. */
export const informationPages = content as Page[];
export function withInformationPages(pages: Page[]): Page[] {
  const merged = new Map(informationPages.map((page) => [page.slug, page]));
  for (const page of pages) merged.set(page.slug, page);
  return [...merged.values()];
}
