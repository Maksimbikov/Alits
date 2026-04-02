import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const localApiKey = process.env.LOCAL_API_KEY || 'change_me';
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const fastModel = process.env.OLLAMA_FAST_MODEL || 'qwen2.5:3b';
const thinkModel = process.env.OLLAMA_THINK_MODEL || 'qwen2.5:7b';
const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 60000);

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  if (req.path === '/health') return next();
  if (req.headers['x-api-key'] !== localApiKey) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  return next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'local-bridge' });
});

app.post('/chat', async (req, res) => {
  const message = String(req.body.message || '').trim();
  const model = req.body.model === 'think' ? thinkModel : fastModel;

  if (!message) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: false,
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.response) {
      return res.status(503).json({ ok: false, error: data.error || 'Ollama unavailable' });
    }

    return res.json({ ok: true, model, answer: data.response });
  } catch {
    return res.status(503).json({ ok: false, error: 'Ollama unavailable' });
  } finally {
    clearTimeout(timeout);
  }
});

app.listen(port, () => {
  console.log(`Alit local bridge started on http://localhost:${port}`);
});
