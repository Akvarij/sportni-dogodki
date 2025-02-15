import "./FilterButtons.css";

interface FilterButtonsProps {
  events: string[];
  setFilteredEvents: (category: string) => void;
  activeFilter?: string; // optional prop to highlight the active filter button
}

export default function FilterButtons({
  events,
  setFilteredEvents,
  activeFilter,
}: FilterButtonsProps) {
  return (
    <div className="filter-container">
      {events.map((event, index) => (
        <button
          className={activeFilter === event ? "isActive" : "filter-button"}
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
