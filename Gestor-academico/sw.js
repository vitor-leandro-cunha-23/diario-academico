const CACHE_NAME = 'diario-pro-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Se você tiver os ícones salvos na pasta, descomente as linhas abaixo:
  // './icon-192.png',
  // './icon-512.png'
];

// Instalação: Salva os arquivos básicos no cache do dispositivo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto com sucesso');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos se você atualizar a versão (v2, v3...)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação: Busca na rede primeiro; se estiver offline, busca no cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições para o Firebase (a nuvem cuida disso) e extensões do Chrome
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.startsWith('chrome-extension')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});