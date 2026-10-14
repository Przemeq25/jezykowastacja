import { cache } from 'react';
import { pages, posts, formats, audiences, philosophy, homeFaq, type Page, type Post } from './content';
import { defaultSettings } from './site';
const defaults = {...defaultSettings, philosophy, formats, audiences, homeFaq};
export type Settings = typeof defaults;
async function query<T>(groq: string): Promise<T | undefined> {
 const id=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
 if (!id) return undefined;
 if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Invalid Sanity project ID');
 const dataset=process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
 if (!/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Invalid dataset');
 const res=await fetch(`https://${id}.api.sanity.io/v2026-01-01/data/query/${dataset}?query=${encodeURIComponent(groq)}&perspective=published`,{cache:'force-cache',signal:AbortSignal.timeout(20000)});
 if(!res.ok)throw new Error(`Sanity returned ${res.status}. Check project ID and public dataset.`);
 return (await res.json()).result as T;
}
export const getSettings=cache(async ():Promise<Settings> => {
 const remote=await query<Partial<Settings>>('*[_type=="siteSettings" && !(_id in path("drafts.**"))][0]{title,intro,email,phone,philosophy,formats[]{slug,title,text,price},audiences[]{title,text,image},homeFaq[]{question,answer},"heroImage":heroImage.asset->url,"logo":logo.asset->url}');
 return Object.fromEntries(Object.entries({...defaults,...remote}).map(([key,value])=>[key,value || defaults[key as keyof Settings]])) as Settings;
});
export const getPages=cache(async ():Promise<Page[]> => {
 const remote=await query<Page[]>('*[_type=="page" && !(_id in path("drafts.**"))]{"slug":slug.current,title,description,eyebrow,"image":image.asset->url,sections[]{title,text,items},faq[]{question,answer},kind}');
 if(!remote)return pages;
 if(!remote.length){const initialized=await query<number>('count(*[_id=="siteSettings"])');return initialized?[]:pages;}
 const merged=new Map<string,Page>();
 for(const p of remote){if(!p.slug || !/^[a-z0-9-]+$/.test(p.slug))continue;const old=pages.find(seed=>seed.slug===p.slug);merged.set(p.slug,{...old,...p,image:p.image||old?.image||'hero.webp',sections:p.sections||old?.sections||[],faq:p.faq||old?.faq||[]});}
 return [...merged.values()];
});
export const getPosts=cache(async ():Promise<Post[]> => {
 const remote=await query<Post[]>('*[_type=="post" && !(_id in path("drafts.**"))] | order(_createdAt desc){"slug":slug.current,title,excerpt,"image":image.asset->url,sections[]{title,text,items}}');
 if(!remote)return posts;
 if(!remote.length){const initialized=await query<number>('count(*[_id=="siteSettings"])');return initialized?[]:posts;}
 return remote.filter(p=>p.slug && /^[a-z0-9-]+$/.test(p.slug)).map(p=>({...p,image:p.image||'philosophy.webp',sections:p.sections||[]}));
});
