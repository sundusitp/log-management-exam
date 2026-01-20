# Log Management System Architecture

## Overview
ระบบจัดการ Log แบบ Centralized รองรับการทำงานทั้งรูปแบบ Appliance และ SaaS โดยเน้นความง่ายในการติดตั้ง (Containerized) และประสิทธิภาพในการค้นหา

## Technology Stack
- **Frontend:** React (Vite) + TailwindCSS + Recharts
- **Backend:** Node.js (Express) + UDP Syslog Server
- **Database:** PostgreSQL (JSONB Storage)
- **Infrastructure:** Docker Compose

## Data Flow Diagram
```mermaid
graph TD
    subgraph Client_Side [Client Side]
        User[👤 User / Admin]
        Browser[💻 Dashboard (React)]
    end

    subgraph SaaS_Layer [SaaS / Cloud Layer]
        Tunnel[🌐 Secure Tunnel (Serveo/Ngrok)]
    end

    subgraph Appliance [Appliance (Docker Container)]
        Frontend[🎨 Frontend (Nginx)]
        Backend[⚙️ Backend API (Node.js)]
        DB[(🗄️ PostgreSQL JSONB)]
    end

    subgraph Data_Sources [Data Sources]
        Firewall[🔥 Firewall (Syslog UDP)]
        AWS[☁️ AWS / API (HTTP)]
    end

    %% Flow Connections
    User -->|HTTPS| Tunnel
    Tunnel -->|Forward 80| Frontend
    Frontend -->|API Req| Backend
    Backend -->|Query/Store| DB

    %% Ingestion Flow
    Firewall -->|UDP 5140| Backend
    AWS -->|POST /ingest| Backend

    %% Styling
    style DB fill:#f9f,stroke:#333,stroke-width:2px
    style Backend fill:#bbf,stroke:#333,stroke-width:2px
    style Tunnel fill:#dfd,stroke:#333,stroke-width:2px

## Database Schema (Key Design)
เราใช้ **JSONB** ใน PostgreSQL เพื่อความยืดหยุ่นในการเก็บ Log จากแหล่งที่ต่างกันโดยไม่ต้องแก้ Table Structure บ่อยๆ

| Column | Type | Description |
|--------|------|-------------|
| timestamp | TIMESTAMPTZ | เวลาที่เกิดเหตุการณ์ (Indexed) |
| tenant_id | VARCHAR | รหัสลูกค้า (สำหรับ Multi-tenant Isolation) |
| source | VARCHAR | แหล่งที่มา (aws, firewall, api) |
| metadata | JSONB | ข้อมูลดิบอื่นๆ ทั้งหมด (Indexed with GIN) |

## Security
- **Multi-tenancy:** แยกข้อมูลระดับ Row-level (Software Isolation)
- **Validation:** ตรวจสอบ JSON Schema ก่อนบันทึก