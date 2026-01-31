"use client";

import { useState } from "react";
import styles from "@/app/style/whatsapp.module.css";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";
import { IoClose as CloseIcon } from "react-icons/io5";

const WHATSAPP_NUMBER = "254746033465";

const QUICK_MESSAGES = [
  {
    id: 1,
    label: "Product Inquiry",
    message: "Hello! I'd like to know more about your products.",
  },
  {
    id: 2,
    label: "Place an Order",
    message: "Hi! I would like to place an order for fresh farm products.",
  },
  {
    id: 3,
    label: "Delivery Info",
    message: "Hello! I'd like to know about your delivery areas and timing.",
  },
  {
    id: 4,
    label: "Bulk Orders",
    message: "Hi! I'm interested in bulk/wholesale orders. Can you help?",
  },
];

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickMessage = (message) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
    setIsOpen(false);
  };

  const handleCustomMessage = (e) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    const encodedMessage = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
    setCustomMessage("");
    setIsOpen(false);
  };

  return (
    <div className={styles.whatsappContainer}>
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <WhatsappIcon className={styles.headerIcon} />
              <div>
                <h4>CharismaFarm</h4>
                <span>Typically replies instantly</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={handleToggle} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          <div className={styles.chatBody}>
            <div className={styles.welcomeMessage}>
              <p>Hello! 👋</p>
              <p>How can we help you today? Select a quick option or type your message below.</p>
            </div>

            <div className={styles.quickOptions}>
              {QUICK_MESSAGES.map((item) => (
                <button
                  key={item.id}
                  className={styles.quickOption}
                  onClick={() => handleQuickMessage(item.message)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomMessage} className={styles.messageForm}>
              <input
                type="text"
                placeholder="Type your message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className={styles.messageInput}
              />
              <button type="submit" className={styles.sendBtn} aria-label="Send message">
                <WhatsappIcon />
              </button>
            </form>
          </div>

          <div className={styles.chatFooter}>
            <p>Powered by <strong>WhatsApp</strong></p>
          </div>
        </div>
      )}

      <button
        className={`${styles.floatingBtn} ${isOpen ? styles.active : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        {isOpen ? <CloseIcon /> : <WhatsappIcon />}
      </button>

      {!isOpen && (
        <div className={styles.tooltip}>
          <span>Chat with us!</span>
        </div>
      )}
    </div>
  );
}
