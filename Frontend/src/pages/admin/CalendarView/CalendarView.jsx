// src/pages/admin/CalendarView.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Views } from "react-big-calendar";
import { format, parse, startOfWeek, parseISO, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./CalendarView.module.css";

// Localizer setup
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // FIXED: corrected function
  getDay,
  locales,
});

const CalendarView = () => {
  const [calendarType, setCalendarType] = useState("tours");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const endpoint =
        calendarType === "tours" ? "/api/tours" : "/api/bookings";
      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        const mapped = data.map((item) => ({
          id: item.id,
          title:
            calendarType === "tours"
              ? item.name
              : `Booking by ${item.customerName || "Unknown"}`,
          start: parseISO(item.datetime),
          end: parseISO(item.datetime),
          allDay: false,
          desc: item.description || item.notes || "",
        }));

        setEvents(mapped);
      } catch (err) {
        console.error("Error loading calendar data:", err);
      }
    };

    fetchEvents();
  }, [calendarType]);

  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}\n\nDetails: ${event.desc}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Calendar View</h2>

      <div className={styles.toggle}>
        <button
          className={
            calendarType === "tours" ? styles.activeBtn : styles.toggleBtn
          }
          onClick={() => setCalendarType("tours")}
        >
          Tour Calendar
        </button>
        <button
          className={
            calendarType === "bookings" ? styles.activeBtn : styles.toggleBtn
          }
          onClick={() => setCalendarType("bookings")}
        >
          Booking Calendar
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH} // FIXED: default view set
        style={{ height: 600, marginTop: "20px" }}
        onSelectEvent={handleSelectEvent}
        popup
      />
    </div>
  );
};

export default CalendarView;
