import { Toaster } from "sonner";
import "@/app/style/global.css";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import styles from "@/app/style/applayout.module.css";
import { Inter, Playfair_Display } from "next/font/google";
import { StoreInitializer } from "@/app/components/StoreInitializer";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const SITE_URL = "https://charismafarms.swiftsyn.com";
const BANNER_URL = "/assets/banner.png";

export const viewport = {
  themeColor: "#3bc24e",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "CharismaFarm – Fresh Organic Farm Products",
    template: "%s | CharismaFarm",
  },

  applicationName: "CharismaFarm",

  description:
    "Shop fresh organic farm products including honey, poultry, vegetables, and goat products. CharismaFarm delivers quality farm-fresh produce directly to your door.",

  authors: [{ name: "CharismaFarm", url: SITE_URL }],
  generator: "Next.js",

  keywords: [
    "CharismaFarm",
    "organic farm",
    "fresh honey",
    "poultry products",
    "organic vegetables",
    "goat products",
    "farm fresh",
    "organic food",
    "healthy eating",
    "farm to table",
    "natural products",
    "sustainable farming",
    "local produce",
    "fresh eggs"
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "CharismaFarm",
    title: "CharismaFarm – Fresh Organic Farm Products",
    description:
      "Discover fresh organic farm products including honey, poultry, vegetables, and goat products.",
    images: [
      {
        url: BANNER_URL,
        width: 1200,
        height: 630,
        alt: "CharismaFarm Organic Products",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CharismaFarm – Fresh Organic Farm Products",
    description: "Shop farm-fresh organic honey, poultry, vegetables, and goat products.",
    images: [BANNER_URL],
    creator: "@charismafarm",
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
  },

  alternates: {
    canonical: `${SITE_URL}`,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CharismaFarm",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  description:
    "CharismaFarm – Your trusted source for fresh organic farm products including honey, poultry, vegetables, and goat products.",
  sameAs: [
    "https://www.facebook.com/charismafarm",
    "https://instagram.com/charismafarm",
    "https://tiktok.com/@charismafarm",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@charismafarm.com",
    contactType: "Customer Support",
    telephone: "+254746033465",
    availableLanguage: "English",
  },

  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "CharismaFarm Product Categories",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Honey",
      },
      {
        "@type": "OfferCatalog",
        name: "Poultry",
      },
      {
        "@type": "OfferCatalog",
        name: "Vegetables",
      },
      {
        "@type": "OfferCatalog",
        name: "Goat Products",
      },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema - Global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Paystack SDK for payment processing */}
        <Script
          id="paystack-js"
          strategy="lazyOnload"
          src="https://js.paystack.co/v1/inline.js"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${inter.className}`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Analytics */}
        <Script
          id="ga-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-', {
                page_path: window.location.pathname,
                custom_map: {
                  'custom_parameter_1': 'farm_category'
                }
              });

              gtag('config', 'G-', {
                'custom_map.category': 'organic_farm'
              });
            `,
          }}
        />

        <Toaster
          position="top-center"
          richColors={true}
          toastOptions={{
            style: {
              background: "#3bc24e",
              color: "#ffffff",
              borderRadius: "15px",
              border: "1px solid #3bc24e",
            },
          }}
        />
        <div className={styles.appLayout}>
          <Navbar />
          <CartDrawer />
          <StoreInitializer>{children}</StoreInitializer>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}
