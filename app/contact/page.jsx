"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/contact.module.css";
import Dropdown from "@/app/components/Dropdown";

export default function ContactUs() {
  const { submitContactForm } = useEcommerceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const subjectOptions = [
    { value: "product-inquiry", label: "Product Inquiry" },
    { value: "order-status", label: "Order Status" },
    { value: "bulk-orders", label: "Bulk/Wholesale Orders" },
    { value: "farm-visit", label: "Farm Visit Request" },
    { value: "delivery", label: "Delivery Questions" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectSelect = (option) => {
    setFormData((prev) => ({ ...prev, subject: option.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject) {
      toast.error("Please select a subject");
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitContactForm(
        formData.email,
        formData.name,
        `[${subjectOptions.find(opt => opt.value === formData.subject)?.label}] ${formData.message}`
      );

      if (result.success) {
        toast.success(result.message || "Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSubject = subjectOptions.find(option => option.value === formData.subject);

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactHeader}>
        <h1>Contact Us</h1>
      </div>

      <div className={styles.section}>
        <h2>Get in Touch with CharismaFarm</h2>
        <p>
          We'd love to hear from you! Whether you have questions about our organic products,
          want to place a bulk order, or are interested in visiting our farm, our friendly team
          is here to help. Reach out to us through any of the channels below.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Contact Information</h2>
        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <h3>Customer Support</h3>
            <p><strong>Phone:</strong> (+254) 746-033-465</p>
            <p><strong>Email:</strong> info@charismafarm.com</p>
            <p><strong>Hours:</strong> Monday - Saturday, 7:00 AM - 6:00 PM EAT</p>
          </div>

          <div className={styles.contactItem}>
            <h3>Orders & Delivery</h3>
            <p><strong>Phone:</strong> (+254) 746-033-465</p>
            <p><strong>Email:</strong> orders@charismafarm.com</p>
            <p><strong>Hours:</strong> Monday - Sunday, 6:00 AM - 8:00 PM EAT</p>
          </div>

          <div className={styles.contactItem}>
            <h3>Farm Location</h3>
            <p>CharismaFarm</p>
            <p>Kiambu County, Kenya</p>
            <p><strong>Farm Visits:</strong> By appointment only</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Send Us a Message</h2>
        <p>
          Have a question or need assistance? Fill out the form below and we'll get back to you
          within 24 hours. For urgent orders, please call us directly.
        </p>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject *</label>
            <div className={styles.dropdownContainer}>
              <Dropdown
                options={subjectOptions}
                onSelect={handleSubjectSelect}
                dropPlaceHolder="Select a subject"
                value={selectedSubject}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="6"
              placeholder="Tell us how we can help you..."
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <p>Quick answers to common questions:</p>
        <ul className={styles.bulletList}>
          <li><strong>Delivery Areas:</strong> We deliver across Nairobi, Kiambu, and surrounding areas. Contact us for other locations.</li>
          <li><strong>Order Processing:</strong> Orders placed before 2 PM are processed same day for next-day delivery.</li>
          <li><strong>Free Delivery:</strong> Free delivery on orders above KSh 5,000 within Nairobi.</li>
          <li><strong>Farm Visits:</strong> We welcome farm visits by appointment. Contact us to schedule a tour.</li>
          <li><strong>Bulk Orders:</strong> Special pricing available for wholesale and bulk orders. Contact our sales team.</li>
          <li><strong>Payment Methods:</strong> We accept M-Pesa, bank transfers, and cash on delivery.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Follow Us</h2>
        <p>
          Stay connected with CharismaFarm on social media for farm updates, recipes, and special offers:
        </p>
        <ul className={styles.bulletList}>
          <li><strong>Instagram:</strong> @charismafarm</li>
          <li><strong>Facebook:</strong> CharismaFarm</li>
          <li><strong>TikTok:</strong> @charismafarm</li>
        </ul>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Response Time:</strong> We aim to respond to all inquiries within 24 hours.
          For urgent matters, please call us directly. Thank you for choosing CharismaFarm!
        </p>
      </div>
    </div>
  );
}
