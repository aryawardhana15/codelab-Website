#!/bin/bash

# SSL Setup Script for CodeLab
# Run this on VPS after deploying

DOMAIN="codelabstudio.cloud"
EMAIL="aryawardhana1@student.ub.ac.id"

echo "🔒 Setting up SSL for $DOMAIN..."

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    apt update
    apt install -y certbot
fi

# Stop nginx to free port 80
echo "⏹️ Stopping nginx container..."
docker stop codelab-nginx

# Get SSL certificate
echo "🔐 Getting SSL certificate..."
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Start nginx with SSL
echo "▶️ Starting nginx with SSL..."
docker start codelab-nginx

echo ""
echo "✅ SSL Setup Complete!"
echo "🌐 Website: https://$DOMAIN"
echo ""
echo "⚠️ If nginx fails to start, run:"
echo "   docker-compose build --no-cache nginx"
echo "   docker-compose up -d nginx"
