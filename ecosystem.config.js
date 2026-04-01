module.exports = {
  apps: [
    {
      name: 'venda-flow-dashboard',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true
    },
    {
      name: 'venda-flow-bot',
      script: 'index.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '800M'
    }
  ]
};
