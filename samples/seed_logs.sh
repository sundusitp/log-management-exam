#!/bin/bash

API_URL="http://localhost:3000/ingest"

echo "🚀 Starting Log Seeder: Sending logs to $API_URL..."

echo "☁️  Sending AWS CloudTrail Logs..."
curl -s -X POST $API_URL -H "Content-Type: application/json" \
-d '{
  "tenant": "tenant-A",
  "source": "aws",
  "event_type": "ConsoleLogin",
  "user": "admin",
  "severity": 1,
  "metadata": {"region": "ap-southeast-1", "service": "iam"}
}' > /dev/null

echo "🔐 Sending Windows AD (Login Failed Attack)..."
for i in {1..3}; do
  curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{
    "tenant": "tenant-A",
    "source": "ad",
    "event_type": "login_failed",
    "event_id": 4625,
    "user": "hacker",
    "severity": 8,
    "metadata": {"workstation": "HR-PC-01", "ip": "192.168.1.100"}
  }' > /dev/null
done

echo "🔥 Sending Firewall Critical Alert (Malware)..."
curl -s -X POST $API_URL -H "Content-Type: application/json" \
-d '{
  "tenant": "tenant-A",
  "source": "firewall",
  "event_type": "malware_detected",
  "user": "system",
  "severity": 9,
  "metadata": {"ip": "10.0.1.50", "action": "block", "threat": "Trojan.Win32"}
}' > /dev/null

echo "📧 Sending Office 365 Logs..."
curl -s -X POST $API_URL -H "Content-Type: application/json" \
-d '{
  "tenant": "tenant-A",
  "source": "m365",
  "event_type": "FileAccessed",
  "user": "somchai@company.com",
  "severity": 1,
  "metadata": {"file": "salary_report.xlsx"}
}' > /dev/null

echo "📈 Sending Bulk Traffic (API Requests)..."
for i in {1..10}; do
  curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"tenant": "tenant-A", "source": "api", "event_type": "api_request", "user": "bot_'$i'", "severity": 1}' > /dev/null
done

echo "\n✅ Done! Data Ingested from 4 Sources (AWS, AD, Firewall, M365)."