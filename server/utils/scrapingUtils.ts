import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Event } from "../../shared/types/event";
import { formatDate } from "./dateUtils";

puppeteer.use(StealthPlugin());

export async function scrapeWebsite(
  url: string,
  selector: string
): Promise<Event[]> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreDefaultArgs: ["--disable-extensions"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const events: Event[] = await page.evaluate((selector) => {
      const data: Event[] = [];
      const articles = document.querySelectorAll(selector);

      articles.forEach((article) => {
        const dateElement = article.querySelector(
          ".mec-event-date .mec-start-date-label"
        );
        const titleElement = article.querySelector(
          "h4.mec-event-title a.mec-color-hover"
        );

        const imgElement = article.querySelector("img");
        const srcset = imgElement?.getAttribute("srcset") || "";

        const matches = [...srcset.matchAll(/\/([a-z]+)-\d+x\d+\.\w+/gi)];
        const logo = matches.length > 0 ? matches[0][1] : "";

        const date =
          dateElement instanceof HTMLElement
            ? dateElement.textContent?.trim() || ""
            : "";
        const title =
          titleElement instanceof HTMLElement
            ? titleElement.textContent?.trim() || ""
            : "";
        const link =
          titleElement instanceof HTMLAnchorElement
            ? titleElement.href || ""
            : "";

        data.push({ date, title, link, logo });
      });

      return data;
    }, selector);

    await browser.close();

    return events.map((event) => ({
      ...event,
      date: formatDate(event.date),
    }));
  } catch (error) {
    console.error("Error scraping data:", error);
    throw error;
  }
}
