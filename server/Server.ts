import express from "express";
import cors from "cors";
import { getScrapedData } from "./functions/ScrapedData";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/events", async (req, res) => {
  try {
    const events = await getScrapedData();
    res.json(events);
  } catch (error) {
    console.error("Error fetching scraped data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
