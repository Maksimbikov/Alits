export default function MaintenanceScreen({ title, message, endTime, onRetry, extended }) {
  const remaining = endTime ? formatRemaining(endTime) : null;

  return (
    <div className="maintenance-screen">
      <div className="maintenance-card">
        <div className="brand-mark large">A</div>
        <h1>{title || 'Alit временно недоступен'}</h1>
        <p>{message || 'Извините, но, к сожалению, сейчас ведутся технические работы.'}</p>
        {remaining && !extended ? <p className="maintenance-time">Примерно осталось: {remaining}</p> : null}
        {extended ? <p className="maintenance-time">Работы продлены. Пожалуйста, попробуйте позже.</p> : null}
        <button className="primary-button" onClick={onRetry}>Повторить попытку</button>
      </div>
    </div>
  );
}

function formatRemaining(endTime) {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return null;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours > 0) return `${hours} ч ${restMinutes} мин`;
  return `${restMinutes} мин`;
}
