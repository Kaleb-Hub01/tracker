// One Thing offline cache.
//
// Same-origin files: network first, bypassing the browser's own HTTP cache so a
// freshly uploaded index.html is picked up straight away. The cached copy is
// only used when the network fails.
//
// Google Fonts: cache first. The stylesheet blocks rendering, so offline it must
// answer immediately rather than hang. If it was never cached we return an empty
// stylesheet and the page falls back to the system font.
//
// Bump CACHE whenever index.html changes.
var CACHE='onething-v77';
var FONT_HOSTS=['fonts.googleapis.com','fonts.gstatic.com'];

self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      // one at a time, so a single failure cannot wipe out the whole precache
      return Promise.all(['./','./index.html','./icon.png'].map(function(u){
        return c.add(new Request(u,{cache:'reload'})).catch(function(){});
      }));
    }).catch(function(){})
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

function putCopy(req,res){
  if(!res||res.status!==200)return res;
  var copy=res.clone();
  caches.open(CACHE).then(function(c){c.put(req,copy)}).catch(function(){});
  return res;
}

self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;

  var url;
  try{ url=new URL(req.url); }catch(err){ return }

  // fonts: cache first, and never leave the page waiting
  if(FONT_HOSTS.indexOf(url.hostname)>-1){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit)return hit;
        return fetch(req).then(function(res){
          if(res&&(res.status===200||res.type==='opaque')){
            var copy=res.clone();
            caches.open(CACHE).then(function(c){c.put(req,copy)}).catch(function(){});
          }
          return res;
        }).catch(function(){
          var css=url.hostname==='fonts.googleapis.com';
          return new Response(css?'/* offline */':'',{
            status:200,
            headers:{'Content-Type':css?'text/css':'font/woff2'}
          });
        });
      })
    );
    return;
  }

  if(url.origin!==self.location.origin)return;

  // page loads: network first, then the cached page, then a plain message
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req.url,{cache:'no-store'}).then(function(res){
        return putCopy(req,res);
      }).catch(function(){
        return caches.match(req,{ignoreSearch:true}).then(function(hit){
          if(hit)return hit;
          return caches.match('./index.html',{ignoreSearch:true}).then(function(hit2){
            if(hit2)return hit2;
            return caches.match('./',{ignoreSearch:true}).then(function(hit3){
              return hit3 || new Response(
                '<!doctype html><meta charset="utf-8"><title>Offline</title>'+
                '<body style="font:16px -apple-system,sans-serif;padding:40px;text-align:center">'+
                '<p>No connection, and no saved copy yet.</p>'+
                '<p>Open this once with signal and it will work offline after that.</p>',
                {status:200,headers:{'Content-Type':'text/html; charset=utf-8'}}
              );
            });
          });
        });
      })
    );
    return;
  }

  e.respondWith(
    fetch(req.url,{cache:'no-store'}).then(function(res){
      return putCopy(req,res);
    }).catch(function(){
      return caches.match(req,{ignoreSearch:true}).then(function(hit){
        return hit || Response.error();
      });
    })
  );
});
