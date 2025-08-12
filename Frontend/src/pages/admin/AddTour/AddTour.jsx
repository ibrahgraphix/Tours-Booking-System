// src/pages/admin/AddTour.jsx
import React, { useState } from "react";
import styles from "./AddTour.module.css";

const AddTour = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    datetime: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = "Tour name is required";
    if (!formData.description) errs.description = "Description is required";
    if (!formData.price) errs.price = "Price is required";
    if (!formData.datetime) errs.datetime = "Date & Time is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const tourData = new FormData();
    tourData.append("name", formData.name);
    tourData.append("description", formData.description);
    tourData.append("price", formData.price);
    tourData.append("datetime", formData.datetime);
    if (formData.image) {
      tourData.append("image", formData.image);
    }

    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        body: tourData,
      });

      if (!res.ok) throw new Error("Failed to add tour");

      setSuccessMsg("Tour created successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        datetime: "",
        image: null,
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      setSuccessMsg("Something went wrong.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Tour</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Tour Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.field}>
          <label>Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={errors.description ? styles.errorInput : ""}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>Price (USD)*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? styles.errorInput : ""}
          />
          {errors.price && <span className={styles.error}>{errors.price}</span>}
        </div>

        <div className={styles.field}>
          <label>Date & Time*</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className={errors.datetime ? styles.errorInput : ""}
          />
          {errors.datetime && (
            <span className={styles.error}>{errors.datetime}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>Image (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Create Tour
        </button>

        {successMsg && <p className={styles.success}>{successMsg}</p>}
      </form>
    </div>
  );
};

export default AddTour;
