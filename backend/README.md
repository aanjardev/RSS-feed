# RSS Feed Backend API

Backend API untuk RSS Feed Reader menggunakan Node.js, Express, dan PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database PostgreSQL dan update `.env` file

3. Run migration untuk membuat tables:
```bash
npm run db:migrate
```

4. Start server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Sources
- `GET /api/sources` - Get all RSS sources
- `GET /api/sources/:id` - Get source by ID
- `POST /api/sources` - Create new source
- `PUT /api/sources/:id` - Update source
- `DELETE /api/sources/:id` - Delete source

### Articles
- `GET /api/articles` - Get all articles (with pagination: ?limit=50&offset=0)
- `GET /api/articles?source_id=1` - Get articles filtered by source
- `GET /api/articles/source/:sourceId` - Get articles by source ID

### Health Check
- `GET /health` - Server health check

## Features

- ✅ Auto-fetch RSS feeds setiap 15 menit (configurable)
- ✅ PostgreSQL database dengan relational tables
- ✅ Duplicate detection (artikel yang sama tidak akan disimpan 2x)
- ✅ Auto cleanup artikel lama (>30 hari)
- ✅ CORS enabled untuk frontend
- ✅ Image extraction dari berbagai format RSS

## Environment Variables

Lihat file `.env` untuk konfigurasi database dan server.
