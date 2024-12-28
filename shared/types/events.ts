export interface Event {
  date: string;
  title: string;
  link: string;
}

export interface GroupedEvents {
  [monthYear: string]: Event[];
}
