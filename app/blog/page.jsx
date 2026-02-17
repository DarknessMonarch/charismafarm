"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBlogStore } from "@/app/store/blogStore";
import styles from "@/app/style/blog.module.css";
import Nothing from "@/app/components/Nothing";
import NoDataImg from "@/public/assets/noData.png";

const CATEGORIES = ["All", "Health", "Recipes", "Farming", "Nutrition", "Tips"];

export default function BlogPage() {
  const { blogs, loading, pagination, fetchBlogs } = useBlogStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs(currentPage, 9);
  }, [currentPage]);

  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter((blog) => blog.category?.toLowerCase() === selectedCategory.toLowerCase());

  const featuredBlog = filteredBlogs[0];
  const recentBlogs = filteredBlogs.slice(1);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "3 min read";
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className={styles.kitchenBlogContainer}>
        <div className={styles.blogHeroSection}>
          <h1>Our Blog</h1>
          <p>Fresh insights from the farm</p>
        </div>
        <div className={styles.blogMainContent}>
          <div className={styles.articlesGridLayout}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className={`${styles.articleCard} skeleton`} style={{ minHeight: 300, opacity: 1 }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.kitchenBlogContainer}>
      <section className={styles.blogHeroSection}>
        <h1>Our Blog</h1>
        <p>Discover tips, recipes, and insights from our organic farm</p>
      </section>

      <div className={styles.blogMainContent}>
        <nav className={styles.categoryNavigation}>
          <div className={styles.categoryButtonGroup}>
            {CATEGORIES.map((category, index) => (
              <button
                key={category}
                className={`${styles.categoryFilterButton} ${selectedCategory === category ? styles.activeCategory : ""}`}
                onClick={() => setSelectedCategory(category)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {filteredBlogs.length === 0 ? (
          <div className={styles.emptyProductWrapper}>
            <Nothing
              NothingImage={NoDataImg}
              Text="No blog posts found"
              Alt="No blogs"
            />
          </div>
        ) : (
          <>
            {featuredBlog && (
              <section className={styles.featuredArticleSection}>
                <article className={styles.featuredArticleCard}>
                  <div className={styles.featuredImageWrapper}>
                    {featuredBlog.image ? (
                      <Image
                        src={featuredBlog.image}
                        alt={featuredBlog.title}
                        fill
                        className={styles.featuredArticleImage}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.featuredArticleImage} style={{ background: "var(--tertiary-light-color)", height: "100%" }}></div>
                    )}
                  </div>
                  <div className={styles.featuredArticleContent}>
                    <div className={styles.articleMetaInfo}>
                      <span className={styles.categoryTag}>{featuredBlog.category || "General"}</span>
                      <span className={styles.readingTime}>{calculateReadTime(featuredBlog.content)}</span>
                    </div>
                    <h3>
                      <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                    </h3>
                    <p>{featuredBlog.excerpt || featuredBlog.content?.substring(0, 150)}...</p>
                    <div className={styles.authorInfoSection}>
                      <div className={styles.authorDetailsWrapper}>
                        <span className={styles.authorNameText}>{featuredBlog.author || "CharismaFarm"}</span>
                        <span className={styles.publishDate}>{formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            )}

            {recentBlogs.length > 0 && (
              <section className={styles.recentArticlesSection}>
                <div className={styles.articlesGridLayout}>
                  {recentBlogs.map((blog, index) => (
                    <article
                      key={blog._id}
                      className={styles.articleCard}
                      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                    >
                      <div className={styles.articleImageWrapper}>
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className={styles.articleCardImage}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className={styles.articleCardImage} style={{ background: "var(--tertiary-light-color)", height: "100%" }}></div>
                        )}
                      </div>
                      <div className={styles.articleCardContent}>
                        <div className={styles.articleMetaInfo}>
                          <span className={styles.categoryTag}>{blog.category || "General"}</span>
                          <span className={styles.readingTime}>{calculateReadTime(blog.content)}</span>
                        </div>
                        <h3 className={styles.articleCardTitle}>
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>
                        <p className={styles.articleCardExcerpt}>
                          {blog.excerpt || blog.content?.substring(0, 100)}...
                        </p>
                        <div className={styles.articleCardFooter}>
                          <div className={styles.authorInfoSection}>
                            <div className={styles.authorDetailsWrapper}>
                              <span className={styles.authorNameText}>{blog.author || "CharismaFarm"}</span>
                              <span className={styles.publishDate}>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                            </div>
                          </div>
                          <Link href={`/blog/${blog.slug}`} className={styles.readMoreLink}>
                            Read More
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
