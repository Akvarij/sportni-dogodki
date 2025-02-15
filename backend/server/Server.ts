import express from "express";
import cors from "cors";
import path from "path";
import { CronJob } from "cron";
import { getScrapedData, updateData } from "./utils/databaseUtils";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

updateData();
new CronJob("0 8 * * *", updateData, null, true);

app.get("/api/events", async function (_, res) {
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
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log("Server running at port", port);
  });
}
