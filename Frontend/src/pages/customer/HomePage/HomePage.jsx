import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

// Import images properly from the assets folder
import bannerImage from "../../../assets/banner.jpg";
import serengetiImage from "../../../assets/serengeti.jpg";
import kilimanjaroImage from "../../../assets/kilimanjaro.jpg";
import zanzibarImage from "../../../assets/zanzibar.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/book"); // ✅ Directs to the Booking Page
  };

  return (
    <div className={styles.home}>
      {/* Banner Section */}
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className={styles.overlay}>
          <h1 className={styles.title}>Explore Tanzania’s Best Tours</h1>
          <p className={styles.subtitle}>
            Your unforgettable adventure starts here.
          </p>
          <button onClick={handleBookNow} className={styles.bookBtn}>
            Book Now
          </button>
        </div>
      </div>

      {/* Top Destinations */}
      <section className={styles.section}>
        <h2>Top Destinations</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <img src={serengetiImage} alt="Serengeti" />
            <h3>Serengeti National Park</h3>
            <p>Witness the Great Migration and African wildlife.</p>
          </div>
          <div className={styles.card}>
            <img src={kilimanjaroImage} alt="Kilimanjaro" />
            <h3>Mount Kilimanjaro</h3>
            <p>Hike Africa’s highest peak and enjoy stunning views.</p>
          </div>
          <div className={styles.card}>
            <img src={zanzibarImage} alt="Zanzibar" />
            <h3>Zanzibar</h3>
            <p>Relax on white sand beaches with crystal-clear waters.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.section}>
        <h2>Why Choose Us</h2>
        <ul className={styles.bullets}>
          <li>Trusted by thousands of travelers</li>
          <li>Customizable tour packages</li>
          <li>Local expert guides</li>
          <li>Secure online payments</li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
