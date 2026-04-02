import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand centered">
          <div className="brand-mark">A</div>
          <div>
            <strong>Alit</strong>
            <p>Создание аккаунта</p>
          </div>
        </div>
        <input className="text-input" placeholder="Username" />
        <input className="text-input" placeholder="Email" />
        <input className="text-input" placeholder="Пароль" type="password" />
        <button className="primary-button full-width">Создать аккаунт</button>
        <p className="small-text">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
