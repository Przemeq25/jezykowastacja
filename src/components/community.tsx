import Image from 'next/image';
import type {Community} from '@/lib/cms';
import {Eyebrow} from './ui';

export function TeamSection({content}:{content:Community}){
 if(!content.teamVisible||!content.team.length)return null;
 return <section data-reveal id="kadra" className="home-section team-section" aria-labelledby="team-title">
  <div className="section-heading"><div><Eyebrow>{content.teamEyebrow}</Eyebrow><h2 id="team-title">{content.teamTitle}</h2></div><p>{content.teamIntro}</p></div>
  <div className="team-grid">{content.team.map(person=><article key={person._key} className="team-card">
   <div className="team-portrait">{person.photoUrl?<Image src={person.photoUrl} alt={person.photoAlt||person.name} width={700} height={900} sizes="(min-width:1100px) 275px, (min-width:640px) 45vw, 90vw"/>:<span className="team-initials" aria-hidden="true">{person.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span>}</div>
   <div className="team-copy"><p className="team-role">{person.role}</p><h3>{person.name}</h3><p className="team-bio">{person.bio}</p></div>
  </article>)}</div>
 </section>;
}

export function TestimonialsSection({content}:{content:Community}){
 if(!content.testimonialsVisible||!content.testimonials.length)return null;
 return <section data-reveal id="opinie" className="home-section testimonials-section" aria-labelledby="testimonials-title">
  <div className="section-heading"><div><Eyebrow>{content.testimonialsEyebrow}</Eyebrow><h2 id="testimonials-title">{content.testimonialsTitle}</h2></div><p>{content.testimonialsIntro}</p></div>
  <div className={`testimonial-grid ${content.testimonials.length===1?'testimonial-grid--single':''}`}>{content.testimonials.map(item=><figure key={item._key} className="testimonial-card">
   <span className="testimonial-mark" aria-hidden="true">“</span><blockquote><p>{item.quote}</p></blockquote>
   <figcaption><span className="testimonial-avatar" aria-hidden="true">{item.author[0]}</span><span><strong>{item.author}</strong><span className="testimonial-course">{item.course}</span></span>{item.sourceUrl&&/^https:\/\//.test(item.sourceUrl)&&<a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="testimonial-source" aria-label={`Źródło opinii: ${item.author} (nowa karta)`}>Źródło <span aria-hidden="true">↗</span></a>}</figcaption>
  </figure>)}</div>
 </section>;
}
