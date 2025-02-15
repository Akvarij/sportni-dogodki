import { Event, GroupedEvents } from "../../types/event";

const monthNames = [
  "januar",
  "februar",
  "marec",
  "april",
  "maj",
  "junij",
  "julij",
  "avgust",
  "september",
  "oktober",
  "november",
  "december",
];

export default function groupEventsByMonth(events: Event[]): GroupedEvents {
  return events.reduce((groups, event) => {
    const parts = event.date.split(" ");
    let month: number, year: number;

    if (parts.length === 3) {
      // Single day event: "07 julij 2025"
      [, , year] = parts.map(Number);
      month = monthNames.indexOf(parts[1]);
    } else if (parts.length === 5) {
      // Multi-day event: "07 - 08 julij 2025"
      [, , , , year] = parts.map(Number);
      month = monthNames.indexOf(parts[3]);
    } else {
      console.warn(`Unexpected date format: ${event.date}`);
      return groups;
    }

    if (month === -1 || isNaN(year)) {
      console.warn(`Invalid month or year in date: ${event.date}`);
      return groups;
    }

    const date = new Date(year, month, 1);
    const monthYear = date.toLocaleDateString("sl-SI", {
      month: "long",
      year: "numeric",
    });

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as GroupedEvents);
}
