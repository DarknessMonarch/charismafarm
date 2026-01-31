"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import { useCategoryStore } from "@/app/store/categoryStore";
import { useTestimonialStore } from "@/app/store/testimonialStore";
import { useBlogStore } from "@/app/store/blogStore";
import styles from "@/app/style/home.module.css";
import { toast } from "sonner";

import { BiSupport as SupportIcon } from "react-icons/bi";
import { FaShippingFast as ShippingIcon } from "react-icons/fa";
import { PiPlantFill as OrganicIcon } from "react-icons/pi";
import { RiSecurePaymentLine as ShieldIcon } from "react-icons/ri";
import { MdStar as StarIcon, MdStarHalf as StarHalfIcon } from "react-icons/md";
import { FiShoppingCart as CartIcon, FiEye as EyeIcon } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useCartStore } from "@/app/store/Cart";
import QuickViewModal from "@/app/components/QuickViewModal";

// Local image assets - Add your images to /public/assets/images/
const IMAGES = {
  // Hero section - add hero.jpg to /public/assets/images/
  hero: "/assets/images/hero.jpg",

  // Category default images - add to /public/assets/images/categories/
  honey: "/assets/images/categories/honey.jpg",
  poultry: "/assets/images/categories/poultry.jpg",
  vegetables: "/assets/images/categories/vegetables.jpg",
  goat: "/assets/images/categories/goat.jpg",
  dairy: "/assets/images/categories/dairy.jpg",

  // Promo banners - add to /public/assets/images/banners/
  promoBanner1: "/assets/images/banners/promo-honey.jpg",
  promoBanner2: "/assets/images/banners/promo-vegetables.jpg",
  promoBanner3: "/assets/images/banners/promo-poultry.jpg",

  // Healthy life section - add to /public/assets/images/
  healthyLife: "/assets/images/healthy-life.jpg",

  // Summer sale banner - add to /public/assets/images/banners/
  saleBanner: "/assets/images/banners/sale-banner.jpg",

  // Blog default images - populated from server via dashboard
  blog1: "/assets/images/blog/blog-placeholder.jpg",
  blog2: "/assets/images/blog/blog-placeholder.jpg",
  blog3: "/assets/images/blog/blog-placeholder.jpg",

  // Default testimonial avatar - populated from server via dashboard
  avatar: "/assets/images/avatar-placeholder.jpg",

  // Default product image
  defaultProduct: "/assets/images/product-placeholder.jpg",

  // Decorative elements
  leafPattern: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%234CAF50' d='M50,20 C60,10 80,15 80,30 C80,45 60,55 50,70 C40,55 20,45 20,30 C20,15 40,10 50,20 Z'/%3E%3C/svg%3E",
};

// Fallback function for broken images
const handleImageError = (e, fallbackSrc) => {
  e.target.src = fallbackSrc;
  e.target.onerror = null; // Prevent infinite loop
};

// Create a custom Image component with fallback
const FallbackImage = ({ src, fallbackSrc, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setImgSrc(IMAGES.defaultProduct);
        }
      }}
    />
  );
};

// Default categories when none from server
const DEFAULT_CATEGORIES = [
  { _id: "honey", name: "Honey", slug: "honey", image: IMAGES.honey },
  { _id: "poultry", name: "Poultry", slug: "poultry", image: IMAGES.poultry },
  { _id: "vegetables", name: "Vegetables", slug: "vegetables", image: IMAGES.vegetables },
  { _id: "goat", name: "Goat Products", slug: "goat", image: IMAGES.goat },
  { _id: "dairy", name: "Dairy", slug: "dairy", image: IMAGES.dairy },
];

// Default testimonials - populated from server via dashboard
const DEFAULT_TESTIMONIALS = [
  {
    _id: "1",
    name: "Mary Wanjiku",
    role: "Regular Customer",
    comment: "CharismaFarm delivers the freshest vegetables I've ever bought. The quality is exceptional and their delivery is always on time. I highly recommend them to anyone looking for organic produce!",
    rating: 5,
    image: IMAGES.avatar,
  },
  {
    _id: "2",
    name: "John Kamau",
    role: "Home Chef",
    comment: "The honey from CharismaFarm is pure and delicious. You can taste the difference from store-bought products. My family loves it!",
    rating: 5,
    image: IMAGES.avatar,
  },
  {
    _id: "3",
    name: "Grace Muthoni",
    role: "Health Enthusiast",
    comment: "I've been ordering eggs and vegetables from CharismaFarm for months. Everything is fresh, organic, and fairly priced. Great customer service too!",
    rating: 5,
    image: IMAGES.avatar,
  },
];

// Default blog posts
const DEFAULT_BLOGS = [
  {
    _id: "1",
    title: "Benefits of Organic Honey",
    slug: "benefits-of-organic-honey",
    excerpt: "Discover the amazing health benefits of pure organic honey and why it's nature's perfect sweetener.",
    image: IMAGES.blog1,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Farm Fresh Vegetables Guide",
    slug: "farm-fresh-vegetables-guide",
    excerpt: "Learn how to select, store, and prepare farm-fresh vegetables for maximum nutrition and flavor.",
    image: IMAGES.blog2,
    publishedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Why Choose Free-Range Eggs",
    slug: "why-choose-free-range-eggs",
    excerpt: "Understanding the difference between free-range and commercial eggs, and why quality matters.",
    image: IMAGES.blog3,
    publishedAt: new Date().toISOString(),
  },
];

export default function Home() {
  const router = useRouter();
  const { products, getAllProducts, addToCart, isAuth, emailVerified } = useEcommerceStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { testimonials, fetchTestimonials } = useTestimonialStore();
  const { blogs, fetchBlogs } = useBlogStore();
  const { openDrawer } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const Features = [
    { id: 1, icon: ShippingIcon, title: "Free Delivery", description: "Free shipping on orders over Ksh 5000" },
    { id: 2, icon: OrganicIcon, title: "100% Organic", description: "All products are naturally grown" },
    { id: 3, icon: ShieldIcon, title: "Secure Payments", description: "Guaranteed secure checkout" },
    { id: 4, icon: SupportIcon, title: "24/7 Support", description: "Customer support anytime" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getAllProducts({ limit: 12, sort: "newest" }),
          fetchCategories(),
          fetchTestimonials(),
          fetchBlogs(1, 3),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (e, product, quantity = 1) => {
    if (e) e.stopPropagation();
    if (!isAuth || !emailVerified) {
      toast.error("Please login to add items to cart");
      router.push("/authentication/login");
      return;
    }
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success("Added to cart");
      openDrawer();
    } else {
      toast.error(result.message);
    }
  };

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const handleQuickViewAddToCart = async (product, quantity) => {
    await handleAddToCart(null, product, quantity);
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  const handleCategoryClick = (category) => {
    router.push(`/products?category=${category.slug}`);
  };

  const filteredProducts = () => {
    if (!products || products.length === 0) return [];
    if (activeTab === "featured") return products.slice(0, 8);
    if (activeTab === "latest") return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
    if (activeTab === "bestSeller") return [...products].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0)).slice(0, 8);
    return products.slice(0, 8);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} className={styles.starFilled} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" className={styles.starFilled} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className={styles.starEmpty} />);
    }
    return stars;
  };

  // Use server data or fallback to defaults
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const displayBlogs = blogs.length > 0 ? blogs : DEFAULT_BLOGS;

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  const visibleCategories = displayCategories.slice(categoryIndex, categoryIndex + 5);

  const nextCategory = () => {
    if (categoryIndex + 5 < displayCategories.length) {
      setCategoryIndex((prev) => prev + 1);
    }
  };

  const prevCategory = () => {
    if (categoryIndex > 0) {
      setCategoryIndex((prev) => prev - 1);
    }
  };

  // Get category image with fallback
  const getCategoryImage = (category) => {
    if (category.image) return category.image;
    const slug = category.slug?.toLowerCase() || category.name?.toLowerCase();
    if (slug?.includes("honey")) return IMAGES.honey;
    if (slug?.includes("poultry") || slug?.includes("egg") || slug?.includes("chicken")) return IMAGES.poultry;
    if (slug?.includes("vegetable")) return IMAGES.vegetables;
    if (slug?.includes("goat")) return IMAGES.goat;
    if (slug?.includes("dairy") || slug?.includes("milk")) return IMAGES.dairy;
    return IMAGES.defaultProduct;
  };

  // Handle image errors
  const handleImgError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Get image source with fallback
  const getImageSrc = (originalSrc, fallbackKey) => {
    if (!originalSrc || imageErrors[originalSrc]) {
      return IMAGES[fallbackKey] || IMAGES.defaultProduct;
    }
    return originalSrc;
  };

  return (
    <main className={styles.homeContainer}>
      {/* Hero Section - Remove decorative leaves or use CSS */}
      <section className={styles.heroSection}>
        <div className={styles.heroDecorations}>
          {/* Using CSS pseudo-elements instead of images for decorations */}
          <div className={styles.heroLeaf1}></div>
          <div className={styles.heroLeaf2}></div>
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>Organic & Healthy</span>
          <h1 className={styles.heroTitle}>Fresh Farm<br />Products</h1>
          <p className={styles.heroDescription}>
            We bring fresh organic produce from our farm directly to your doorstep. Quality you can trust.
          </p>
          <Link href="/products" className={styles.heroButton}>
            Shop Now
          </Link>
        </div>
        <div className={styles.heroImageWrapper}>
          <FallbackImage
            src={IMAGES.hero}
            fallbackSrc={IMAGES.defaultProduct}
            alt="Fresh farm products"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        {Features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <IconComponent className={styles.featureIcon} />
              </div>
              <div className={styles.featureText}>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Shop By Category Section */}
      <section className={styles.categorySection}>
        <div className={styles.sectionHeader}>
          <h2>Shop By Category</h2>
          <div className={styles.decorLine}></div>
        </div>
        <div className={styles.categorySlider}>
          <button className={styles.sliderBtn} onClick={prevCategory} disabled={categoryIndex === 0}>
            <IoChevronBack />
          </button>
          <div className={styles.categoryGrid}>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className={`${styles.categoryCard} skeleton`}></div>
              ))
            ) : (
              visibleCategories.map((category) => (
                <div key={category._id} className={styles.categoryCard} onClick={() => handleCategoryClick(category)}>
                  <div className={styles.categoryImageWrapper}>
                    <FallbackImage
                      src={getCategoryImage(category)}
                      fallbackSrc={IMAGES.defaultProduct}
                      alt={category.name}
                      fill
                      sizes="120px"
                      className={styles.categoryImage}
                    />
                  </div>
                  <span className={styles.categoryName}>{category.name}</span>
                </div>
              ))
            )}
          </div>
          <button className={styles.sliderBtn} onClick={nextCategory} disabled={categoryIndex + 5 >= displayCategories.length}>
            <IoChevronForward />
          </button>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className={styles.promoBanners}>
        <div className={styles.promoBanner}>
          <FallbackImage
            src={IMAGES.promoBanner1}
            fallbackSrc={IMAGES.defaultProduct}
            alt="Pure Organic Honey"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.promoBannerImage}
          />
          <div className={styles.promoBannerOverlay}></div>
          <div className={styles.promoContent}>
            <span className={styles.promoLabel}>Farm Fresh</span>
            <h3>Pure Organic<br />Honey</h3>
            <p>Natural sweetness from our farms</p>
            <Link href="/products?category=honey" className={styles.promoLink}>Shop Now</Link>
          </div>
        </div>
        <div className={styles.promoBanner}>
          <FallbackImage
            src={IMAGES.promoBanner2}
            fallbackSrc={IMAGES.defaultProduct}
            alt="Fresh Vegetables"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.promoBannerImage}
          />
          <div className={styles.promoBannerOverlay}></div>
          <div className={styles.promoContent}>
            <span className={styles.promoLabel}>20% Off</span>
            <h3>Fresh<br />Vegetables</h3>
            <p>Farm to table freshness</p>
            <Link href="/products?category=vegetables" className={styles.promoLink}>Shop Now</Link>
          </div>
        </div>
        <div className={styles.promoBanner}>
          <FallbackImage
            src={IMAGES.promoBanner3}
            fallbackSrc={IMAGES.defaultProduct}
            alt="Free Range Poultry"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.promoBannerImage}
          />
          <div className={styles.promoBannerOverlay}></div>
          <div className={styles.promoContent}>
            <span className={styles.promoLabel}>Premium</span>
            <h3>Free Range<br />Poultry</h3>
            <p>Healthy & nutritious</p>
            <Link href="/products?category=poultry" className={styles.promoLink}>Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2>We Love Trend</h2>
          <div className={styles.decorLine}></div>
        </div>
        <div className={styles.productTabs}>
          <button className={`${styles.tabBtn} ${activeTab === "featured" ? styles.activeTab : ""}`} onClick={() => setActiveTab("featured")}>
            Featured
          </button>
          <button className={`${styles.tabBtn} ${activeTab === "latest" ? styles.activeTab : ""}`} onClick={() => setActiveTab("latest")}>
            Latest
          </button>
          <button className={`${styles.tabBtn} ${activeTab === "bestSeller" ? styles.activeTab : ""}`} onClick={() => setActiveTab("bestSeller")}>
            Best Seller
          </button>
        </div>
        <div className={styles.productGrid}>
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className={`${styles.productCard} skeleton`}></div>
            ))
          ) : filteredProducts().length > 0 ? (
            filteredProducts().map((product) => (
              <div key={product._id} className={styles.productCard} onClick={() => handleProductClick(product._id)}>
                <div className={styles.productImageWrapper}>
                  <FallbackImage
                    src={product.images?.[0]}
                    fallbackSrc={IMAGES.defaultProduct}
                    alt={product.name}
                    fill
                    sizes="250px"
                    className={styles.productImage}
                    onError={() => handleImgError(product._id)}
                  />
                  <div className={styles.productActions}>
                    <button className={styles.quickViewBtn} onClick={(e) => handleQuickView(e, product)} title="Quick View">
                      <EyeIcon />
                    </button>
                    <button className={styles.addToCartBtn} onClick={(e) => handleAddToCart(e, product)} title="Add to Cart">
                      <CartIcon />
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.category}</span>
                  <h4 className={styles.productName}>{product.name}</h4>
                  <div className={styles.productRating}>
                    {renderStars(product.rating?.average || 0)}
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.currentPrice}>Ksh {product.price}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noProductsMessage}>
              <p>No products available yet. Check back soon!</p>
              <Link href="/contact" className={styles.contactLink}>Contact Us</Link>
            </div>
          )}
        </div>
      </section>

      {/* Healthy Life Section */}
      <section className={styles.healthySection}>
        <div className={styles.healthyImage}>
          <FallbackImage
            src={IMAGES.healthyLife}
            fallbackSrc={IMAGES.defaultProduct}
            alt="Healthy lifestyle with fresh produce"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.healthyImg}
          />
        </div>
        <div className={styles.healthyContent}>
          <span className={styles.healthySubtitle}>Fresh Grocery</span>
          <h2>The Healthy Life</h2>
          <div className={styles.healthyLeaves}>
            <span>🌿</span><span>🌿</span>
          </div>
          <p>
            At CharismaFarm, we believe in providing you with the freshest, most nutritious produce straight from our organic farms.
            Our commitment to sustainable farming ensures that every product you receive is packed with natural goodness.
          </p>
          <p>
            From pure honey harvested from our apiaries to free-range eggs and farm-fresh vegetables, we deliver quality you can trust
            directly to your doorstep.
          </p>
          <Link href="/products" className={styles.healthyButton}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Summer Sale Banner */}
      <section className={styles.saleBanner}>
        <FallbackImage
          src={IMAGES.saleBanner}
          fallbackSrc={IMAGES.defaultProduct}
          alt="Summer sale"
          fill
          sizes="100vw"
          className={styles.saleBannerImage}
        />
        <div className={styles.saleBannerOverlay}></div>
        <div className={styles.saleContent}>
          <span className={styles.saleLabel}>Quality Food Harvest</span>
          <h2>Save 20% off</h2>
          <h3>Summer Sale Season!</h3>
          <Link href="/products" className={styles.saleButton}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialSection}>
        <div className={styles.sectionHeader}>
          <h2>Testimonials</h2>
          <div className={styles.decorLine}></div>
        </div>
        <div className={styles.testimonialSlider}>
          <button className={styles.testimonialBtn} onClick={prevTestimonial}>
            <IoChevronBack />
          </button>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>"</div>
            <p className={styles.testimonialText}>{displayTestimonials[testimonialIndex]?.comment}</p>
            <div className={styles.testimonialAuthor}>
              <FallbackImage
                src={displayTestimonials[testimonialIndex]?.image}
                fallbackSrc={IMAGES.avatar}
                alt={displayTestimonials[testimonialIndex]?.name || "Customer"}
                width={60}
                height={60}
                className={styles.authorImage}
              />
              <div className={styles.authorInfo}>
                <h4>{displayTestimonials[testimonialIndex]?.name}</h4>
                <span>{displayTestimonials[testimonialIndex]?.role}</span>
              </div>
            </div>
            <div className={styles.testimonialRating}>
              {renderStars(displayTestimonials[testimonialIndex]?.rating || 5)}
            </div>
          </div>
          <button className={styles.testimonialBtn} onClick={nextTestimonial}>
            <IoChevronForward />
          </button>
        </div>
        <div className={styles.testimonialDots}>
          {displayTestimonials.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === testimonialIndex ? styles.activeDot : ""}`}
              onClick={() => setTestimonialIndex(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Best Selling Products */}
      <section className={styles.bestSellingSection}>
        <div className={styles.sectionHeader}>
          <h2>Best Selling Products</h2>
          <div className={styles.decorLine}></div>
        </div>
        <div className={styles.bestSellingGrid}>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className={`${styles.bestSellingCard} skeleton`}></div>
            ))
          ) : products && products.length > 0 ? (
            products.slice(0, 6).map((product) => (
              <div key={product._id} className={styles.bestSellingCard} onClick={() => handleProductClick(product._id)}>
                <div className={styles.bestSellingImageWrapper}>
                  <FallbackImage
                    src={product.images?.[0]}
                    fallbackSrc={IMAGES.defaultProduct}
                    alt={product.name}
                    width={80}
                    height={80}
                    className={styles.bestSellingImage}
                  />
                </div>
                <div className={styles.bestSellingInfo}>
                  <span className={styles.bestSellingCategory}>{product.category}</span>
                  <h4>{product.name}</h4>
                  <div className={styles.bestSellingRating}>
                    {renderStars(product.rating?.average || 0)}
                  </div>
                  <span className={styles.bestSellingPrice}>Ksh {product.price}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noProductsMessage}>
              <p>Products coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className={styles.blogSection}>
        <div className={styles.sectionHeader}>
          <h2>Latest Blog</h2>
          <div className={styles.decorLine}></div>
        </div>
        <div className={styles.blogGrid}>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className={`${styles.blogCard} skeleton`}></div>
            ))
          ) : (
            displayBlogs.map((blog) => (
              <div key={blog._id} className={styles.blogCard} onClick={() => router.push(`/blog/${blog.slug}`)}>
                <div className={styles.blogImageWrapper}>
                  <FallbackImage
                    src={blog.image}
                    fallbackSrc={IMAGES.blog1}
                    alt={blog.title}
                    fill
                    sizes="350px"
                    className={styles.blogImage}
                  />
                </div>
                <div className={styles.blogContent}>
                  <span className={styles.blogDate}>
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <h4 className={styles.blogTitle}>{blog.title}</h4>
                  <p className={styles.blogExcerpt}>{blog.excerpt || blog.content?.substring(0, 100)}...</p>
                  <span className={styles.blogReadMore}>Read More</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleQuickViewAddToCart}
        isAuth={isAuth && emailVerified}
      />
    </main>
  );
}