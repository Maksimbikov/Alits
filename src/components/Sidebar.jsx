import { MessageSquarePlus, Settings, Sparkles } from 'lucide-react';

const demoChats = [
  'Новый чат',
  'Прошивка для телефона',
  'Как запустить Ollama',
  'Техработы Alit',
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>Alit</strong>
            <p>Local AI chat</p>
          </div>
        </div>

        <button className="ghost-button full-width">
          <MessageSquarePlus size={16} />
          Новый чат
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">История</p>
          {demoChats.map((chat) => (
            <button className="sidebar-chat" key={chat}>
              <Sparkles size={14} />
              {chat}
            </button>
          ))}
        </div>
      </div>

      <button className="ghost-button full-width muted">
        <Settings size={16} />
        Настройки
      </button>
    </aside>
  );
}
