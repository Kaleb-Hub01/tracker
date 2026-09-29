// One Thing offline cache.
// Network first, and deliberately bypasses the browser's own HTTP cache so a
// freshly uploaded index.html is picked up straight away instead of up to ten
// minutes later. The cached copy is only ever used when the network fails.
// Bump CACHE whenever index.html changes.
var CACHE='onething-v33';

self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(['./','./index.html','./icon.png']).catch(function(){});
    })
  );
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k!==CACHE)return caches.delete(k);
      }));
    }).then(function(){return self.clients.claim()})
  );
});

self.addEventListener('message',function(e){
  if(e.data==='skipWaiting')self.skipWaiting();
});

self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  if(new URL(req.url).origin!==self.location.origin)return;

  e.respondWith(
    fetch(req.url,{cache:'no-store'}).then(function(res){
      if(res&&res.status===200){
        var copy=res.clone();
        caches.open(CACHE).then(function(c){c.put(req,copy)});
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){
        return hit || caches.match('./index.html');
      });
    })
  );
});
