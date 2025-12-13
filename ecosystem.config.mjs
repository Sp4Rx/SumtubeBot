import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve script path relative to config file location
const scriptPath = resolve(__dirname, 'dist/index.js');

export default {
  apps: [
    {
      name: 'sumtubebot',
      script: scriptPath,
      cwd: __dirname,
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
      error_file: resolve(__dirname, 'logs/err.log'),
      out_file: resolve(__dirname, 'logs/out.log'),
      log_file: resolve(__dirname, 'logs/combined.log'),
      time: true,
      restart_delay: 5000,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
