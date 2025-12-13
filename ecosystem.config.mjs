// PM2 Ecosystem Configuration
// Using relative paths - PM2 will resolve them relative to where the config file is located
export default {
  apps: [
    {
      name: 'sumtubebot',
      script: './dist/index.js',
      interpreter: 'node',
      interpreter_args: '--env-file=.env',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
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
