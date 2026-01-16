#!/bin/bash

echo "🚀 Starting Log Management Appliance..."

# ตรวจสอบว่า Docker ทำงานอยู่ไหม
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running."
  exit 1
fi

# รัน Docker Compose
docker-compose up -d --build

echo "✅ System is active!"
echo "📊 Dashboard: http://localhost"
echo "🔌 API Ingest: http://localhost:3000/ingest"