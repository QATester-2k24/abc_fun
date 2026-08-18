
const CACHE = "abc-fun-v1";
const ASSETS = [
  "./", "./index.html", "./style.css", "./script.js", "./manifest.json",
  "./images/apple.svg","./images/ball.svg","./images/cat.svg","./images/dog.svg",
  "./images/elephant.svg","./images/fish.svg","./images/giraffe.svg","./images/house.svg",
  "./images/icecream.svg","./images/juice.svg","./images/kite.svg","./images/lion.svg",
  "./images/monkey.svg","./images/nest.svg","./images/orange.svg","./images/penguin.svg",
  "./images/queen.svg","./images/rabbit.svg","./images/sun.svg","./images/tiger.svg",
  "./images/umbrella.svg","./images/van.svg","./images/whale.svg","./images/xylophone.svg",
  "./images/yoyo.svg","./images/zebra.svg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match("./index.html"))));
});
