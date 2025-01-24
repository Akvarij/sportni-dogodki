import { Event } from "../../shared/types/event";
import { PrismaClient } from "@prisma/client";

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

export async function scrapeAndStoreData(): Promise<void> {
  try {
    const { scrapeWebsite } = await import("./scrapingUtils");
    const { SCRAPING_CONFIG } = await import("../config/scrapingConfig");

    const events = await scrapeWebsite(
      SCRAPING_CONFIG.url,
      SCRAPING_CONFIG.selector
    );

    for (const event of events) {
      await prisma.event.create({
        data: {
          date: event.date,
          title: event.title,
          link: event.link,
          category: event.category,
        },
      });
    }

    console.log(`Scraped and stored ${events.length} events.`);
  } catch (error) {
    console.error("Error in scrapeAndStoreData:", error);
  }
}

export async function closeDatabase(): Promise<void> {
  await prisma.$disconnect();

  console.log("Database connection closed.");
}
