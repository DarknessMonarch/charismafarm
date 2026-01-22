export default function manifest() {
  return {
    name: 'RukiHealth',
    short_name: 'RukiHealth',
    description: 'RukiHealth – Your trusted online shop for health supplements, herbal products, skincare, and wellness essentials.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#37b44c',
    categories: [
      'health',
      'wellness',
      'supplements',
      'nutrition',
      'beauty',
      'herbal',
      'skincare'
    ],

    icons: [
      {
        src: '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/assets/logo.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],

    prefer_related_applications: false,

    lang: 'en',
    dir: 'ltr',

    shortcuts: [
      {
        name: 'Home',
        short_name: 'Home',
        description: 'Browse all health products',
        url: '/',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Supplements',
        short_name: 'Supplements',
        description: 'View supplements & nutrition',
        url: '/category/supplements',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Herbal Products',
        short_name: 'Herbal',
        description: 'View herbal & natural products',
        url: '/category/herbal',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Skincare',
        short_name: 'Skincare',
        description: 'View skincare & beauty items',
        url: '/category/skincare',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Contact customer support',
        url: '/page/contact',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      }
    ],

    screenshots: [
      {
        src: '/assets/banner.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Home Screen'
      }
    ]
  }
}
