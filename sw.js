/* 浠婂ぉ鍚冧粈涔?路 Service Worker
   绛栫暐锛氱綉缁滀紭鍏堬紝澶辫触鏃跺洖閫€缂撳瓨 鈥斺€?杩欐牱鏃㈣兘绂荤嚎鐢紝鍙堜笉浼氬崱浣忔棫鐗堟湰 */
const CACHE = 'eat-what-v0.9.1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((r) => r || caches.match('./index.html') || caches.match('./'))
      )
  );
});
