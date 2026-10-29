/* المستجيب: نسخة تعمل بدون إنترنت */
const CACHE='msj-v9';
const FILES=['./','index.html','dashboard.html','app.webmanifest','dash.webmanifest','icon-app-180.png','icon-app-192.png','icon-app-512.png','icon-dash-180.png','icon-dash-192.png','icon-dash-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('script.google.com')||u.hostname.endsWith('googleusercontent.com')) return; // الإرسال والبيانات دائمًا من الشبكة
  const font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!font) return;
  // من النسخة المحفوظة فورًا، ونحدّثها في الخلفية إن وُجد إنترنت
  e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:!font}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  })));
});
