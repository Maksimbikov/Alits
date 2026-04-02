# Alit starter

Готовая базовая заготовка под твою схему:

- `src/` — сайт Alit на Vite + React
- `backend/` — сервер сайта
- `local-bridge/` — сервер на твоём ПК, который общается с Ollama

## Как это работает

Браузер -> backend -> local-bridge -> Ollama

ИИ работает строго от твоего ПК.

## 1. Запуск сайта

В корне проекта:

```bash
npm install
copy .env.example .env
npm run dev
```

Сайт откроется на `http://localhost:3000`

## 2. Запуск backend

Открой папку `backend`:

```bash
npm install
copy .env.example .env
npm run dev
```

Backend будет на `http://localhost:4000`

## 3. Запуск local bridge

Открой папку `local-bridge`:

```bash
npm install
copy .env.example .env
npm run dev
```

Local bridge будет на `http://localhost:5000`

## 4. Запуск Ollama

Поставь Ollama и скачай хотя бы одну модель:

```bash
ollama pull qwen2.5:3b
ollama pull qwen2.5:7b
ollama serve
```

Если `ollama serve` уже работает в фоне, просто проверь:

```bash
ollama list
```

## 5. Настройки

### frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_DEV_ADMIN_EMAIL=admin@alit.local
```

### backend `.env`

```env
PORT=4000
BRIDGE_URL=http://localhost:5000
BRIDGE_API_KEY=change_me
REQUEST_TIMEOUT_MS=45000
ADMIN_EMAIL=admin@alit.local
```

### local-bridge `.env`

```env
PORT=5000
LOCAL_API_KEY=change_me
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_FAST_MODEL=qwen2.5:3b
OLLAMA_THINK_MODEL=qwen2.5:7b
REQUEST_TIMEOUT_MS=60000
```

Важно: `BRIDGE_API_KEY` и `LOCAL_API_KEY` должны быть одинаковыми.

## 6. Как пользоваться админкой

Открой:

- `http://localhost:3000/admin`

Там можно:

- включить техработы
- поменять сообщение
- указать время окончания

Сейчас роль админа упрощённая: через `ADMIN_EMAIL` и `VITE_DEV_ADMIN_EMAIL`.
Потом можно заменить это на нормальную авторизацию.

## 7. Что ещё потом сделать

- реальная регистрация и вход
- сохранение чатов в базу
- Cloudflare Tunnel для связи с ПК извне
- деплой frontend на Vercel
- деплой backend на Render
- Web search tool
- streaming ответа
