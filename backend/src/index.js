const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { apiReference } = require('@scalar/express-api-reference');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const routesDir = path.join(__dirname, 'routes');
const dynamicPaths = {};

// Fungsi internal untuk membaca semua path & method langsung dari dalam Router Express
function extractRouterPaths(router, prefix) {
    if (!router.stack) return;
    
    router.stack.forEach((layer) => {
        if (layer.route) {
            const subPath = layer.route.path;
            // Gabungkan prefix route utama dengan sub-path (misal: /api/alat + /read)
            let fullPath = prefix + (subPath === '/' ? '' : subPath);
            fullPath = fullPath.replace(/\/+/g, '/'); // Bersihkan dobel slash

            // Ambil semua method yang aktif (GET, POST, PUT, DELETE, dll)
            const methods = Object.keys(layer.route.methods).filter(m => layer.route.methods[m]);

            if (!dynamicPaths[fullPath]) {
                dynamicPaths[fullPath] = {};
            }

            methods.forEach((method) => {
                const lowerMethod = method.toLowerCase();
                const tagName = prefix.split('/')[2] ? prefix.split('/')[2].toUpperCase() : 'GENERAL';

                dynamicPaths[fullPath][lowerMethod] = {
                    summary: `${method.toUpperCase()} ${fullPath}`,
                    tags: [tagName],
                };
            });
        }
    });
}

// 1. Scan folder routes/ secara otomatis, daftarkan ke Express, sekaligus ekstrak method-nya!
fs.readdirSync(routesDir).forEach((file) => {
    if (file.endsWith('.js')) {
        const routeName = file.replace('Route.js', '').replace('.js', '');
        const routePath = `/api/${routeName}`;
        const routerInstance = require(path.join(routesDir, file));

        // Daftarkan rute ke Express
        app.use(routePath, routerInstance);

        // Ekstrak otomatis semua endpoint di dalam file route tersebut (termasuk /read, /:id, dll)
        extractRouterPaths(routerInstance, routePath);
    }
});

// 2. Dokumentasi Scalar dengan data yang otomatis terisi penuh
app.use(
    '/reference',
    apiReference({
        spec: {
            content: {
                openapi: '3.0.0',
                info: {
                    title: 'API Dokumentasi Otomatis 100%',
                    version: '1.0.0',
                    description: 'Membaca rute dan method secara otomatis langsung dari file backend.',
                },
                servers: [{ url: 'http://localhost:5000' }],
                paths: dynamicPaths,
            },
        },
    })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Dokumentasi otomatis aktif di http://localhost:${PORT}/reference`);
});