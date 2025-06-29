import { users, videoSummaries, discordServers, type User, type InsertUser, type VideoSummary, type InsertVideoSummary, type DiscordServer, type InsertDiscordServer } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVideoSummary(videoId: string): Promise<VideoSummary | undefined>;
  createVideoSummary(summary: InsertVideoSummary): Promise<VideoSummary>;
  
  getDiscordServer(serverId: string): Promise<DiscordServer | undefined>;
  createDiscordServer(server: InsertDiscordServer): Promise<DiscordServer>;
  updateServerRateLimit(serverId: string, count: number): Promise<void>;
  resetServerRateLimit(serverId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videoSummaries: Map<string, VideoSummary>;
  private discordServers: Map<string, DiscordServer>;
  private currentUserId: number;
  private currentSummaryId: number;
  private currentServerId: number;

  constructor() {
    this.users = new Map();
    this.videoSummaries = new Map();
    this.discordServers = new Map();
    this.currentUserId = 1;
    this.currentSummaryId = 1;
    this.currentServerId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getVideoSummary(videoId: string): Promise<VideoSummary | undefined> {
    return this.videoSummaries.get(videoId);
  }

  async createVideoSummary(insertSummary: InsertVideoSummary): Promise<VideoSummary> {
    const id = this.currentSummaryId++;
    const summary: VideoSummary = {
      ...insertSummary,
      id,
      createdAt: new Date(),
    };
    this.videoSummaries.set(insertSummary.videoId, summary);
    return summary;
  }

  async getDiscordServer(serverId: string): Promise<DiscordServer | undefined> {
    return this.discordServers.get(serverId);
  }

  async createDiscordServer(insertServer: InsertDiscordServer): Promise<DiscordServer> {
    const id = this.currentServerId++;
    const server: DiscordServer = {
      ...insertServer,
      id,
      isActive: insertServer.isActive ?? true,
      rateLimitCount: insertServer.rateLimitCount ?? 0,
      lastResetTime: new Date(),
    };
    this.discordServers.set(insertServer.serverId, server);
    return server;
  }

  async updateServerRateLimit(serverId: string, count: number): Promise<void> {
    const server = this.discordServers.get(serverId);
    if (server) {
      server.rateLimitCount = count;
      this.discordServers.set(serverId, server);
    }
  }

  async resetServerRateLimit(serverId: string): Promise<void> {
    const server = this.discordServers.get(serverId);
    if (server) {
      server.rateLimitCount = 0;
      server.lastResetTime = new Date();
      this.discordServers.set(serverId, server);
    }
  }
}

export const storage = new MemStorage();
