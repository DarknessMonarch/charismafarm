"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useBlogStore } from "@/app/store/blogStore";
import styles from "@/app/style/blogpost.module.css";
import Nothing from "@/app/components/Nothing";
import NoDataImg from "@/public/assets/noData.png";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { getBlogBySlug } = useBlogStore();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (!params.slug) return;

      setLoading(true);
      setError(null);

      const result = await getBlogBySlug(params.slug);

      if (result.success) {
        setBlog(result.data.blog || result.data);
      } else {
        setError(result.message || "Blog not found");
      }

      setLoading(false);
    };

    loadBlog();
  }, [params.slug]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || "Check out this blog post";

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className={styles.blogPostContainer}>
        <header className={styles.articleHeader}>
          <div className={`skeleton`} style={{ height: 30, width: 100, borderRadius: 5 }}></div>
          <div className={`skeleton`} style={{ height: 50, width: "80%", borderRadius: 5 }}></div>
          <div className={`skeleton`} style={{ height: 20, width: 200, borderRadius: 5 }}></div>
        </header>
        <div className={`skeleton`} style={{ height: 400, borderRadius: 10 }}></div>
        <article className={styles.articleContent}>
          <div className={`skeleton`} style={{ height: 20, width: "100%", borderRadius: 5, marginBottom: 10 }}></div>
          <div className={`skeleton`} style={{ height: 20, width: "90%", borderRadius: 5, marginBottom: 10 }}></div>
          <div className={`skeleton`} style={{ height: 20, width: "95%", borderRadius: 5, marginBottom: 10 }}></div>
        </article>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={styles.blogPostContainer}>
        <div className={styles.emptyProductWrapper}>
          <Nothing
            NothingImage={NoDataImg}
            Text={error || "Blog post not found"}
            Alt="Blog not found"
          />
          <Link href="/blog" className={styles.backToBlog}>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.blogPostContainer}>
      <header className={styles.articleHeader}>
        <div className={styles.articleMeta}>
          <span className={styles.category}>{blog.category || "General"}</span>
          <span className={styles.readTime}>{calculateReadTime(blog.content)}</span>
        </div>
        <h1>{blog.title}</h1>
        <div className={styles.authorDetails}>
          <h3>{blog.author || "CharismaFarm"}</h3>
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
      </header>

      {blog.image && (
        <div className={styles.heroImageContainer}>
          <Image
            src={blog.image}
            alt={blog.title}
            width={1200}
            height={500}
            className={styles.heroImage}
            priority
          />
        </div>
      )}

      <article className={styles.articleContent}>
        <div
          className={styles.contentBody}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      <footer className={styles.articleFooter}>
        {blog.tags && blog.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <h3>Tags</h3>
            <div className={styles.tagsList}>
              {blog.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.shareSection}>
          <h3>Share this article</h3>
          <div className={styles.shareButtons}>
            <button className={styles.shareButton} onClick={() => handleShare("twitter")}>
              Twitter
            </button>
            <button className={styles.shareButton} onClick={() => handleShare("facebook")}>
              Facebook
            </button>
            <button className={styles.shareButton} onClick={() => handleShare("linkedin")}>
              LinkedIn
            </button>
            <button className={styles.shareButton} onClick={() => handleShare("whatsapp")}>
              WhatsApp
            </button>
          </div>
        </div>

        <nav className={styles.postNavigation}>
          <Link href="/blog" className={styles.backToBlog}>
            Back to Blog
          </Link>
        </nav>
      </footer>
    </div>
  );
}
