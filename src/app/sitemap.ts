import type {MetadataRoute} from 'next';
import {getPages,getPosts} from '@/lib/cms';
import {absolute} from '@/lib/site';
export const dynamic='force-static';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{return [{url:absolute()},...(await getPages()).map(p=>({url:absolute(p.slug)})),...(await getPosts()).map(p=>({url:absolute('blog/'+p.slug)}))];}
