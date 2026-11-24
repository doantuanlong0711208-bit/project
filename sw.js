const CACHE_NAME = "phuot-vn-v7";
const IMAGE_CACHE_NAME = "phuot-vn-images-v1";

// Chỉ pre-cache khung lõi ứng dụng (nhẹ ~450KB thay vì 15MB ảnh nền) để mở tức thì trên 4G yếu
const CORE_SHELL_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/data.js",
  "./js/service-tier.js",
  "./js/map.js",
  "./js/app.js",
  "./manifest.json",
  "./assets/images/logo-emblem.png",
  "./assets/images/logo-app-icon.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_SHELL_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME && k !== IMAGE_CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Ảnh nội bộ: Cache-First lười (chỉ lưu khi người dùng xem tới, tiết kiệm 4G vùng cao)
  if (isSameOrigin && url.pathname.includes("/assets/images/")) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((networkRes) => {
            if (networkRes && networkRes.ok) {
              cache.put(req, networkRes.clone());
            }
            return networkRes;
          });
        })
      )
    );
    return;
  }

  // Khung lõi HTML/CSS/JS: Network-First để luôn nhận bản mới, tự rớt về Cache khi mất sóng
  if (isSameOrigin) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
  }
});
