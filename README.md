# 📰 RSS Feed Aggregator

Modern RSS feed aggregator for Indonesian news sources built with Svelte 5, Node.js, Express, and PostgreSQL.

## ✨ Features

- 🚀 **Real-time RSS Scraping** - Auto-scrapes 18+ Indonesian news sources every 15 minutes
- 🎨 **Modern UI** - Built with Svelte 5 (Runes), TailwindCSS, and DaisyUI
- 🔍 **Smart Search** - Filter news sources in sidebar
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎯 **Auto-scroll Navigation** - Click source in sidebar to scroll to content
- 🖼️ **Logo Integration** - Each source displays with official logo
- 🔗 **Direct Links** - Click any article to read on original website
- ⚡ **High Performance** - 98% Lighthouse score on desktop

## 🏗️ Tech Stack

**Frontend:**
- Svelte 5.48.3 (Runes mode)
- Vite 7.3.1
- TailwindCSS 4.1.18
- DaisyUI 5.5.14

**Backend:**
- Node.js + Express
- PostgreSQL 17 (Docker)
- rss-parser 3.13.0
- node-cron 3.0.3

**Infrastructure:**
- Docker & Docker Compose
- Nginx (production)
- PM2 (process manager)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker (for PostgreSQL)
- npm or yarn

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd RSS-feed

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Database
```bash
# Start PostgreSQL with Docker
docker run -d \
  --name postgres-rss \
  -e POSTGRES_USER=fekusa \
  -e POSTGRES_PASSWORD=putri123 \
  -e POSTGRES_DB=rss_feed \
  -p 5432:5432 \
  postgres:17

# Run migrations
cd backend
npm run migrate
cd ..
```

### 3. Configure Environment
```bash
# Backend .env
cp backend/.env.example backend/.env
# Edit backend/.env dengan kredensial database Anda

# Frontend .env (optional untuk development)
cp .env.example .env
```

### 4. Start Development Servers
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

Visit: http://localhost:5174

## 📦 Deployment

### Easy Deployment Script
```bash
./deploy.sh
```

Pilih opsi:
1. **Railway.app** - Paling mudah, free tier
2. **VPS + Docker** - Full control
3. **Build Production** - Manual deploy
4. **Development** - Local development

### Manual Deployment

#### Option 1: Railway.app (Recommended)
1. Push code ke GitHub
2. Buat account di [Railway.app](https://railway.app)
3. Deploy from GitHub
4. Add PostgreSQL database
5. Set environment variables
6. Railway auto-deploy!

#### Option 2: VPS (DigitalOcean, Linode, etc)
```bash
# 1. Build frontend
npm run build

# 2. Setup server (Ubuntu/Debian)
ssh user@server
sudo apt install nodejs npm postgresql nginx

# 3. Upload files
rsync -avz dist/ user@server:/var/www/rss-feed/
rsync -avz backend/ user@server:~/rss-backend/

# 4. Setup backend
cd ~/rss-backend
npm install --production
npm run migrate
pm2 start npm --name rss-backend -- start

# 5. Configure Nginx (see DEPLOYMENT.md)
```

#### Option 3: Docker Compose
```bash
# Deploy full stack dengan satu command
docker-compose up -d
```

**Panduan lengkap:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
RSS-feed/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── migrations/         # SQL migrations
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   ├── services/           # RSS fetcher service
│   └── server.js           # Entry point
├── src/                    # Svelte frontend
│   ├── components/         # UI components
│   ├── assets/            # Images, logos
│   ├── api.js             # API client
│   ├── App.svelte         # Main component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── dist/                  # Production build (generated)
├── rss-feeds.json         # RSS sources metadata
├── deploy.sh              # Deployment helper
└── DEPLOYMENT.md          # Detailed deployment guide
```

## 🗄️ Database Schema

### rss_sources
```sql
id, name, url, logo, description, category, is_active
```

### rss_articles
```sql
id, source_id, title, link, description, pub_date, 
content, image_url, author, created_at
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rss_feed
DB_USER=fekusa
DB_PASSWORD=putri123
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000  # Production API URL
```

## 📰 News Sources

18 Indonesian media outlets:
- Tempo (News, Bisnis, Tekno, Olahraga, Travel)
- CNN Indonesia (News, Ekonomi)
- CNBC Indonesia
- Detik (News, Finance)
- Liputan6
- Tribunnews
- Antara News
- Kontan
- Bisnis Indonesia

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm start            # Start server
npm run migrate      # Run database migrations
npm run dev          # Start with nodemon
```

### Adding New RSS Source

1. Edit `rss-feeds.json`:
```json
{
  "id": 19,
  "name": "Source Name",
  "url": "https://source.com/rss",
  "logo": "https://source.com/logo.png",
  "description": "Description",
  "category": "news"
}
```

2. Run update script:
```bash
cd backend
node scripts/updateSources.js
```

## 🐛 Troubleshooting

**CORS Error:**
- Check `FRONTEND_URL` in backend `.env`
- Verify port numbers match

**Database Connection:**
```bash
# Check if PostgreSQL running
docker ps | grep postgres

# View logs
docker logs postgres-rss

# Restart container
docker restart postgres-rss
```

**Build Error:**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
npm run build
```

## 📈 Performance

- **Desktop:** 98% Lighthouse score
- **Mobile:** Optimized with lazy loading
- **Bundle Size:** < 500KB (gzipped)
- **API Response:** < 100ms average

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- RSS feeds from Indonesian media outlets
- Logos from [tilikfeed.com](https://tilikfeed.com)
- Built with ❤️ using modern web technologies

---

**Made with ☕ in Indonesia**
