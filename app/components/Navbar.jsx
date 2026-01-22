"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCartStore } from "@/app/store/Cart";
import Logo from "@/public/assets/logo.png";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/navbar.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";

import {
  IoClose as CloseIcon,
  IoPersonOutline as PersonIcon,
  IoCartOutline as CartIcon,
  IoChevronDownOutline as ChevronDownIcon,
  IoSearchOutline as SearchIcon,
  IoCallOutline as PhoneIcon,
  IoAdd as IoPlusIcon,
  IoRemove as IoMinusIcon,
} from "react-icons/io5";

import { CgMenuGridO as MenuIcon } from "react-icons/cg";

import {
  MdLogout as LogoutIcon,
  MdLocalOffer as OfferIcon,
  MdCameraAlt as CameraIcon,
} from "react-icons/md";

const MOBILE_BREAKPOINT = 768;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const useResponsive = () => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
};

const useImageUpload = (updateProfileImage) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP or GIF)");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 100MB");
      return false;
    }

    return true;
  }, []);

  const uploadImage = useCallback(
    async (file) => {
      if (!validateFile(file)) return;

      setIsUploadingImage(true);

      try {
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const result = await updateProfileImage(e.target.result);

            if (result?.success) {
              toast.success("Profile image updated successfully!");
              setShowHint(false);
            } else {
              toast.error(result?.message || "Failed to update profile image");
            }
          } catch (error) {
            console.error("Profile image update error:", error);
            toast.error("Failed to update profile image");
          } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };

        reader.onerror = () => {
          toast.error("Failed to read the image file");
          setIsUploadingImage(false);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Failed to process the image");
        setIsUploadingImage(false);
      }
    },
    [updateProfileImage, validateFile]
  );

  const handleProfileImageClick = useCallback(() => {
    if (fileInputRef.current && !isUploadingImage) {
      fileInputRef.current.click();
    }
  }, [isUploadingImage]);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadImage(file);
      }
    },
    [uploadImage]
  );

  const handleMouseEnter = useCallback(() => {
    setShowHint(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowHint(false);
  }, []);

  return {
    isUploadingImage,
    fileInputRef,
    handleProfileImageClick,
    handleFileChange,
    showHint,
    handleMouseEnter,
    handleMouseLeave,
  };
};

const useNavLinks = () => {
  const { products, getAllProducts } = useEcommerceStore();
  const [navProducts, setNavProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProducts(true);
      try {
        const result = await getAllProducts({ limit: 100 });
        if (result.success && result.data.products) {
          const fetchedProducts = result.data.products;

          setNavProducts(fetchedProducts.slice(0, 4));
          const uniqueCategories = [
            ...new Set(
              fetchedProducts.map((product) => product.category).filter(Boolean)
            ),
          ];

          const formattedCategories = uniqueCategories.map((cat) => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: cat,
          }));

          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching nav data:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchData();
  }, [getAllProducts]);

  const CATEGORY_OPTIONS = useMemo(
    () => [{ id: "all", name: "All Categories", value: "all" }, ...categories],
    [categories]
  );

  const NAV_LINKS = useMemo(
    () => [
      { href: "/", label: "Home", exact: true },
      { href: "/about", label: "About Us", matchPattern: "/about" },
      {
        href: "/categories",
        label: "Categories",
        hasDropdown: true,
        dropdown: categories.map((cat) => ({
          name: cat.name,
          href: `/products?category=${cat.value}`,
        })),
        title: "Shop by Category",
        description:
          "Browse our farm-fresh products by category. From pure honey to fresh vegetables, find exactly what you need.",
        image:
          "https://cdn.pixabay.com/photo/2016/08/11/08/04/vegetables-1584999_640.jpg",
        imageTitle: "Farm Fresh Categories",
        imageDescription:
          "Honey, poultry, vegetables, and goat products - all organically raised on our farm.",
      },
      {
        href: "/products",
        label: "Products",
        hasDropdown: true,
        dropdown: navProducts.map((product) => ({
          name: product.name,
          href: `/products/${product._id}`,
        })),
        title: "Featured Products",
        description:
          "Discover our most popular farm products. Fresh, organic, and delivered with care.",
        image:
          "https://cdn.pixabay.com/photo/2017/06/02/18/24/honey-2367429_640.jpg",
        imageTitle: "Best-Selling Farm Products",
        imageDescription:
          "Shop our customer favorites - pure honey, free-range eggs, and fresh produce.",
      },
      { href: "/contact", label: "Contact Us" },
    ],
    [navProducts, categories]
  );

  return { NAV_LINKS, CATEGORY_OPTIONS, isLoadingProducts };
};

const isLinkActive = (pathname, searchParams, link) => {
  if (!pathname) return false;

  if (link.exact) {
    return pathname === link.href;
  }

  if (link.href === "/categories") {
    if (pathname === "/categories") return true;

    if (pathname.startsWith("/products")) {
      const categoryParam = searchParams?.get?.("category");
      return !!categoryParam;
    }

    return false;
  }

  if (link.href === "/products") {
    if (pathname === "/products") return true;

    if (pathname.startsWith("/products/")) {
      return true;
    }

    return false;
  }

  const patternToCheck = link.matchPattern || link.href;
  return (
    pathname === patternToCheck || pathname.startsWith(`${patternToCheck}/`)
  );
};

const NavItemDropdown = ({
  item,
  setActiveDropdown,
  isMobile,
  onNavItemClick,
}) => {
  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
    if (isMobile) {
      onNavItemClick();
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownContent}>
        <div className={styles.dropdownInfo}>
          {item.title && <h2>{item.title}</h2>}
          {item.description && <p>{item.description}</p>}
          <div className={styles.dropdownLinks}>
            {item.dropdown && item.dropdown.length > 0 ? (
              item.dropdown.map((dropdownItem, dropIndex) => (
                <Link
                  key={dropIndex}
                  href={dropdownItem.href}
                  className={styles.dropdownItem}
                  onClick={handleDropdownItemClick}
                >
                  {dropdownItem.name}
                </Link>
              ))
            ) : (
              <p>Loading...</p>
            )}
            {isMobile && (
              <Link
                href={item.href}
                className={styles.dropdownItem}
                onClick={handleDropdownItemClick}
              >
                See more
              </Link>
            )}
          </div>
        </div>

        {item.image && (
          <div className={styles.dropdownImageContainer}>
            <Image
              className={styles.dropdownImage}
              src={item.image}
              alt={item.imageTitle || "Dropdown Image"}
              width={250}
              height={250}
            />
            {item.imageTitle && <h3>{item.imageTitle}</h3>}
            {item.imageDescription && <p>{item.imageDescription}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileImageComponent = ({
  profileImage,
  onImageClick,
  isUploading,
  showHint,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className={styles.profileImgWrapper}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {profileImage?.startsWith("https://") ||
    profileImage?.startsWith("http://") ? (
      <div className={styles.profileImgContainer}>
        <Image
          className={styles.profileImg}
          src={profileImage}
          alt="Profile picture"
          fill
          sizes="100%"
          quality={100}
          priority={true}
          onClick={onImageClick}
          style={{
            cursor: isUploading ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.7 : 1,
            objectFit: "cover",
          }}
        />
        {showHint && !isUploading && (
          <div className={styles.profileImageHint}>
            <CameraIcon className={styles.cameraIcon} />
            <span>Click to change</span>
          </div>
        )}
        {isUploading && (
          <div className={styles.profileImageLoading}>
            <span>Uploading...</span>
          </div>
        )}
      </div>
    ) : (
      <div className={`${styles.profileImgContainer} skeleton`} />
    )}
  </div>
);

const NavigationLinks = ({
  pathname,
  searchParams,
  onLinkClick,
  activeDropdown,
  setActiveDropdown,
  isMobile,
  navLinks,
}) => {
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown, setActiveDropdown, isMobile]);

  const handleInteraction = (link, index) => {
    if (link.hasDropdown) {
      if (isMobile) {
        setActiveDropdown(activeDropdown === index ? null : index);
      } else {
        router.push(link.href);
      }
    } else {
      if (isMobile) {
        onLinkClick();
      }
    }
  };

  const handleMouseEnter = (index, hasDropdown) => {
    if (!isMobile && hasDropdown) {
      setActiveDropdown(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  return (
    <div className={styles.navigationLinks} ref={dropdownRef}>
      {navLinks.map((link, index) => {
        const isActive = activeDropdown === index;
        const isCurrentPage = isLinkActive(pathname, searchParams, link);

        return (
          <div
            key={link.href}
            className={styles.navLinkWrapper}
            onMouseEnter={() => handleMouseEnter(index, link.hasDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={styles.navItemLinkContainer}
              onClick={() => handleInteraction(link, index)}
            >
              <Link
                href={link.href}
                className={`${styles.navLink} ${
                  isCurrentPage ? styles.activeNavLink : ""
                }`}
                onClick={(e) => {
                  if (isMobile && link.hasDropdown) {
                    e.preventDefault();
                  } else if (!link.hasDropdown) {
                    onLinkClick();
                  }
                }}
              >
                {link.label}
                {link.hasDropdown && (
                  <>
                    {isMobile ? (
                      isActive ? (
                        <IoMinusIcon className={styles.mobileIcon} />
                      ) : (
                        <IoPlusIcon className={styles.mobileIcon} />
                      )
                    ) : (
                      <ChevronDownIcon
                        className={`${styles.chevron} ${
                          isActive ? styles.chevronOpen : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </Link>
            </div>

            {link.hasDropdown && isActive && (
              <NavItemDropdown
                item={link}
                setActiveDropdown={setActiveDropdown}
                isMobile={isMobile}
                onNavItemClick={onLinkClick}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const MobileMenuOverlay = ({
  isOpen,
  onClose,
  pathname,
  searchParams,
  activeDropdown,
  setActiveDropdown,
  navLinks,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={styles.mobileMenuOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.mobileMenuContent} ${
          isClosing ? styles.slideOut : styles.slideIn
        }`}
      >
    <div className={styles.mobileMenuHeader}>
          <div className={styles.logoContainer}>
            <Image
              src={Logo}
              alt="logo"
              height={200}
              onClick={() => {
                handleClose();
                onLogoClick();
              }}
              priority={true}
              className={styles.logoImage}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onLogoClick();
                }
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
          <button
            className={styles.mobileMenuClose}
            onClick={handleClose}
            aria-label="Close menu"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>

        <NavigationLinks
          pathname={pathname}
          searchParams={searchParams || new URLSearchParams()}
          onLinkClick={handleClose}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          isMobile={true}
          navLinks={navLinks}
        />
      </div>
    </div>
  );
};

const LogoSection = ({ onLogoClick }) => (
  <div className={styles.logoContainer}>
    <Image
      src={Logo}
      alt="Company Logo"
      height={70}
      width={70}
      onClick={onLogoClick}
      priority={true}
      className={styles.logoImage}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onLogoClick();
        }
      }}
      style={{ cursor: "pointer" }}
    />

  </div>
);

const SearchSection = ({ isMobile, categoryOptions }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);

  useEffect(() => {
    setSelectedCategory(categoryOptions[0]);
  }, [categoryOptions]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory.value !== "all") {
      params.set("category", selectedCategory.value);
    }

    router.push(`/products?${params.toString()}`);
  };

  if (isMobile) return null;

  return (
    <form onSubmit={handleSearch} className={styles.searchContainer}>
      <div className={styles.categorySelector}>
        <Dropdown
          options={categoryOptions}
          onSelect={handleCategorySelect}
          dropPlaceHolder="Select Category"
          value={selectedCategory}
        />
      </div>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          placeholder="I am shopping for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Search"
        >
          <SearchIcon className={styles.searchIcon} />
        </button>
      </div>
    </form>
  );
};

const RightSection = ({
  isAuth,
  username,
  profileImage,
  onImageClick,
  isUploadingImage,
  onLogout,
  isLoggingOut,
  isMobile,
  showHint,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div className={styles.rightSection}>
    {!isMobile && (
      <div className={styles.supportSection}>
        <PhoneIcon className={styles.supportIcon} />
        <div className={styles.supportText}>
          <span>24/7 SUPPORT</span>
          <span>(+254) 746-033-465</span>
        </div>
      </div>
    )}

    {isAuth ? (
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <ProfileImageComponent
            profileImage={profileImage}
            onImageClick={onImageClick}
            isUploading={isUploadingImage}
            showHint={showHint}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <span>{username || "Guest"}</span>
        </div>
        <button
          onClick={onLogout}
          className={styles.logoutButton}
          disabled={isLoggingOut}
          aria-label={isLoggingOut ? "Logging out..." : "Logout"}
        >
          <LogoutIcon className={styles.logoutIcon} />
        </button>
      </div>
    ) : (
      <Link href="/authentication/login" className={styles.accountSection}>
        <PersonIcon className={styles.accountIcon} />
      </Link>
    )}
  </div>
);

const CartSection = ({ onCartClick }) => {
  const { cart } = useEcommerceStore();
  const { toggleDrawer } = useCartStore();

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.totalAmount || 0;

  const handleCartClick = () => {
    toggleDrawer();
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <div
      className={styles.cartSection}
      onClick={handleCartClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCartClick();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.cartInfo}>
        <CartIcon className={styles.cartIcon} />
        <span className={styles.cartCount}>{itemCount}</span>
      </div>
      <span className={styles.cartPrice}>
        {subtotal > 0 ? `Ksh ${subtotal.toFixed(2)}` : "Ksh 0.00"}
      </span>
    </div>
  );
};

const NavbarSkeleton = () => (
  <nav
    className={styles.navbarWrapper}
    role="navigation"
    aria-label="Main navigation"
  >
    <div className={styles.navbarOffer}>
      <OfferIcon className={styles.offerIcon} aria-hidden="true" />
      <span className={styles.offerText}>Fresh organic farm products delivered to your door</span>
    </div>
    <div className={styles.navbarContainerWrapper}>
      <div className={styles.navbarContainer}>
        <div className={styles.logoContainer}>
          <div
            className="skeleton"
            style={{ width: 32, height: 32, borderRadius: "4px" }}
          />
          <span className={styles.logoText}>CharismaFarm</span>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.supportSection}>
            <PhoneIcon className={styles.supportIcon} />
            <div className={styles.supportText}>
              <span>24/7 SUPPORT</span>
              <span>(+254) 700-000-000</span>
            </div>
          </div>
          <div
            className="skeleton"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </div>
      </div>
    </div>
    <div className={styles.secondaryNav}>
      <div className={styles.cartSection}>
        <div className={styles.cartInfo}>
          <CartIcon className={styles.cartIcon} />
          <span className={styles.cartCount}>0</span>
        </div>
        <span className={styles.cartPrice}>Ksh 0.00</span>
      </div>
    </div>
  </nav>
);

const NavbarContent = () => {
  const {
    isOpen: isMobileMenuOpen,
    toggleOpen: toggleMobileMenu,
    setClose: closeMobileMenu,
  } = useDrawerStore();

  const { isMobile } = useResponsive();
  const { NAV_LINKS, CATEGORY_OPTIONS } = useNavLinks();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const {
    isAuth,
    username,
    profileImage,
    logout,
    clearUser,
    updateProfileImage,
    cart,
    getCart,
  } = useEcommerceStore();

  const {
    isUploadingImage,
    fileInputRef,
    handleProfileImageClick,
    handleFileChange,
    showHint,
    handleMouseEnter,
    handleMouseLeave,
  } = useImageUpload(updateProfileImage);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isAuth) {
      getCart();
    }
  }, [isAuth, getCart]);

  const handleLinkClick = useCallback(() => {
    if (isMobile) {
      closeMobileMenu();
    }
    setActiveDropdown(null);
  }, [isMobile, closeMobileMenu]);

  const handleLogoClick = useCallback(() => {
    setActiveDropdown(null);
    if (isMobile) {
      closeMobileMenu();
    }
    router.push("/");
  }, [isMobile, router, closeMobileMenu]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut || !logout) return;

    setIsLoggingOut(true);
    try {
      const result = await logout();

      if (result?.success) {
        toast.success(result.message || "Logged out successfully");
        closeMobileMenu();
        router.push("/");
      } else {
        toast.error(result?.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");

      clearUser();
      closeMobileMenu();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, logout, closeMobileMenu, router, clearUser]);

  const handleMobileMenuToggle = useCallback(() => {
    setActiveDropdown(null);
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  const handleCartClick = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const fileInputProps = useMemo(
    () => ({
      ref: fileInputRef,
      type: "file",
      accept: ALLOWED_IMAGE_TYPES.join(","),
      onChange: handleFileChange,
      style: { display: "none" },
      disabled: isUploadingImage,
      "aria-hidden": true,
    }),
    [fileInputRef, handleFileChange, isUploadingImage]
  );

  return (
    <>
      <input {...fileInputProps} />

      <nav
        className={styles.navbarWrapper}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navbarOffer}>
          <OfferIcon className={styles.offerIcon} aria-hidden="true" />
          <span className={styles.offerText}>Fresh organic farm products delivered to your door</span>
        </div>
        <div className={styles.navbarContainerWrapper}>
          <div className={styles.navbarContainer}>
            <LogoSection onLogoClick={handleLogoClick} />
            <SearchSection
              isMobile={isMobile}
              categoryOptions={CATEGORY_OPTIONS}
            />
            <RightSection
              isAuth={isAuth}
              username={username}
              profileImage={profileImage}
              onImageClick={handleProfileImageClick}
              isUploadingImage={isUploadingImage}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
              isMobile={isMobile}
              showHint={showHint}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        </div>

        <div className={styles.secondaryNav}>
          {isMobile && (
            <button
              className={styles.mobileMenuButton}
              onClick={handleMobileMenuToggle}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {!isMobileMenuOpen ? (
                <MenuIcon className={styles.menuIcon} aria-hidden="true" />
              ) : (
                <CloseIcon className={styles.closeIcon} aria-hidden="true" />
              )}
            </button>
          )}
          {!isMobile && (
            <NavigationLinks
              pathname={pathname}
              searchParams={searchParams || new URLSearchParams()}
              onLinkClick={handleLinkClick}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              isMobile={isMobile}
              navLinks={NAV_LINKS}
            />
          )}

          <CartSection onCartClick={handleCartClick} />
        </div>
      </nav>

      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        pathname={pathname}
        searchParams={searchParams}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        navLinks={NAV_LINKS}
      />
    </>
  );
};

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarContent />
    </Suspense>
  );
}
