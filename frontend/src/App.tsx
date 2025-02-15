import { useEffect, useState } from "react";
import MonthGroup from "./components/MonthGroup/MonthGroup";
import { useEvents } from "./hooks/useEvents";
import groupEventsByMonth from "./utils/eventUtils";
import "./App.css";
import FilterButtons from "./components/FilterButtons/FilterButtons";
import { Event } from "../types/event";

export default function App() {
  const { events, fetchEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const menuItems = [...new Set(events.map((event) => event.category))];

  const handleFilter = (category: string) => {
    if (category === "all" || category === activeFilter) {
      setActiveFilter("");
      setFilteredEvents(events);
    } else {
      const newFilteredEvents = events.filter(
        (event) => event.category === category
      );
      setActiveFilter(category);
      setFilteredEvents(newFilteredEvents);
    }
  };

  const groupedEvents = groupEventsByMonth(filteredEvents);

  return (
    <main id="page-container">
      <FilterButtons
        events={menuItems}
        setFilteredEvents={handleFilter}
        activeFilter={activeFilter}
      />
      {Object.entries(groupedEvents).map(([month, monthEvents]) => (
        <MonthGroup
          key={month}
          month={month}
          events={monthEvents as Event[]}
        />
      ))}
    </main>
  );
}
