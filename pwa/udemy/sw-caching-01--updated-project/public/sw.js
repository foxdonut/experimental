var CACHE_NAME_STATIC = 'static-v0002';
var CACHE_NAME_DYNAMIC = 'dynamic';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      /*
      cache.add('/');
      cache.add('/index.html');
      cache.add('/src/js/app.js');
      */
      cache.addAll([
        '/',
        '/index.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        /*
        Not worth caching these files, because they are only needed by older browsers,
        and older browsers don't support service workers anyway!
        '/src/js/promise.js',
        '/src/js/fetch.js',
        */
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC) {
          console.log('[Service Worker] deleting cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(function(resp) {
        return caches.open(CACHE_NAME_DYNAMIC).then(function(cache) {
          cache.put(event.request.url, resp.clone()); // can only consume resp once; clone it so that we can return it
          return resp;
        });
      })
      .catch(function(err) {
        console.log("caught error");
      });
    })
  );
});

