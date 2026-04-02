import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand centered">
          <div className="brand-mark">A</div>
          <div>
            <strong>Alit</strong>
            <p>Вход в систему</p>
          </div>
        </div>
        <input className="text-input" placeholder="Email или логин" />
        <input className="text-input" placeholder="Пароль" type="password" />
        <button className="primary-button full-width">Войти</button>
        <p className="small-text">
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}
