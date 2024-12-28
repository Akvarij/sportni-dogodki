import MonthGroup from "./components/MonthGroup/MonthGroup";
import getEvents from "./hooks/getEvents";
import groupEventsByMonth from "./utils/eventUtils";
import "./App.css";

export default function App() {
  const { events, fetchEvents } = getEvents();

  const groupedEvents = groupEventsByMonth(events);

  return (
    <main id="page-container">
      {Object.entries(groupedEvents).map(([month, events]) => (
        <MonthGroup
          key={month}
          month={month}
          events={events}
        />
      ))}
      <button onClick={fetchEvents}>Scrape</button>
    </main>
  );
}
