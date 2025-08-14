// src/pages/admin/AddTour.jsx
import React, { useState } from "react";
import styles from "./addtour.module.css";

const AddTour = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    datetime: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Tour name is required";
    if (!formData.description)
      tempErrors.description = "Description is required";
    if (!formData.price) tempErrors.price = "Price is required";
    if (!formData.datetime) tempErrors.datetime = "Date is required";
    if (!formData.image) tempErrors.image = "Image is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tourData = new FormData();
    tourData.append("name", formData.name);
    tourData.append("description", formData.description);
    tourData.append("price", formData.price);
    tourData.append("datetime", formData.datetime);
    tourData.append("image", formData.image);

    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        body: tourData,
      });

      if (res.ok) {
        setSuccessMessage("Tour added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          datetime: "",
          image: null,
        });
        setErrors({});
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to add tour");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Tour</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name */}
        <div className={styles.field}>
          <label>Tour Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? styles.errorInput : ""}
          />
          {errors.description && (
            <div className={styles.error}>{errors.description}</div>
          )}
        </div>

        {/* Price */}
        <div className={styles.field}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? styles.errorInput : ""}
          />
          {errors.price && <div className={styles.error}>{errors.price}</div>}
        </div>

        {/* Date */}
        <div className={styles.field}>
          <label>Date & Time</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className={errors.datetime ? styles.errorInput : ""}
          />
          {errors.datetime && (
            <div className={styles.error}>{errors.datetime}</div>
          )}
        </div>

        {/* Image Upload */}
        <div className={styles.field}>
          <label>Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={errors.image ? styles.errorInput : ""}
          />
          {errors.image && <div className={styles.error}>{errors.image}</div>}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Add Tour
        </button>

        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default AddTour;
