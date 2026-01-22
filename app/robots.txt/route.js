export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow important pages
Allow: /home
Allow: /about
Allow: /categories
Allow: /payment
Allow: /product
Allow: /product/[slug]
Allow: /authentication
Allow: /authentication/[slug]
Allow: /ontact

# Disallow admin and private areas
Disallow: /admin
Disallow: /api
Disallow: /_next
Disallow: /static

# Sitemap location
Sitemap: https://rukihealth.swiftsyn.com/sitemap.xml

# Crawl delay
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}