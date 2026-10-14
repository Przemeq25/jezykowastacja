import fs from 'node:fs';import ts from 'typescript';
const source=fs.readFileSync('src/lib/content.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {pages,posts,formats,audiences,philosophy,homeFaq}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const sections=s=>s.map((v,i)=>({...v,_type:'section',_key:'s'+i}));
const docs=[...pages.map(p=>({_id:'page-'+p.slug,_type:'page',...p,slug:{_type:'slug',current:p.slug},image:undefined,sections:sections(p.sections),faq:p.faq.map((v,i)=>({...v,_type:'faq',_key:'f'+i}))})),...posts.map(p=>({_id:'post-'+p.slug,_type:'post',...p,slug:{_type:'slug',current:p.slug},image:undefined,sections:sections(p.sections)})),{_id:'siteSettings',_type:'siteSettings',title:'Język to coś więcej niż słowa.',intro:'Pomagamy dzieciom, młodzieży i dorosłym budować pewność siebie w komunikacji po angielsku i hiszpańsku. W spokojnej atmosferze, z pełnym wsparciem i lekcjami dopasowanymi do tego, kim jesteś i czego potrzebujesz.',philosophy,homeFaq:homeFaq.map((v,i)=>({...v,_type:'faq',_key:'faq'+i})),formats:formats.map((v,i)=>({...v,_key:'format'+i,_type:'object'})),audiences:audiences.map((v,i)=>({...v,_key:'audience'+i,_type:'object'})),email:'kontakt@example.com',phone:'+48 000 000 000'}];
fs.writeFileSync('studio/seed.ndjson',docs.map(v=>JSON.stringify(v)).join('\n')+'\n');
console.log(`Prepared ${docs.length} demo documents.`);

fs.writeFileSync('studio/seed.json',JSON.stringify(docs,null,2)+'\n');

fs.writeFileSync('studio/seed-images.json',JSON.stringify(Object.fromEntries([...pages.map(p=>['page-'+p.slug,p.image.replace('.webp','')]),...posts.map(p=>['post-'+p.slug,p.image.replace('.webp','')])]),null,2)+'\n');
