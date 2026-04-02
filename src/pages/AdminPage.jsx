import { useEffect, useMemo, useState } from 'react';
import { getMaintenance, saveMaintenance } from '../lib/api.js';

export default function AdminPage() {
  const [form, setForm] = useState({
    maintenance_enabled: false,
    maintenance_message: 'Извините, но, к сожалению, сейчас ведутся технические работы.',
    maintenance_end_time: '',
  });
  const [status, setStatus] = useState('Загрузка...');
  const isAdmin = useMemo(() => {
    return (import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@alit.local') === 'admin@alit.local';
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setStatus('Доступ запрещён.');
      return;
    }
    getMaintenance()
      .then((data) => {
        if (data.maintenance) {
          setForm({
            maintenance_enabled: Boolean(data.maintenance.enabled),
            maintenance_message: data.maintenance.message || '',
            maintenance_end_time: data.maintenance.endTime ? data.maintenance.endTime.slice(0, 16) : '',
          });
        }
        setStatus('');
      })
      .catch(() => setStatus('Не удалось загрузить настройки.'));
  }, [isAdmin]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Сохранение...');
    try {
      await saveMaintenance({
        enabled: form.maintenance_enabled,
        message: form.maintenance_message,
        endTime: form.maintenance_end_time ? new Date(form.maintenance_end_time).toISOString() : null,
      });
      setStatus('Сохранено.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  if (!isAdmin) {
    return <div className="simple-page">{status}</div>;
  }

  return (
    <div className="simple-page">
      <form className="admin-card" onSubmit={handleSubmit}>
        <h1>Alit Admin</h1>
        <label className="check-row">
          <input
            type="checkbox"
            checked={form.maintenance_enabled}
            onChange={(event) => setForm((current) => ({ ...current, maintenance_enabled: event.target.checked }))}
          />
          Включить техработы
        </label>

        <label className="field-label">
          Сообщение
          <textarea
            className="text-input tall"
            value={form.maintenance_message}
            onChange={(event) => setForm((current) => ({ ...current, maintenance_message: event.target.value }))}
          />
        </label>

        <label className="field-label">
          Время окончания
          <input
            className="text-input"
            type="datetime-local"
            value={form.maintenance_end_time}
            onChange={(event) => setForm((current) => ({ ...current, maintenance_end_time: event.target.value }))}
          />
        </label>

        <button className="primary-button" type="submit">Сохранить</button>
        {status ? <p className="small-text">{status}</p> : null}
      </form>
    </div>
  );
}
