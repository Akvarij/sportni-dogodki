export function formatDate(dateString: string): string {
  const parts = dateString.split(" ");

  if (parts.length === 3) {
    return formatSingleDayEvent(parts);
  } else if (parts.length === 5) {
    return formatMultiDayEvent(parts);
  } else {
    console.warn(`Unexpected date format: ${dateString}`);
    return dateString;
  }
}

function formatSingleDayEvent(parts: string[]): string {
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);

  return formatDateToLocale(date);
}

function formatMultiDayEvent(parts: string[]): string {
  const [startDay, , endDay, month, year] = parts;
  const startDate = new Date(Number(year), Number(month) - 1, Number(startDay));
  const endDate = new Date(Number(year), Number(month) - 1, Number(endDay));

  const startFormatted = startDate.toLocaleDateString("sl-SI", {
    day: "numeric",
  });
  const endFormatted = formatDateToLocale(endDate);

  return `${startFormatted} - ${endFormatted}`;
}

function formatDateToLocale(date: Date): string {
  return date.toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
