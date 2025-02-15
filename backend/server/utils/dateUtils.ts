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
  if (parts.length !== 3) {
    throw new Error("Invalid input: expected [day, month, year]");
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error("Invalid date parts: non-numeric values found");
  }

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
