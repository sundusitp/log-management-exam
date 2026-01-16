CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tenant_id VARCHAR(50) NOT NULL,
    source VARCHAR(50),
    event_type VARCHAR(100),
    severity INTEGER DEFAULT 1,
    username VARCHAR(100),
    src_ip INET,
    metadata JSONB,
    raw_message TEXT
);

CREATE INDEX idx_logs_tenant ON logs(tenant_id);
CREATE INDEX idx_logs_ts ON logs(timestamp);
CREATE INDEX idx_logs_meta ON logs USING GIN (metadata);