#!/bin/bash

# ================================
# CodeLab Deployment Script
# ================================
# Run this script on your Hostinger VPS

set -e

echo "🚀 Starting CodeLab Deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found!"
    echo "Please copy .env.production.example to .env.production and fill in your values"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo "📦 Building Docker images..."
docker-compose --env-file .env.production build

echo "🛑 Stopping existing containers..."
docker-compose --env-file .env.production down

echo "🚀 Starting containers..."
docker-compose --env-file .env.production up -d

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🔧 Running database setup..."
docker exec codelab-backend node setup-tables-pg.js || true

echo "🌱 Running database seeding..."
docker exec codelab-backend node seed-data-pg.js || true

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌐 Your application is now available at:"
echo "   Frontend: http://YOUR_VPS_IP"
echo "   API:      http://YOUR_VPS_IP/api"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop:          docker-compose down"
echo "   Restart:       docker-compose restart"
