# Log Management Backend

## Tech Stack
- Node.js (Express)
- PostgreSQL Client (`pg`)
- Syslog UDP Server (`dgram`)

## Responsibilities
- Ingest logs via HTTP POST (`/ingest`) and UDP (`5140`).
- Normalize data into JSONB schema.
- Serve REST API for Frontend.