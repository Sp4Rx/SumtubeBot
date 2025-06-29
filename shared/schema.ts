import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videoSummaries = pgTable("video_summaries", {
  id: serial("id").primaryKey(),
  videoId: text("video_id").notNull().unique(),
  videoTitle: text("video_title").notNull(),
  videoUrl: text("video_url").notNull(),
  summary: text("summary").notNull(),
  keyPoints: text("key_points").array().notNull(),
  timestamps: text("timestamps").array().notNull(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discordServers = pgTable("discord_servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().unique(),
  serverName: text("server_name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  rateLimitCount: integer("rate_limit_count").default(0).notNull(),
  lastResetTime: timestamp("last_reset_time").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoSummarySchema = createInsertSchema(videoSummaries).omit({
  id: true,
  createdAt: true,
});

export const insertDiscordServerSchema = createInsertSchema(discordServers).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type VideoSummary = typeof videoSummaries.$inferSelect;
export type InsertVideoSummary = z.infer<typeof insertVideoSummarySchema>;
export type DiscordServer = typeof discordServers.$inferSelect;
export type InsertDiscordServer = z.infer<typeof insertDiscordServerSchema>;
