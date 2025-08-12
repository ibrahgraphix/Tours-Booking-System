import React from "react";
import styles from "./CustomerFooter.module.css";

const CustomerFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} TourConnect. All rights reserved.
        </p>
        <div className={styles.links}>
          <a href="/contact">Contact</a>
          <a href="/tours">Tours</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
