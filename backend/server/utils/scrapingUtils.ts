import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Event } from "../../types/event";
import { formatDate } from "./dateUtils";

puppeteer.use(StealthPlugin());

export async function scrapeWebsite(
  url: string,
  selector: string
): Promise<Event[]> {
  let browser;
  try {
    // Configure Puppeteer for Heroku deployment
    const launchOptions: any = {
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--deterministic-fetch",
        "--disable-features=VizDisplayCompositor",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-web-security",
        "--disable-extensions",
      ],
    };

    // Try multiple possible Chrome paths
    const possibleChromePaths = [
      process.env.GOOGLE_CHROME_BIN,
      process.env.CHROME_BIN,
      "/app/.chrome-for-testing/chrome-linux64/chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/opt/google/chrome/chrome",
    ];

    console.log("Checking Chrome paths:");
    possibleChromePaths.forEach((path, index) => {
      console.log(`${index + 1}. ${path || "undefined"}`);
    });

    const chromePath = possibleChromePaths.find((path) => path);

    if (chromePath) {
      launchOptions.executablePath = chromePath;
      console.log("Using Chrome at:", chromePath);
    } else {
      console.log(
        "No Chrome executable found. Trying without executablePath..."
      );
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const events: Event[] = await page.evaluate((selector) => {
      const articles = document.querySelectorAll(selector);
      return Array.from(articles).map((article) => {
        const dateElement = article.querySelector(
          ".mec-event-date .mec-start-date-label"
        );
        const titleElement = article.querySelector(
          "h4.mec-event-title a.mec-color-hover"
        );
        const imgElement = article.querySelector("img");
        const srcset = imgElement?.getAttribute("srcset") || "";

        const matches = [...srcset.matchAll(/\/([a-z]+)-\d+x\d+\.\w+/gi)];
        const category =
          matches.length > 0 && matches[0] && matches[0][1]
            ? matches[0][1]
            : "";

        return {
          date:
            dateElement instanceof HTMLElement
              ? dateElement.textContent?.trim() || ""
              : "",
          title:
            titleElement instanceof HTMLElement
              ? titleElement.textContent?.trim() || ""
              : "",
          link:
            titleElement instanceof HTMLAnchorElement
              ? titleElement.href || ""
              : "",
          category: category || "",
        };
      });
    }, selector);

    return events.map((event) => ({
      ...event,
      date: formatDate(event.date),
    }));
  } catch (error) {
    console.error("Error scraping data:", error);

    // Log environment info for debugging
    console.log("Environment variables:");
    console.log("GOOGLE_CHROME_BIN:", process.env.GOOGLE_CHROME_BIN);
    console.log("CHROME_BIN:", process.env.CHROME_BIN);
    console.log("NODE_ENV:", process.env.NODE_ENV);

    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
