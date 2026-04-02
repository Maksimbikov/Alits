const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { ok: false, error: text || 'Invalid server response' };
  }
}

export async function getStatus() {
  const response = await fetch(`${BACKEND_URL}/api/status`, {
    method: 'GET',
  });
  return readJson(response);
}

export async function sendChatMessage(payload) {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export async function getMaintenance() {
  const response = await fetch(`${BACKEND_URL}/api/maintenance`, {
    method: 'GET',
    headers: { 'x-admin-email': import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@alit.local' },
  });
  return readJson(response);
}

export async function saveMaintenance(payload) {
  const response = await fetch(`${BACKEND_URL}/api/admin/maintenance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@alit.local',
    },
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save maintenance settings');
  }
  return data;
}
