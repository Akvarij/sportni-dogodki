export interface Event {
  date: string;
  title: string;
  link: string;
  category: string;
}

export interface GroupedEvents {
  [monthYear: string]: Event[];
}
