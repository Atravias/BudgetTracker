const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/styles.css',
    '/js/index.js',
    '/js/database.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

const PRECACHE = "precache-v1";
const DATA_CACHE_NAME = "data-cache-v2";


self.addEventListener("install", event => {
    console.log("SW: INSTALL")
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(self.skipWaiting())
    )
})


// fetch
self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(function () {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    );
}); 