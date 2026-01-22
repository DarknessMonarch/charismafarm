async function getProductUrls() {
  try {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : (process.env.NEXT_PUBLIC_API_URL || "https://rukihealth.swiftsyn.com");

    const apiUrl = `${baseUrl}/api/products/sitemap`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Failed to fetch products for sitemap: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const products = data.products || [];

    return products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching product URLs for sitemap:", error);
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = "https://rukihealth.swiftsyn.com";

  // Main pages
  const mainRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }
  ];

  // Product Categories
  const categoryRoutes = [
    {
      url: `${baseUrl}/category/supplements`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/herbal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/skincare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category/nutrition`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }
  ];

  // Content Pages
  const contentRoutes = [
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }
  ];

  // Static legal/contact pages
  const staticRoutes = [
    {
      url: `${baseUrl}/page/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/page/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/page/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch dynamic product URLs
  const [productUrls] = await Promise.allSettled([getProductUrls()]);
  const productUrlsResult =
    productUrls.status === "fulfilled" ? productUrls.value : [];

  const allRoutes = [
    ...mainRoutes,
    ...categoryRoutes,
    ...contentRoutes,
    ...staticRoutes,
    ...productUrlsResult,
  ];

  return allRoutes;
}