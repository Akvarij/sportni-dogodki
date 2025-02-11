import { useState, useCallback } from "react";
import { Event } from "../../shared/types/event";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setError(null);

    try {
      const response = await fetch(`${API}/api/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to fetch events.");
      console.error("Error fetching events:", err);
    }
  }, []);

  return { events, error, fetchEvents };
}
