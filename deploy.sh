#!/bin/bash

# RSS Feed Deployment Script
echo "🚀 RSS Feed Deployment Helper"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating from example..."
    cat > backend/.env << EOF
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rss_feed
DB_USER=fekusa
DB_PASSWORD=putri123
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
EOF
    echo "✅ Created backend/.env"
fi

echo ""
echo "Choose deployment method:"
echo "1. Railway.app (Easiest)"
echo "2. VPS with Docker"
echo "3. Build for production (manual deploy)"
echo "4. Development mode"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "📦 Railway Deployment"
        echo "===================="
        echo ""
        echo "Steps:"
        echo "1. Push code to GitHub:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo "   git remote add origin https://github.com/username/repo.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Go to https://railway.app"
        echo "3. Create new project from GitHub repo"
        echo "4. Add PostgreSQL database"
        echo "5. Set environment variables:"
        echo "   - DATABASE_URL (from PostgreSQL service)"
        echo "   - FRONTEND_URL (your Railway domain)"
        echo "   - NODE_ENV=production"
        echo ""
        echo "Railway will auto-deploy on git push!"
        ;;
    
    2)
        echo ""
        echo "🐳 Docker Deployment"
        echo "===================="
        echo ""
        
        # Check if docker-compose.yml exists
        if [ ! -f "docker-compose.yml" ]; then
            echo "Creating docker-compose.yml..."
            cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
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
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF
            echo "✅ Created docker-compose.yml"
        fi
        
        echo ""
        echo "Starting Docker containers..."
        docker-compose up -d
        
        echo ""
        echo "✅ Services started!"
        echo ""
        echo "Backend: http://localhost:4000"
        echo "Database: localhost:5432"
        echo ""
        echo "Check logs: docker-compose logs -f"
        echo "Stop services: docker-compose down"
        ;;
    
    3)
        echo ""
        echo "🏗️  Building for Production"
        echo "=========================="
        echo ""
        
        # Install backend dependencies
        echo "📦 Installing backend dependencies..."
        cd backend
        npm install
        cd ..
        
        # Install frontend dependencies
        echo "📦 Installing frontend dependencies..."
        npm install
        
        # Build frontend
        echo "🔨 Building frontend..."
        npm run build
        
        echo ""
        echo "✅ Build complete!"
        echo ""
        echo "Built files in: ./dist/"
        echo ""
        echo "To deploy to server:"
        echo "1. Upload dist/ folder and backend/ folder"
        echo "2. Setup PostgreSQL database"
        echo "3. Run: cd backend && npm install --production"
        echo "4. Run: npm run migrate"
        echo "5. Start backend: pm2 start npm --name rss-backend -- start"
        echo "6. Setup Nginx to serve dist/ folder"
        echo ""
        echo "See DEPLOYMENT.md for detailed guide"
        ;;
    
    4)
        echo ""
        echo "💻 Starting Development Mode"
        echo "==========================="
        echo ""
        
        # Check if PostgreSQL is running
        if ! nc -z localhost 5432 2>/dev/null; then
            echo "⚠️  PostgreSQL not running on port 5432"
            echo "Starting with Docker..."
            docker run -d \
                --name postgres-rss-dev \
                -e POSTGRES_USER=fekusa \
                -e POSTGRES_PASSWORD=putri123 \
                -e POSTGRES_DB=rss_feed \
                -p 5432:5432 \
                postgres:17
            
            echo "⏳ Waiting for PostgreSQL to start..."
            sleep 5
        fi
        
        # Start backend
        echo "🚀 Starting backend..."
        cd backend
        npm install
        npm run migrate
        npm start &
        BACKEND_PID=$!
        cd ..
        
        # Start frontend
        echo "🚀 Starting frontend..."
        npm install
        npm run dev &
        FRONTEND_PID=$!
        
        echo ""
        echo "✅ Development servers started!"
        echo ""
        echo "Frontend: http://localhost:5174"
        echo "Backend:  http://localhost:4000"
        echo ""
        echo "Press Ctrl+C to stop all services"
        
        # Wait for Ctrl+C
        trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
        wait
        ;;
    
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
