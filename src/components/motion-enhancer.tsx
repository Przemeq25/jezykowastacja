'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/** Progressive enhancement: content remains readable without JS or animations. */
export default function MotionEnhancer(){
 const pathname=usePathname();
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer:IntersectionObserver|undefined;
  const nodes=Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  function stop(){observer?.disconnect();document.documentElement.removeAttribute('data-motion-enabled');nodes.forEach(node=>node.removeAttribute('data-revealed'));}
  function start(){
   stop();
   if(preference.matches||!('IntersectionObserver' in window))return;
   // Keep everything initially visible in the viewport stationary and readable.
   nodes.forEach(node=>{if(node.getBoundingClientRect().top<window.innerHeight)node.dataset.revealed='true';});
   observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){(entry.target as HTMLElement).dataset.revealed='true';observer?.unobserve(entry.target);}}},{threshold:0,rootMargin:'0px 0px -32px 0px'});
   document.documentElement.dataset.motionEnabled='true';
   nodes.filter(node=>node.dataset.revealed!=='true').forEach(node=>observer?.observe(node));
  }
  start();preference.addEventListener('change',start);
  return ()=>{stop();preference.removeEventListener('change',start);};
 },[pathname]);
 return null;
}
