import "./FilterButtons.css";

interface FilterButtonsProps {
  events: string[];
  setFilteredEvents: (category: string) => void;
}

export default function FilterButtons({
  events,
  setFilteredEvents,
}: FilterButtonsProps) {
  return (
    <div className="filter-container">
      {events.map((event, index) => (
        <button
          className="filter-button"
          key={index}
          onClick={() => setFilteredEvents(event)}
        >
          <h4>{event}</h4>
        </button>
      ))}
      <button
        className="filter-button"
        onClick={() => setFilteredEvents("all")}
      >
        <h4>all</h4>
      </button>
    </div>
  );
}
