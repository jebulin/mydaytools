import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://jebulin.github.io/mydaytools';

// Define static routes
const routes = [
  '/',
  '/blog'
];

// Blog posts data (mirrored from src/pages/Blog/BlogList.tsx)
const BLOG_POSTS = [
  { id: 1, date: '2025-11-20' },
  { id: 2, date: '2025-11-22' },
  { id: 3, date: '2025-11-24' }
];

// Add dynamic blog routes
BLOG_POSTS.forEach(post => {
  routes.push(`/blog/${post.id}`);
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

const publicDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!');
