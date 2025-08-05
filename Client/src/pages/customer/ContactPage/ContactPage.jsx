import React, { useState } from "react";
import styles from "./ContactPage.module.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Simulate success
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>

      <div className={styles.wrapper}>
        {/* Contact Form */}
        <div className={styles.formSection}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit">Send Message</button>
            </form>
          ) : (
            <div className={styles.thankYou}>
              <h2>🎉 Thank You!</h2>
              <p>We’ve received your message and will get back to you soon.</p>
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className={styles.infoSection}>
          <h3>Our Office</h3>
          <p>📍 Arusha, Tanzania</p>
          <p>📞 +255 123 456 789</p>
          <p>✉️ info@tourconnect.co.tz</p>

          <h4>Follow Us</h4>
          <div className={styles.socials}>
            <a href="#">🌐 Facebook</a>
            <a href="#">📷 Instagram</a>
            <a href="#">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
