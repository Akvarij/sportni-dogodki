import express from "express";
import cors from "cors";
import { getScrapedData, scrapeAndStoreData } from "./utils/scrapedData";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function updateData() {
  try {
    await scrapeAndStoreData();
    console.log("Data updated successfully");
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

setInterval(updateData, 3600000);

updateData(); // Initial data update

app.get("/api/events", async (req, res) => {
  try {
    const events = await getScrapedData();
    res.json(events);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;

//  start the server if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
