import { PiPersonSimpleBikeLight } from "react-icons/pi";

import "./MonthGroup.css";

interface Event {
  date: string;
  title: string;
  link: string;
}

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
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <li
              key={index}
              className="event"
            >
              <div className="icon">
                <PiPersonSimpleBikeLight size={30} />
              </div>
              <div className="event-info">
                <h5>{event.date}</h5>
                <h4>{event.title}</h4>
              </div>
            </li>
          </a>
        ))}
      </ul>
    </section>
  );
}
