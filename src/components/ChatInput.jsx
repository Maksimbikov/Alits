import { SendHorizonal } from 'lucide-react';

export default function ChatInput({ value, onChange, onSubmit, disabled }) {
  return (
    <form className="input-bar" onSubmit={onSubmit}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Напиши сообщение для Alit..."
        rows={1}
        disabled={disabled}
      />
      <button className="primary-button" type="submit" disabled={disabled || !value.trim()}>
        <SendHorizonal size={16} />
        Отправить
      </button>
    </form>
  );
}
