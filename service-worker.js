const CACHE_NAME = 'golden-stars-v3.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/audio-guide.js',
  'https://unpkg.com/maplibre-gl@3.6.0/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@3.6.0/dist/maplibre-gl.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  // Заглушки для изображений героев (замените на реальные из книги)
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+1',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+2',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+3',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+4',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+5',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+6',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+7',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+8',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+9',
  'https://via.placeholder.com/400x300/FFD700/0a0e17?text=Герой+10'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование файлов приложения');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  // Пропускаем запросы к MapLibre
  if (event.request.url.includes('maplibre')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ответ, если он есть
        if (response) {
          return response;
        }

        // Делаем сетевой запрос
        return fetch(event.request)
          .then(response => {
            // Проверяем, является ли ответ валидным
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ
            const responseToCache = response.clone();

            // Добавляем в кэш
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Если сеть недоступна и нет кэша, показываем fallback
            return caches.match('/index.html');
          });
      })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', event => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});