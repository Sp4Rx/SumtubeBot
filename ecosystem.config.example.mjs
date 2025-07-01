// Example PM2 configuration with environment variables
// Copy this to ecosystem.config.local.mjs and fill in your actual values
// DO NOT commit ecosystem.config.local.mjs to git

export default {
  apps: [
    {
      name: 'sumtube-bot-api',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DISCORD_BOT_TOKEN: 'your_actual_discord_bot_token_here',
        GEMINI_API_KEY: 'your_actual_gemini_api_key_here'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      restart_delay: 5000,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
