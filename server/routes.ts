import type { Express } from "express";
import { createServer, type Server } from "http";
import { startDiscordBot } from "./services/discord-bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get bot stats
  app.get("/api/bot/stats", async (req, res) => {
    try {
      // Static bot stats since we don't track them anymore
      const stats = {
        online: true,
        servers: 42, // Static value for demo
        uptime: "99.9%",
        summariesGenerated: 1337, // Static value for demo
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bot stats" });
    }
  });

  // API route to get recent summaries (for demo purposes)
  app.get("/api/summaries", async (req, res) => {
    try {
      // Return empty array since we don't store summaries anymore
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
