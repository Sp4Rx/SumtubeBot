import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

// Environment variables are automatically loaded by Node.js 20+ with --env-file flag

// Validate required environment variables at startup
function validateEnvironmentVariables(): void {
  const requiredVars = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    VITE_DISCORD_APPLICATION_ID: process.env.VITE_DISCORD_APPLICATION_ID,
  };

  const missing: string[] = [];
  const empty: string[] = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (value === undefined) {
      missing.push(key);
    } else if (value.trim() === '') {
      empty.push(key);
    }
  }

  if (missing.length > 0 || empty.length > 0) {
    console.error('❌ CRITICAL: Missing or empty required environment variables!');
    console.error('');
    
    if (missing.length > 0) {
      console.error('🔴 Missing variables (not set):');
      missing.forEach(key => console.error(`   ${key}: ❌ NOT SET`));
      console.error('');
    }
    
    if (empty.length > 0) {
      console.error('🟡 Empty variables (set but empty):');
      empty.forEach(key => console.error(`   ${key}: ❌ EMPTY`));
      console.error('');
    }

    console.error('📋 Current environment check:');
    console.error(`   NODE_ENV: ${process.env.NODE_ENV || '❌ NOT SET'}`);
    console.error(`   PORT: ${process.env.PORT || '❌ NOT SET'}`);
    console.error(`   DISCORD_BOT_TOKEN: ${process.env.DISCORD_BOT_TOKEN ? '✅ SET' : '❌ NOT SET'}`);
    console.error(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? `✅ SET (length: ${process.env.GEMINI_API_KEY.length})` : '❌ NOT SET'}`);
    console.error(`   VITE_DISCORD_APPLICATION_ID: ${process.env.VITE_DISCORD_APPLICATION_ID ? '✅ SET' : '❌ NOT SET'}`);
    console.error('');
    console.error('💡 Make sure your .env file exists and contains all required variables.');
    console.error('💡 If using PM2, ensure env_file is configured correctly in ecosystem.config.mjs');
    console.error('💡 Restart the service after updating .env file');
    console.error('');

    const errorMsg = `Missing required environment variables: ${[...missing, ...empty].join(', ')}`;
    throw new Error(errorMsg);
  }

  // Log successful validation (mask sensitive data)
  const apiKey = process.env.GEMINI_API_KEY!;
  const maskedGeminiKey = apiKey.length > 8 
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : '***';
  
  // Also log first 10 and last 10 chars for verification (helps identify if wrong key is loaded)
  const verificationPreview = apiKey.length > 20
    ? `first10: ${apiKey.substring(0, 10)}, last10: ${apiKey.substring(apiKey.length - 10)}`
    : 'too short';
  
  console.log('✅ Environment variables validated successfully');
  console.log(`   DISCORD_BOT_TOKEN: ✅ SET`);
  console.log(`   GEMINI_API_KEY: ✅ SET (length: ${apiKey.length}, preview: ${maskedGeminiKey})`);
  console.log(`   GEMINI_API_KEY verification: ${verificationPreview}`);
  console.log(`   VITE_DISCORD_APPLICATION_ID: ✅ SET`);
  console.log('');
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api") || path === '/health') {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error('Server error:', err);
  res.status(status).json({ message });
});

(async () => {
  // Validate environment variables before starting anything
  console.log('🔍 Validating environment variables...');
  try {
    validateEnvironmentVariables();
  } catch (error: any) {
    console.error('💥 Startup failed due to missing environment variables');
    process.exit(1);
  }

  // Register API routes and start Discord bot
  const server = await registerRoutes(app);

  // Start server
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 SumTube Bot API server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Server ready - no CORS needed (static frontend)`);
  });
})();
