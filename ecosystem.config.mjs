export default {
  apps: [
    {
      name: 'sumtubebot',
      script: './dist/index.js',
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
