
self.addEventListener('install', function(event) {
    var CACHE_DYNAMIC_NAME = 'CACHE-GSM';
    event.waitUntil(
      caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
        return cache.addAll(
          [
            'index.html',
            'assets',
            'main.*.js',
            'polyfills.*.js',
            'runtime.*.js',
            'scripts.*.js'
          ]
        );
      })
    );
  });

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            console.log("respondWith" + response);
            return response;     // if valid response is found in cache return it
          } else {
            console.log("else respondWith" + event.request);
            return fetch(event.request)     //fetch from internet
              .then(function(res) {
                console.log("addEventListener" + res);
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());    //save the response for future
                    return res;   // return the fetched data
                  })
              })
              .catch(function(err) {       // fallback mechanism
                return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                  .then(function(cache) {
                    return cache.match('index.html');
                  });
              });
          }
        })
    );
  });
