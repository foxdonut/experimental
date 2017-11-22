self.addEventListener("install", function(evt) {
  console.log("[Service Worker] install", evt);
});

self.addEventListener("activate", function(evt) {
  console.log("[Service Worker] activate", evt);
  return self.clients.claim();
});

self.addEventListener("fetch", function(evt) {
  evt.respondWith(fetch(evt.request));
});

