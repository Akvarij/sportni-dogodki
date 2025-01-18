import SportCategory from "../SportCategory/SportCategory";
import { Event } from "../../../shared/types/event";

import "./MonthGroup.css";

export default function MonthGroup({
  month,
  events,
}: {
  month: string;
  events: Event[];
}) {
  return (
    <section className="month-group">
      <h3>{month}</h3>
      <ul>
        {events.map((event, index) => (
          <li
            key={index}
            className="event"
          >
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
            >
              <div className="icon">
                <SportCategory category={event.category} />
              </div>
              <div className="event-info">
                <h5>{event.date}</h5>
                <h4>{event.title}</h4>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
