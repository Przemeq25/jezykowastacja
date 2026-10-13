import fs from 'node:fs';import ts from 'typescript';
const source=fs.readFileSync('src/lib/content.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {pages,posts}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const sections=s=>s.map((v,i)=>({...v,_type:'section',_key:'s'+i}));
const docs=[...pages.map(p=>({_id:'page-'+p.slug,_type:'page',...p,slug:{_type:'slug',current:p.slug},image:undefined,sections:sections(p.sections),faq:p.faq.map((v,i)=>({...v,_type:'faq',_key:'f'+i}))})),...posts.map(p=>({_id:'post-'+p.slug,_type:'post',...p,slug:{_type:'slug',current:p.slug},image:undefined,sections:sections(p.sections)})),{_id:'siteSettings',_type:'siteSettings',title:'Język to coś więcej niż słowa.',email:'kontakt@example.com',phone:'+48 000 000 000'}];
fs.writeFileSync('studio/seed.ndjson',docs.map(v=>JSON.stringify(v)).join('\n')+'\n');
console.log(`Prepared ${docs.length} demo documents.`);
