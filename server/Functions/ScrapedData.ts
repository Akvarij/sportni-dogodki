import { Event } from "../../shared/types/events";
import { scrapeWebsite } from "../utils/scrapingUtils";
import { SCRAPING_CONFIG } from "../config/scrapingConfig";

export async function getScrapedData(): Promise<Event[]> {
  try {
    const events = await scrapeWebsite(
      SCRAPING_CONFIG.url,
      SCRAPING_CONFIG.selector
    );
    return events;
  } catch (error) {
    console.error("Error in getScrapedData:", error);
    return [];
  }
}
