import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbs('../dist/static/index.html'), 'utf-8');
const { render } = await import('../dist/server/entry-server.js');

// Routes to pre-render
const baseRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/json-master', priority: '0.8', changefreq: 'weekly' },
  { url: '/text-compare', priority: '0.8', changefreq: 'weekly' },
  { url: '/encode-decode', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.7', changefreq: 'daily' },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
  { url: '/terms-of-service', priority: '0.3', changefreq: 'monthly' },
  { url: '/cookie-policy', priority: '0.3', changefreq: 'monthly' },
];

const routesToPrerender = [...baseRoutes];

// Add dynamic blog routes
const blogs = JSON.parse(fs.readFileSync(toAbs('../blogData.json'), 'utf-8'));
blogs.forEach(blog => {
  routesToPrerender.push({
    url: `/blog/${blog.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: blog.date
  });
});

(async () => {
  const sitemapUrls = [];
  const today = new Date().toISOString().split('T')[0];

  for (const route of routesToPrerender) {
    const { url } = route;
    const appHtml = await render(url);

    // Extract tags
    const headTags = appHtml.match(/<(title|meta|link)[^>]*>.*?<\/\1>|<(meta|link)[^>]*>/g) || [];

    // Deduplicate tags
    const uniqueTags = new Map();
    headTags.forEach(tag => {
      let key = tag;
      if (tag.startsWith('<title')) key = 'title';
      else if (tag.includes('name=')) key = tag.match(/name="([^"]+)"/)?.[1];
      else if (tag.includes('property=')) key = tag.match(/property="([^"]+)"/)?.[1];
      else if (tag.includes('rel="canonical"')) key = 'canonical';
      uniqueTags.set(key, tag);
    });

    const headHtml = Array.from(uniqueTags.values()).join('\n    ');

    // Clean up body
    let bodyHtml = appHtml;
    headTags.forEach(tag => {
      bodyHtml = bodyHtml.replace(tag, '');
    });

    const html = template
      .replace(`<!--app-head-->`, headHtml)
      .replace(`<!--app-html-->`, bodyHtml);

    const filePath = `../dist/static${url === '/' ? '/index' : url}.html`;
    const dir = path.dirname(toAbs(filePath));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(toAbs(filePath), html);
    console.log('pre-rendered:', url);

    // Prepare sitemap entry
    sitemapUrls.push(`  <url>
    <loc>https://www.mydaytools.com${url}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
  }

  // Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

  fs.writeFileSync(toAbs('../dist/static/sitemap.xml'), sitemapXml);
  console.log('sitemap.xml generated.');

  console.log('SSG complete.');
})();
