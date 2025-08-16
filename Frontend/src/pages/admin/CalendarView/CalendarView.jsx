// src/pages/admin/CalendarView.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  parseISO,
  getDay,
  isValid,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./CalendarView.module.css";

// Localizer setup
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const isoToDateSafe = (isoStr) => {
  if (!isoStr) return null;
  try {
    const d = parseISO(isoStr);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
};

const toKey = (date) => {
  try {
    return format(date, "yyyy-MM-dd");
  } catch {
    return "";
  }
};

// Custom DateHeader with badge and tooltip
const DateHeader = ({ label, date, tourMap }) => {
  const key = toKey(date);
  const list = tourMap[key] || [];
  const count = list.length;
  const tooltip = list.length > 0 ? list.join("\n") : "";

  return (
    <div className={styles.dateHeader} title={tooltip}>
      <div className={styles.dateLabel}>{label}</div>
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </div>
  );
};

// Fixed Custom Toolbar
const CustomToolbar = ({ label, onNavigate, onView, view }) => (
  <div className={styles.customToolbar}>
    <div className={styles.leftGroup}>
      <button className={styles.navBtn} onClick={() => onNavigate("TODAY")}>
        Today
      </button>
      <button className={styles.navBtn} onClick={() => onNavigate("PREV")}>
        Back
      </button>
      <button className={styles.navBtn} onClick={() => onNavigate("NEXT")}>
        Next
      </button>
    </div>

    <div className={styles.centerLabel}>{label}</div>

    <div className={styles.rightGroup}>
      <button
        className={`${styles.navBtn} ${
          view === "month" ? styles.activeViewBtn : ""
        }`}
        onClick={() => onView("month")}
      >
        Month
      </button>
      <button
        className={`${styles.navBtn} ${
          view === "week" ? styles.activeViewBtn : ""
        }`}
        onClick={() => onView("week")}
      >
        Week
      </button>
      <button
        className={`${styles.navBtn} ${
          view === "day" ? styles.activeViewBtn : ""
        }`}
        onClick={() => onView("day")}
      >
        Day
      </button>
    </div>
  </div>
);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [tourMap, setTourMap] = useState({});
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");

  useEffect(() => {
    const savedView = localStorage.getItem("calendarView");
    if (savedView && ["month", "week", "day"].includes(savedView)) {
      setView(savedView);
    }

    const savedDate = localStorage.getItem("calendarDate");
    if (savedDate) {
      const parsedDate = parseISO(savedDate);
      if (isValid(parsedDate)) {
        setDate(parsedDate);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarView", view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("calendarDate", date.toISOString());
  }, [date]);

  const handleNavigate = useCallback((newDate) => setDate(newDate), []);
  const handleViewChange = useCallback((newView) => setView(newView), []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/admin/my-tours");
        if (!res.ok) return;
        const tours = await res.json();
        const tMap = {};
        const tourEvents = [];

        for (const t of tours) {
          const dt = isoToDateSafe(t.date ?? t.datetime ?? t.date_time);
          if (!dt) continue;
          const key = toKey(dt);
          if (!tMap[key]) tMap[key] = [];
          tMap[key].push(t.name ?? `Tour ${t.id}`);
          tourEvents.push({
            id: `tour-${t.id}`,
            title: t.name ?? "Tour",
            start: dt,
            end: dt,
            allDay: true,
          });
        }

        setTourMap(tMap);
        setEvents(tourEvents);
      } catch (err) {
        console.error("Error loading tours:", err);
      }
    };

    fetchTours();
  }, []);

  const tourSet = useMemo(() => new Set(Object.keys(tourMap)), [tourMap]);

  const dayPropGetter = (date) => {
    const key = toKey(date);
    if (tourSet.has(key)) {
      return {
        style: { backgroundColor: "rgba(78, 137, 255, 0.12)" },
        className: styles.tourDay,
      };
    }
    return {};
  };

  const handleSelectEvent = (event) => {
    /* No popups for tours */
    return;
  };

  const components = {
    toolbar: CustomToolbar,
    month: {
      dateHeader: (props) => <DateHeader {...props} tourMap={tourMap} />,
    },
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tour Calendar</h2>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ background: "rgba(78,137,255,0.4)" }}
          />
          <span>Tour dates</span>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        style={{ height: 600, marginTop: "20px" }}
        onSelectEvent={handleSelectEvent}
        popup={false}
        dayPropGetter={dayPropGetter}
        components={components}
      />
    </div>
  );
};

export default CalendarView;
