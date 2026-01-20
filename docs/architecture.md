# Log Management System Architecture

## Overview

ระบบจัดการ Log แบบ Centralized รองรับการทำงานทั้งรูปแบบ Appliance และ SaaS โดยเน้นความง่ายในการติดตั้ง (Containerized) และประสิทธิภาพในการค้นหา

---

## Technology Stack

* **Frontend:** React (Vite) + TailwindCSS + Recharts
* **Backend:** Node.js (Express) + UDP Syslog Server
* **Database:** PostgreSQL (JSONB Storage)
* **Infrastructure:** Docker Compose + Ngrok / Serveo

---

## Data Flow Diagram

```mermaid
graph TD
    subgraph Client_Side [Client Side]
        User["User / Admin"]
        Browser["Dashboard (React)"]
    end

    subgraph SaaS_Layer [SaaS / Cloud Layer]
        Tunnel["Secure Tunnel (Serveo/Ngrok)"]
    end

    subgraph Appliance [Appliance (Docker Container)]
        Frontend["Frontend (Nginx)"]
        Backend["Backend API (Node.js)"]
        DB[("PostgreSQL JSONB")]
    end

    subgraph Data_Sources [Data Sources]
        Firewall["Firewall (Syslog UDP)"]
        AWS["AWS / API (HTTP)"]
    end

    User -->|HTTPS| Tunnel
    Tunnel -->|Forward 80| Frontend
    Frontend -->|API Request| Backend
    Backend -->|Query / Store| DB

    Firewall -->|UDP 5140| Backend
    AWS -->|POST /ingest| Backend
```

---

## Database Schema (Key Design)

เราใช้ **JSONB** ใน PostgreSQL เพื่อความยืดหยุ่นในการเก็บ Log จากแหล่งที่ต่างกันโดยไม่ต้องแก้ Table Structure บ่อยๆ

| Column    | Type        | Description                         |
| --------- | ----------- | ----------------------------------- |
| timestamp | TIMESTAMPTZ | เวลาที่เกิดเหตุการณ์ (Indexed)      |
| tenant_id | VARCHAR     | รหัสลูกค้า (Multi-tenant Isolation) |
| source    | VARCHAR     | แหล่งที่มา (aws, firewall, api)     |
| metadata  | JSONB       | ข้อมูลดิบทั้งหมด (GIN Indexed)      |

---

## Security

* **Multi-tenancy:** แยกข้อมูลระดับ Row-level (Software Isolation)
* **Validation:** ตรวจสอบ JSON Schema ก่อนบันทึก
* **Transport:** HTTPS / Secure Tunnel
* **Access Control:** Role-based Access Control

---