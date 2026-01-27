module.exports = {
  apps: [
    {
      name: 'rss-frontend',
      script: 'npx',
      args: 'serve dist -s -p 5173',
      cwd: '/run/media/fekusa/Projects/Projects/RSS-feed',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'rss-backend',
      script: './server.js',
      cwd: '/run/media/fekusa/Projects/Projects/RSS-feed/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        DB_USER: 'fekusa',
        DB_PASSWORD: 'putri123',
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_NAME: 'postgres',
        CORS_ORIGINS: 'http://localhost:5173,https://rss.fekusadev.com'
      }
    }
  ]
}
