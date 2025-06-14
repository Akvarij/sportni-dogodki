import express from "express";
import cors from "cors";
import { CronJob } from "cron";
import { getScrapedData, updateData } from "./utils/databaseUtils";

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS with specific origins
app.use(
  cors({
    origin: [
      "https://sportni-dogodki-frontend-5821365f2d75.herokuapp.com",
      "http://localhost:3000",
      "http://localhost:5173", // for Vite dev server
    ],
    credentials: true,
  })
);

app.use(express.json());

// Root route
app.get("/", (_, res) => {
  res.json({
    message: "Sportni dogodki backend is running!",
    endpoints: [
      "GET /api/events - Get all events",
      "GET /health - Health check",
    ],
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get("/health", (_, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Events API route
app.get("/api/events", async function (_, res) {
  try {
    console.log("Fetching events data...");
    const events = await getScrapedData();
    console.log(`Returning ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Initialize data and start cron job
console.log("Starting initial data update...");
updateData();

// Run daily at 8 AM
console.log("Setting up cron job for daily updates at 8 AM...");
new CronJob(
  "0 8 * * *",
  () => {
    console.log("Running scheduled data update...");
    updateData();
  },
  null,
  true
);

// Start server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
