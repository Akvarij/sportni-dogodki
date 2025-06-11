import { useState, useCallback } from "react";
import { Event } from "../../types/event";

const API = import.meta.env.VITE_API_URL;

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
      console.log(data);
      setEvents(data);
    } catch (err) {
      setError("Failed to fetch events.");
      console.error("Error fetching events:", err);
    }
  }, []);

  return { events, error, fetchEvents };
}
