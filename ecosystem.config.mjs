export default {
  apps: [
    {
      name: 'sumtube-bot-api',
      script: './dist/index.js',
      node_args: '--env-file=.env',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || 3000
        // Environment variables will be loaded from system environment
        // Set these on your EC2 instance:
        // export DISCORD_BOT_TOKEN="your_actual_token"
        // export GEMINI_API_KEY="your_actual_key"
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
