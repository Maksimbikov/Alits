import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 4000);
const bridgeUrl = process.env.BRIDGE_URL || 'http://localhost:5000';
const bridgeApiKey = process.env.BRIDGE_API_KEY || 'change_me';
const requestTimeout = Number(process.env.REQUEST_TIMEOUT_MS || 45000);
const adminEmail = process.env.ADMIN_EMAIL || 'admin@alit.local';
const maintenanceFile = path.join(__dirname, 'maintenance-store.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function readMaintenance() {
  try {
    return JSON.parse(fs.readFileSync(maintenanceFile, 'utf-8'));
  } catch {
    return {
      enabled: false,
      message: 'Извините, но, к сожалению, сейчас ведутся технические работы.',
      endTime: null,
    };
  }
}

function writeMaintenance(data) {
  fs.writeFileSync(maintenanceFile, JSON.stringify(data, null, 2));
}

async function pingBridge() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.min(requestTimeout, 5000));
  try {
    const response = await fetch(`${bridgeUrl}/health`, {
      method: 'GET',
      headers: { 'x-api-key': bridgeApiKey },
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'backend' });
});

app.get('/api/status', async (_req, res) => {
  const maintenance = readMaintenance();
  const aiOnline = await pingBridge();
  res.json({ ok: true, aiOnline, maintenance });
});

app.get('/api/maintenance', (req, res) => {
  const isAdmin = req.headers['x-admin-email'] === adminEmail;
  if (!isAdmin) {
    return res.status(403).json({ ok: false, error: 'Admin only' });
  }
  return res.json({ ok: true, maintenance: readMaintenance() });
});

app.post('/api/admin/maintenance', (req, res) => {
  const isAdmin = req.headers['x-admin-email'] === adminEmail;
  if (!isAdmin) {
    return res.status(403).json({ ok: false, error: 'Admin only' });
  }

  const nextState = {
    enabled: Boolean(req.body.enabled),
    message: String(req.body.message || 'Извините, но, к сожалению, сейчас ведутся технические работы.'),
    endTime: req.body.endTime || null,
  };

  writeMaintenance(nextState);
  res.json({ ok: true, maintenance: nextState });
});

app.post('/api/chat', async (req, res) => {
  const maintenance = readMaintenance();
  if (maintenance.enabled) {
    return res.status(503).json({ ok: false, error: 'Maintenance enabled', maintenance });
  }

  const message = String(req.body.message || '').trim();
  const model = req.body.model === 'think' ? 'think' : 'fast';
  if (!message) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeout);

  try {
    const response = await fetch(`${bridgeUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': bridgeApiKey,
      },
      body: JSON.stringify({ message, model }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(503).json({ ok: false, error: data.error || 'AI server offline' });
    }

    return res.json({ ok: true, answer: data.answer, model: data.model });
  } catch {
    return res.status(503).json({ ok: false, error: 'AI server offline' });
  } finally {
    clearTimeout(timeout);
  }
});

app.listen(port, () => {
  console.log(`Alit backend started on http://localhost:${port}`);
});
