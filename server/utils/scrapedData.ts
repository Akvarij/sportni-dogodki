import { Event } from "../../shared/types/event";
import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

let db: Database | null = null;

async function getDatabase(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: "scraper_data.db",
      driver: sqlite3.Database,
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS scraped_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      title TEXT,
      link TEXT,
      category TEXT
    )`);
  }
  return db;
}

export async function getScrapedData(): Promise<Event[]> {
  try {
    const db = await getDatabase();
    const events: Event[] = await db.all("SELECT * FROM scraped_data");
    return events;
  } catch (error) {
    console.error("Error in getScrapedData:", error);
    return [];
  }
}

export async function scrapeAndStoreData(): Promise<void> {
  try {
    const db = await getDatabase();

    const { scrapeWebsite } = await import("./scrapingUtils");
    const { SCRAPING_CONFIG } = await import("../config/scrapingConfig");

    const events = await scrapeWebsite(
      SCRAPING_CONFIG.url,
      SCRAPING_CONFIG.selector
    );

    // Batch insert
    const stmt = await db.prepare(
      `INSERT INTO scraped_data (date, title, link, category) VALUES (?, ?, ?, ?)`
    );

    await db.run("BEGIN TRANSACTION");
    for (const event of events) {
      await stmt.run(event.date, event.title, event.link, event.category);
    }
    await db.run("COMMIT");

    await stmt.finalize();

    console.log(`Scraped and stored ${events.length} events.`);
  } catch (error) {
    console.error("Error in scrapeAndStoreData:", error);
    if (db) await db.run("ROLLBACK");
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log("Closed the database connection.");
  }
}
