self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

// Mencegat request dari menu Share
self.addEventListener('fetch', event => {
    if (event.request.method === 'POST') {
        // Arahkan kembali ke halaman utama karena GitHub tidak bisa menerima POST
        event.respondWith(Response.redirect('./index.html'));
        
        event.waitUntil(async function() {
            const formData = await event.request.formData();
            const file = formData.get('image'); // Harus sama dengan "name" di manifest.json
            
            // Tunggu 1 detik agar HTML selesai dimuat, lalu kirim foto ke halaman HTML
            setTimeout(async () => {
                const clients = await self.clients.matchAll({ type: 'window' });
                for (const client of clients) {
                    client.postMessage({ file: file });
                }
            }, 1000);
        }());
    }
});