import {useState} from 'react';
import {useClient} from 'sanity';
import seed from './seed.json';
import seedImages from './seed-images.json';

export function SetupTool(){
 const client=useClient({apiVersion:'2026-01-01'});
 const [status,setStatus]=useState('');
 const [busy,setBusy]=useState(false);
 async function initialize(){
  setBusy(true);setStatus('Sprawdzam zawartość datasetu…');
  try{
   const count=await client.fetch<number>('count(*[!(_id in path("drafts.**")) && _type in ["siteSettings","page","post"]])');
   if(count>0){setStatus('Treści już istnieją. Import zatrzymany, aby zachować Twoje zmiany. Otwórz zakładkę Treści strony.');return;}
   const assets:Record<string,string>={};
   for(const name of ['hero','logo','philosophy','founder','children','teens','adults']){
    setStatus(`Wczytuję zdjęcie: ${name}…`);
    const response=await fetch(`https://przemeq25.github.io/jezykowastacja/images/${name}.webp`);
    if(!response.ok)throw new Error(`Nie udało się pobrać zdjęcia ${name}`);
    const asset=await client.assets.upload('image',await response.blob(),{filename:`${name}.webp`});assets[name]=asset._id;
   }
   const image=(name:string)=>({_type:'image',asset:{_type:'reference',_ref:assets[name]}});
   let transaction=client.transaction();
   for(const document of seed){
    const doc:Record<string,unknown>={...document};
    if(doc._type==='siteSettings'){
     doc.heroImage=image('hero');doc.logo=image('logo');
     doc.intro='Pomagamy dzieciom, młodzieży i dorosłym budować pewność siebie w komunikacji po angielsku i hiszpańsku. W spokojnej atmosferze, z pełnym wsparciem i lekcjami dopasowanymi do tego, kim jesteś i czego potrzebujesz.';
    }else doc.image=image(seedImages[doc._id as keyof typeof seedImages]||'hero');
    transaction=transaction.createIfNotExists(doc as {_id:string;_type:string});
   }
   setStatus('Zapisuję treści demo…');await transaction.commit();
   setStatus('Gotowe. Otwórz Treści strony i edytuj zawartość. Publikuj zmiany przyciskiem Publish.');
  }catch(error){setStatus(`Import nie powiódł się: ${error instanceof Error?error.message:'nieznany błąd'}. Sprawdź uprawnienia edytora i CORS w Sanity Manage.`);}
  finally{setBusy(false);}
 }
 return <div style={{maxWidth:760,margin:'40px auto',padding:28,lineHeight:1.7}}>
  <h1>Językowa Stacja — edycja zawartości</h1>
  <p>W zakładce Treści strony możesz edytować stronę główną, ofertę, zdjęcia, FAQ oraz artykuły bloga. Szkice widzisz tylko w panelu. Strona pobiera opublikowane treści.</p>
  <h2>Pierwsze uruchomienie</h2>
  <p>Poniższy przycisk wczyta obecne treści i zdjęcia demo do pustego datasetu. Nie zastępuje istniejących dokumentów. Formularze na stronie pozostają testowe.</p>
  <button onClick={initialize} disabled={busy} style={{padding:'12px 20px',cursor:busy?'wait':'pointer'}}>Wczytaj treści demo</button>
  <p role="status" aria-live="polite">{status}</p>
  <h2>Kadra i opinie</h2>
  <p>Otwórz „Kadra i opinie” w zakładce Treści strony. Nowy dokument zawiera już cztery osoby, opisy do dopasowania i fragment opinii z poprzedniej strony. Możesz zmienić zdjęcia, kolejność oraz dodawać kolejne autentyczne opinie. Przy pierwszej edycji zapisz dokument przyciskiem Publish.</p>
  <h2>Publikowanie zmian</h2>
  <p>Po kliknięciu Publish strona odświeży się przy kolejnym buildzie GitHub Pages. Automatyczny build uruchamia się co godzinę. Możesz też uruchomić go ręcznie:</p>
  <a href="https://github.com/Przemeq25/jezykowastacja/actions/workflows/pages.yml" target="_blank" rel="noreferrer">GitHub Actions → Run workflow</a>
 </div>;
}
