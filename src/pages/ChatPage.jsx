import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import MessageList from '../components/MessageList.jsx';
import ChatInput from '../components/ChatInput.jsx';
import MaintenanceScreen from '../components/MaintenanceScreen.jsx';
import { getStatus, sendChatMessage } from '../lib/api.js';

const statusFlow = ['thinking', 'searching_web', 'writing_answer'];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Привет. Я Alit. Когда подключишь backend и Ollama, я смогу отвечать уже с твоего ПК.',
    },
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('fast');
  const [loading, setLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('thinking');
  const [maintenanceState, setMaintenanceState] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkServer();
  }, []);

  useEffect(() => {
    if (!loading) return undefined;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statusFlow.length;
      setPendingStatus(statusFlow[index]);
    }, 1400);
    return () => clearInterval(interval);
  }, [loading]);

  async function checkServer() {
    try {
      const data = await getStatus();
      if (data?.maintenance?.enabled || data?.aiOnline === false) {
        setMaintenanceState({
          message: data?.maintenance?.message,
          endTime: data?.maintenance?.endTime,
          extended: Boolean(data?.maintenance?.enabled && data?.maintenance?.endTime && new Date(data.maintenance.endTime).getTime() < Date.now()),
        });
      } else {
        setMaintenanceState(null);
      }
    } catch {
      setMaintenanceState({
        message: 'Извините, но, к сожалению, сейчас ведутся технические работы.',
        endTime: null,
        extended: false,
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setPendingStatus('thinking');

    try {
      const data = await sendChatMessage({ message: trimmed, model });
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer || 'Ответ пустой.',
        },
      ]);
    } catch (submitError) {
      const text = submitError.message || 'Ошибка отправки';
      setError(text);
      if (text.toLowerCase().includes('offline') || text.toLowerCase().includes('maintenance')) {
        await checkServer();
      }
    } finally {
      setLoading(false);
    }
  }

  const maintenanceScreen = useMemo(() => {
    if (!maintenanceState) return null;
    return (
      <MaintenanceScreen
        title="Alit временно недоступен"
        message={maintenanceState.message}
        endTime={maintenanceState.endTime}
        extended={maintenanceState.extended}
        onRetry={checkServer}
      />
    );
  }, [maintenanceState]);

  if (maintenanceScreen) {
    return maintenanceScreen;
  }

  return (
    <div className="chat-layout">
      <Sidebar />
      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1>Alit Chat</h1>
            <p>ИИ работает строго от твоего ПК через Ollama</p>
          </div>
          <div className="segment-control">
            <button
              className={model === 'fast' ? 'segment active' : 'segment'}
              onClick={() => setModel('fast')}
            >
              Fast
            </button>
            <button
              className={model === 'think' ? 'segment active' : 'segment'}
              onClick={() => setModel('think')}
            >
              Think
            </button>
          </div>
        </header>

        <MessageList messages={messages} pendingStatus={pendingStatus} loading={loading} />
        {error ? <div className="error-box">{error}</div> : null}
        <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={loading} />
      </main>
    </div>
  );
}
