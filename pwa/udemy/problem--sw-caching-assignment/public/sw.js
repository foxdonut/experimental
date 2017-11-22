var CACHE_NAME = 'caching_assigment';

self.addEventListener("install", function(evt) {
  console.log("SW installed");

  evt.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/src/css/app.css",
        "/src/css/main.css",
        "/src/js/main.js",
        "/src/js/material.min.js"
      ]);
    })
  );
});

self.addEventListener("activate", function(evt) {
  console.log("SW activated");

  evt.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] deleting cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function(evt) {
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(evt.request).then(function(resp) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(evt.request.url, resp.clone()); // can only consume resp once; clone it so that we can return it
          return resp;
        });
      })
      .catch(function(err) {
        console.log("caught error");
      });
    })
  );
});

