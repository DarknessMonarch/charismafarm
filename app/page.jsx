"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import { useCategoryStore } from "@/app/store/categoryStore";
import { useTestimonialStore } from "@/app/store/testimonialStore";
import { useBlogStore } from "@/app/store/blogStore";
import { useAdvertStore } from "@/app/store/Advert";
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

export default function Home() {
  const router = useRouter();
  const { products, getAllProducts, addToCart, isAuth, emailVerified } = useEcommerceStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { testimonials, fetchTestimonials } = useTestimonialStore();
  const { blogs, fetchBlogs } = useBlogStore();
  const { advertsByPlacement, fetchAdverts, loading: advertsLoading } = useAdvertStore();
  const { openDrawer } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [categoryScrollPos, setCategoryScrollPos] = useState(0);
  const [categoryMaxScroll, setCategoryMaxScroll] = useState(0);
  const categoryGridRef = useRef(null);

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
          fetchAdverts(),
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

  const displayCategories = categories || [];
  const displayTestimonials = testimonials || [];
  const displayBlogs = blogs || [];

  // Server-driven advert data
  const heroAdvert = advertsByPlacement["hero"];
  const heroItem = heroAdvert?.items?.[0];

  const promoBanner1 = advertsByPlacement["promo_banner_1"]?.items?.[0];
  const promoBanner2 = advertsByPlacement["promo_banner_2"]?.items?.[0];
  const promoBanner3 = advertsByPlacement["promo_banner_3"]?.items?.[0];
  const hasPromoBanners = promoBanner1 || promoBanner2 || promoBanner3;

  const healthyLifeAdvert = advertsByPlacement["healthy_life"];
  const healthyLifeItem = healthyLifeAdvert?.items?.[0];

  const summerSaleAdvert = advertsByPlacement["summer_sale"];
  const summerSaleItem = summerSaleAdvert?.items?.[0];

  const bestSellingProducts = products && products.length > 0
    ? [...products].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0)).slice(0, 6)
    : [];

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  const SCROLL_AMOUNT = 320;

  const nextCategory = () => {
    if (categoryGridRef.current) {
      categoryGridRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    }
  };

  const prevCategory = () => {
    if (categoryGridRef.current) {
      categoryGridRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    }
  };

  const handleCategoryGridScroll = () => {
    if (categoryGridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryGridRef.current;
      setCategoryScrollPos(scrollLeft);
      setCategoryMaxScroll(scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    const grid = categoryGridRef.current;
    if (!grid) return;
    const update = () => {
      setCategoryMaxScroll(grid.scrollWidth - grid.clientWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [displayCategories]);

  return (
    <main className={styles.homeContainer}>
      {/* Hero Section */}
      {loading || advertsLoading ? (
        <div className={`${styles.heroSkeleton} skeleton`}></div>
      ) : heroItem ? (
        <section className={styles.heroSection}>
          <div className={styles.heroDecorations}>
            <div className={styles.heroLeaf1}></div>
            <div className={styles.heroLeaf2}></div>
          </div>
          <div className={styles.heroContent}>
            {heroItem.subtitle && (
              <span className={styles.heroSubtitle}>{heroItem.subtitle}</span>
            )}
            <h1 className={styles.heroTitle}>
              {heroItem.title?.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h1>
            {heroItem.description && (
              <p className={styles.heroDescription}>{heroItem.description}</p>
            )}
            <Link href={heroItem.buttonLink || "/products"} className={styles.heroButton}>
              {heroItem.buttonText || "Shop Now"}
            </Link>
          </div>
          <div className={styles.heroImageWrapper}>
            <Image
              src={heroItem.image}
              alt={heroItem.title || "Hero banner"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.heroImage}
              priority
            />
          </div>
        </section>
      ) : null}

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
      {displayCategories.length > 0 && (
        <section className={styles.categorySection}>
          <div className={styles.sectionHeader}>
            <h2>Shop By Category</h2>
            <div className={styles.decorLine}></div>
          </div>
          <div className={styles.categorySlider}>
            <button
              className={styles.sliderBtn}
              onClick={prevCategory}
              disabled={categoryScrollPos <= 0}
              aria-label="Previous categories"
            >
              <IoChevronBack />
            </button>
            <div
              ref={categoryGridRef}
              className={styles.categoryGrid}
              onScroll={handleCategoryGridScroll}
            >
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className={`${styles.categoryCard} skeleton`}></div>
                ))
              ) : (
                displayCategories.map((category) => (
                  <div key={category._id} className={styles.categoryCard} onClick={() => handleCategoryClick(category)}>
                    <div className={styles.categoryImageWrapper}>
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="120px"
                          className={styles.categoryImage}
                        />
                      ) : (
                        <div className={styles.categoryPlaceholder}>{category.name?.charAt(0)}</div>
                      )}
                    </div>
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                ))
              )}
            </div>
            <button
              className={styles.sliderBtn}
              onClick={nextCategory}
              disabled={categoryScrollPos >= categoryMaxScroll}
              aria-label="Next categories"
            >
              <IoChevronForward />
            </button>
          </div>
        </section>
      )}

      {/* Promotional Banners */}
      {loading || advertsLoading ? (
        <section className={styles.promoBanners}>
          <div className={`${styles.promoBannerSkeleton} skeleton`}></div>
          <div className={`${styles.promoBannerSkeleton} skeleton`}></div>
          <div className={`${styles.promoBannerSkeleton} skeleton`}></div>
        </section>
      ) : hasPromoBanners ? (
        <section className={styles.promoBanners}>
          {[promoBanner1, promoBanner2, promoBanner3].map((banner, idx) =>
            banner ? (
              <div key={idx} className={styles.promoBanner}>
                <Image
                  src={banner.image}
                  alt={banner.title || "Promo Banner"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.promoBannerImage}
                />
                <div className={styles.promoBannerOverlay}></div>
                <div className={styles.promoContent}>
                  {banner.label && <span className={styles.promoLabel}>{banner.label}</span>}
                  <h3>{banner.title?.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}</h3>
                  {banner.description && <p>{banner.description}</p>}
                  <Link href={banner.buttonLink || "/products"} className={styles.promoLink}>
                    {banner.buttonText || "Shop Now"}
                  </Link>
                </div>
              </div>
            ) : null
          )}
        </section>
      ) : null}

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
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="250px"
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.categoryPlaceholder}>{product.name?.charAt(0)}</div>
                  )}
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
      {loading || advertsLoading ? (
        <div className={`${styles.healthySectionSkeleton} skeleton`}></div>
      ) : healthyLifeItem ? (
        <section className={styles.healthySection}>
          <div className={styles.healthyImage}>
            <Image
              src={healthyLifeItem.image}
              alt={healthyLifeItem.title || "Healthy lifestyle"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.healthyImg}
            />
          </div>
          <div className={styles.healthyContent}>
            {healthyLifeItem.subtitle && (
              <span className={styles.healthySubtitle}>{healthyLifeItem.subtitle}</span>
            )}
            <h2>{healthyLifeItem.title}</h2>
            <div className={styles.healthyLeaves}>
              <span>🌿</span><span>🌿</span>
            </div>
            {healthyLifeItem.description?.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <Link href={healthyLifeItem.buttonLink || "/products"} className={styles.healthyButton}>
              {healthyLifeItem.buttonText || "Shop Now"}
            </Link>
          </div>
        </section>
      ) : null}

      {/* Summer Sale Banner */}
      {loading || advertsLoading ? (
        <div className={`${styles.saleBannerSkeleton} skeleton`}></div>
      ) : summerSaleItem ? (
        <section className={styles.saleBanner}>
          <Image
            src={summerSaleItem.image}
            alt={summerSaleItem.title || "Summer sale"}
            fill
            sizes="100vw"
            className={styles.saleBannerImage}
          />
          <div className={styles.saleBannerOverlay}></div>
          <div className={styles.saleContent}>
            {summerSaleItem.label && (
              <span className={styles.saleLabel}>{summerSaleItem.label}</span>
            )}
            <h2>{summerSaleItem.title}</h2>
            {summerSaleItem.subtitle && <h3>{summerSaleItem.subtitle}</h3>}
            <Link href={summerSaleItem.buttonLink || "/products"} className={styles.saleButton}>
              {summerSaleItem.buttonText || "Shop Now"}
            </Link>
          </div>
        </section>
      ) : null}

      {/* Testimonials Section */}
      {displayTestimonials.length > 0 && (
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
                {displayTestimonials[testimonialIndex]?.image ? (
                  <Image
                    src={displayTestimonials[testimonialIndex].image}
                    alt={displayTestimonials[testimonialIndex]?.name || "Customer"}
                    width={60}
                    height={60}
                    className={styles.authorImage}
                  />
                ) : (
                  <div className={styles.categoryPlaceholder} style={{ width: 60, height: 60, borderRadius: "50%" }}>
                    {displayTestimonials[testimonialIndex]?.name?.charAt(0)}
                  </div>
                )}
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
      )}

      {/* Best Selling Products */}
      {bestSellingProducts.length > 0 && (
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
            ) : (
              bestSellingProducts.map((product) => (
                <div key={product._id} className={styles.bestSellingCard} onClick={() => handleProductClick(product._id)}>
                  <div className={styles.bestSellingImageWrapper}>
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={80}
                        height={80}
                        className={styles.bestSellingImage}
                      />
                    ) : (
                      <div className={styles.categoryPlaceholder} style={{ width: 80, height: 80 }}>
                        {product.name?.charAt(0)}
                      </div>
                    )}
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
            )}
          </div>
        </section>
      )}

      {/* Blog Section */}
      {displayBlogs.length > 0 && (
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
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="350px"
                        className={styles.blogImage}
                      />
                    ) : (
                      <div className={styles.categoryPlaceholder}>{blog.title?.charAt(0)}</div>
                    )}
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
      )}

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
