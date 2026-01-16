const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dgram = require('dgram');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อ Database
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().catch(e => console.error('DB connect error', e));

async function ingestLog(data) {
    const normalized = {
        timestamp: data['@timestamp'] || new Date(),
        tenant_id: data.tenant || 'default',
        source: data.source || 'unknown',
        event_type: data.event_type || 'info',
        severity: data.severity || 1,
        username: data.user || data.username || null,
        src_ip: data.ip || data.src_ip || null,
        metadata: data, // 
        raw_message: JSON.stringify(data)
    };

    if (normalized.event_type === 'login_failed') {
        
        console.log(`[ALERT] Login Failed detected for user: ${normalized.username}`);
    }

    // Insert ลง DB
    const query = `
        INSERT INTO logs (timestamp, tenant_id, source, event_type, severity, username, src_ip, metadata, raw_message)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
        normalized.timestamp, normalized.tenant_id, normalized.source, 
        normalized.event_type, normalized.severity, normalized.username, 
        normalized.src_ip, normalized.metadata, normalized.raw_message
    ];
    
    try {
        await client.query(query, values);
        console.log('Log saved');
    } catch (err) {
        console.error('Insert failed', err);
    }
}

app.post('/ingest', async (req, res) => {
    await ingestLog(req.body);
    res.json({ status: 'success' });
});

const syslogServer = dgram.createSocket('udp4');
syslogServer.on('message', (msg, rinfo) => {
    const raw = msg.toString();
    const logObj = {
        source: 'firewall',
        tenant: 'default',
        raw_message: raw,
        metadata: {
            from_ip: rinfo.address,
            raw_syslog: raw
        }
    };
    ingestLog(logObj);
});
syslogServer.bind(5140, () => console.log('Syslog UDP listening on 5140'));

app.get('/logs', async (req, res) => {
    const { tenant, search } = req.query;
    let query = 'SELECT * FROM logs WHERE 1=1';
    let params = [];
    
    if (tenant) {
        params.push(tenant);
        query += ` AND tenant_id = $${params.length}`;
    }
    
    query += ' ORDER BY timestamp DESC LIMIT 100';
    
    try {
        const result = await client.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('API Server running on port 3000'));