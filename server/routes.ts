import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startDiscordBot } from "./services/discord-bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get bot stats
  app.get("/api/bot/stats", async (req, res) => {
    try {
      // In a real implementation, you'd get actual bot stats
      const stats = {
        online: true,
        servers: 42, // This would be fetched from the actual bot
        uptime: "99.9%",
        summariesGenerated: 1337,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bot stats" });
    }
  });

  // API route to get recent summaries (for demo purposes)
  app.get("/api/summaries", async (req, res) => {
    try {
      // In a real implementation, you'd fetch from the database
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch summaries" });
    }
  });

  // Start Discord bot
  try {
    await startDiscordBot();
    console.log("Discord bot started successfully");
  } catch (error) {
    console.error("Failed to start Discord bot:", error);
  }

  const httpServer = createServer(app);
  return httpServer;
}
