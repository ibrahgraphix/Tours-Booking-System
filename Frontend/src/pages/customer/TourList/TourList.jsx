import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./tourlist.module.css";

const TourList = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tours");
        if (!res.ok) throw new Error("Failed to fetch tours");
        const data = await res.json();
        setTours(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTours();
  }, []);

  const handleBookNow = (tour) => {
    // Store selected tour object in localStorage for BookingForm
    localStorage.setItem("selectedTour", JSON.stringify(tour));
    navigate("/book"); // Updated to match your router path
  };

  return (
    <div className={styles.tourList}>
      {tours.length === 0 ? (
        <p className={styles.empty}>No tours available at the moment.</p>
      ) : (
        tours.map((tour) => (
          <div className={styles.card} key={tour.id}>
            {tour.image_url && (
              <img
                src={tour.image_url}
                alt={tour.name}
                className={styles.image}
              />
            )}
            <div className={styles.info}>
              <h2>{tour.name}</h2>
              <p className={styles.description}>
                {tour.description.length > 80
                  ? tour.description.substring(0, 80) + "..."
                  : tour.description}
              </p>
              <p className={styles.date}>
                📅 {new Date(tour.date).toLocaleDateString()}{" "}
                {new Date(tour.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className={styles.price}>💲 {tour.price}</p>
              <button
                className={styles.bookBtn}
                onClick={() => handleBookNow(tour)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TourList;
