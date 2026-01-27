# Panduan Deploy ke Server

## Opsi 1: VPS (DigitalOcean, Linode, AWS EC2, dll) - Paling Fleksibel

### Persiapan Server
```bash
# 1. SSH ke server
ssh user@your-server-ip

# 2. Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx

# 3. Install Docker (opsional, untuk PostgreSQL)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Setup Database
```bash
# Opsi A: Gunakan Docker (recommended)
docker run -d \
  --name postgres-rss \
  -e POSTGRES_USER=fekusa \
  -e POSTGRES_PASSWORD=putri123 \
  -e POSTGRES_DB=rss_feed \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:17

# Opsi B: Gunakan PostgreSQL Native
sudo -u postgres psql
CREATE DATABASE rss_feed;
CREATE USER fekusa WITH PASSWORD 'putri123';
GRANT ALL PRIVILEGES ON DATABASE rss_feed TO fekusa;
\q
```

### Upload Project
```bash
# Di komputer lokal:
# 1. Buat file .env untuk production
cd /run/media/fekusa/Projects/Projects/RSS-feed/backend
cat > .env.production << EOF
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rss_feed
DB_USER=fekusa
DB_PASSWORD=putri123
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
EOF

# 2. Upload via rsync atau git
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /run/media/fekusa/Projects/Projects/RSS-feed/ \
  user@your-server-ip:~/rss-feed/

# Atau gunakan Git:
git init
git add .
git commit -m "Initial commit"
git push origin main

# Di server, clone repo:
cd ~
git clone https://your-repo-url rss-feed
```

### Setup Backend
```bash
cd ~/rss-feed/backend

# Install dependencies
npm install

# Copy environment file
cp .env.production .env

# Run migrations
npm run migrate

# Test backend
npm start

# Setup PM2 untuk auto-restart
sudo npm install -g pm2
pm2 start npm --name "rss-backend" -- start
pm2 save
pm2 startup
```

### Build & Setup Frontend
```bash
cd ~/rss-feed

# Install dependencies
npm install

# Build untuk production
npm run build

# Output ada di folder dist/
```

### Setup Nginx
```bash
# Buat config file
sudo nano /etc/nginx/sites-available/rss-feed

# Paste konfigurasi ini:
```
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (Svelte build)
    location / {
        root /home/user/rss-feed/dist;
        try_files $uri $uri/ /index.html;
        
        # Enable gzip
        gzip on;
        gzip_types text/css application/javascript application/json;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/rss-feed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL dengan Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Opsi 2: Railway.app - Paling Mudah & Gratis

### Step by Step
1. **Buat akun di Railway.app**
   - Daftar di https://railway.app
   - Connect GitHub account

2. **Push code ke GitHub**
```bash
cd /run/media/fekusa/Projects/Projects/RSS-feed
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/rss-feed.git
git push -u origin main
```

3. **Deploy di Railway**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repo RSS-feed
   - Railway otomatis detect Node.js

4. **Setup PostgreSQL**
   - Di dashboard project, klik "+ New"
   - Pilih "Database" → "PostgreSQL"
   - Copy connection string

5. **Setup Environment Variables**
   - Klik service backend
   - Buka tab "Variables"
   - Tambahkan:
     ```
     PORT=4000
     DATABASE_URL=postgresql://user:pass@host:port/db
     NODE_ENV=production
     FRONTEND_URL=https://your-app.railway.app
     ```

6. **Deploy Frontend Terpisah**
   - Buat service baru untuk frontend
   - Build command: `npm run build`
   - Start command: `npx serve -s dist -p $PORT`

---

## Opsi 3: Vercel (Frontend) + Render (Backend)

### Frontend di Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Di folder project
cd /run/media/fekusa/Projects/Projects/RSS-feed
vercel

# Ikuti wizard:
# - Framework: Vite
# - Build command: npm run build
# - Output: dist
```

### Backend di Render.com
1. Push code ke GitHub
2. Buat account di Render.com
3. New → Web Service
4. Connect repo
5. Settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
6. Tambahkan environment variables
7. Tambahkan PostgreSQL database (Free tier available)

---

## Opsi 4: Docker Compose - Full Stack

### Create docker-compose.yml di root project
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:17
    container_name: rss-postgres
    environment:
      POSTGRES_USER: fekusa
      POSTGRES_PASSWORD: putri123
      POSTGRES_DB: rss_feed
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Backend API
  backend:
    build: ./backend
    container_name: rss-backend
    environment:
      PORT: 4000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: rss_feed
      DB_USER: fekusa
      DB_PASSWORD: putri123
      FRONTEND_URL: http://localhost
    depends_on:
      - postgres
    ports:
      - "4000:4000"
    restart: unless-stopped

  # Frontend (Nginx)
  frontend:
    build: .
    container_name: rss-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### Create Dockerfile untuk frontend
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf untuk frontend
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Deploy dengan Docker
```bash
# Di server VPS
cd ~/rss-feed
docker-compose up -d

# Check logs
docker-compose logs -f

# Update aplikasi
git pull
docker-compose down
docker-compose up -d --build
```

---

## Checklist Sebelum Deploy

- [ ] Update CORS di backend untuk domain production
- [ ] Update API_BASE_URL di src/api.js untuk production
- [ ] Setup environment variables dengan benar
- [ ] Test database connection
- [ ] Run database migrations
- [ ] Build frontend dan test di local
- [ ] Setup monitoring (PM2, Railway logs, etc)
- [ ] Setup backup database
- [ ] Enable HTTPS/SSL
- [ ] Test semua fitur di production

---

## Update Environment Variables

### Backend (.env production)
```env
PORT=4000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=rss_feed
DB_USER=your-db-user
DB_PASSWORD=your-db-password
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

### Frontend (update src/api.js)
```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.your-domain.com'  // Production API
  : 'http://localhost:4000';        // Development API
```

---

## Rekomendasi

**Untuk pemula & gratis:**
→ **Railway.app** (Paling mudah, free tier bagus)

**Untuk kontrol penuh:**
→ **VPS + Docker** (Lebih murah untuk long-term)

**Untuk scalability:**
→ **Vercel + Render** (Auto-scaling, CDN built-in)

**Untuk development team:**
→ **Docker Compose** (Consistent environment)
