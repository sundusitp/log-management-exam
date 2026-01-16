import requests
import json
import datetime

url = "http://localhost:3000/ingest"

# Log ตัวอย่าง
log_data = {
    "tenant": "demoB",
    "source": "aws",
    "event_type": "CreateUser",
    "user": "admin",
    "severity": 5,
    "@timestamp": datetime.datetime.now().isoformat(),
    "cloud": {"region": "ap-southeast-1"}
}

r = requests.post(url, json=log_data)
print(f"Sent: {r.status_code}")