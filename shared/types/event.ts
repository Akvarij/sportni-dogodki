export interface Event {
  date: string;
  title: string;
  link: string;
  logo: string;
}

export interface GroupedEvents {
  [monthYear: string]: Event[];
}
