import { Event } from "../../types/event";
import { PrismaClient } from "@prisma/client";

import { scrapeWebsite } from "./scrapingUtils";
import { SCRAPING_CONFIG } from "../config/scrapingConfig";

const prisma = new PrismaClient();

export async function getScrapedData(): Promise<Event[]> {
  try {
    const events: Event[] = await prisma.event.findMany();
    return events;
  } catch (error) {
    console.error("Error in getScrapedData:", error);
    return [];
  }
}

export async function updateData() {
  try {
    await scrapeAndStoreData();
    console.log("Data updated successfully");

    await closeDatabase();
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

export async function scrapeAndStoreData(): Promise<void> {
  try {
    const existingEvents: Event[] = await prisma.event.findMany();
    const events = await scrapeWebsite(
      SCRAPING_CONFIG.url,
      SCRAPING_CONFIG.selector
    );

    const newEvents = events.filter(
      (item) =>
        !existingEvents.some(
          (existingEvent) =>
            existingEvent.title === item.title &&
            existingEvent.date === item.date
        )
    );

    for (const event of newEvents) {
      await prisma.event.create({
        data: {
          date: event.date,
          title: event.title,
          link: event.link,
          category: event.category,
        },
      });
    }

    console.log(`Scraped and stored ${newEvents.length} events.`);
  } catch (error) {
    console.error("Error in scrapeAndStoreData:", error);
  }
}

export async function closeDatabase(): Promise<void> {
  await prisma.$disconnect();

  console.log("Database connection closed.");
}
