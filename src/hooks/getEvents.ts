import { useState, useCallback } from "react";
import { Event } from "../../shared/types/events";

export default function getEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const result = await response.json();
      setEvents(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return { events, fetchEvents };
}
