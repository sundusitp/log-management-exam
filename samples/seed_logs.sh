#!/bin/bash

API_URL="http://localhost:3000/ingest"

echo "Log Seeder: Sending sample logs to $API_URL..."

# 1. Normal Usage (Office 365)
echo "Sending Normal Logs..."
curl -s -X POST $API_URL -H "Content-Type: application/json" \
-d '{"tenant": "tenant-A", "source": "office365", "event_type": "file_accessed", "user": "somchai", "severity": 1}' > /dev/null

# 2. Critical Security Alert (Firewall)
echo "Sending Critical Alert (Malware)..."
curl -s -X POST $API_URL -H "Content-Type: application/json" \
-d '{"tenant": "tenant-A", "source": "firewall", "event_type": "malware_detected", "user": "system", "severity": 9, "metadata": {"ip": "192.168.1.50", "action": "block"}}' > /dev/null

# 3. Multi-tenant Data (Tenant B)
echo "Sending Tenant B Logs..."
curl -s -X POST $API_URL -H "Content-Type: application/json" \
-d '{"tenant": "tenant-B", "source": "aws", "event_type": "console_login", "user": "devops", "severity": 2}' > /dev/null

# 4. Bulk Traffic (For Graph)
echo "Sending Bulk Traffic..."
for i in {1..10}; do
  curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"tenant": "tenant-A", "source": "api", "event_type": "api_request", "user": "bot_'$i'", "severity": 1}' > /dev/null
  # sleep 0.1
done

echo "\n✅ Done! Check the Dashboard."