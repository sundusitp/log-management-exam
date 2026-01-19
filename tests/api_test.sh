#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Starting Automated API Tests..."

# Test Case 1: Health Check (Ingest Normal Log)
echo -n "Test 1: Ingest Normal Log... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE_URL/ingest \
  -H "Content-Type: application/json" \
  -d '{"tenant":"test_suite","source":"automated_test","event_type":"health_check","severity":1}')

if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ PASS"; else echo "❌ FAIL ($HTTP_CODE)"; fi

# Test Case 2: Ingest Critical Log (Should trigger Alert logic)
echo -n "Test 2: Ingest Critical Log... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE_URL/ingest \
  -H "Content-Type: application/json" \
  -d '{"tenant":"test_suite","source":"automated_test","event_type":"critical_failure","severity":9}')

if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ PASS"; else echo "❌ FAIL ($HTTP_CODE)"; fi

# Test Case 3: Fetch Logs (Dashboard API)
echo -n "Test 3: Fetch Logs API (Filter by tenant)... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/logs?tenant=test_suite")

if [ "$HTTP_CODE" -eq 200 ]; then echo "✅ PASS"; else echo "❌ FAIL ($HTTP_CODE)"; fi

echo "-------------------------------------"
echo "🏁 Test Suite Completed."