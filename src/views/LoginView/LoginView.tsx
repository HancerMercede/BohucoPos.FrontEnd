import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { API_URL } from '../../config';
import styles from './LoginView.module.css';

export function LoginView() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Waiter');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister 
        ? { username, password, fullName, role }
        : { username, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || (isRegister ? 'Registration failed' : 'Login failed'));
      }

      const data = await response.json();
      login(data.token, {
        username: data.username,
        role: data.role,
        fullName: data.fullName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>🌿</div>
          <span className={styles.logoText}>
            BOHUCO<span className={styles.logoAccent}>POS</span>
          </span>
        </div>
        <p className={styles.subtitle}>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />

          {isRegister && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              required
            />
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />

          {isRegister && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              required
            >
              <option value="Waiter">Mesero</option>
              <option value="Kitchen">Cocina</option>
              <option value="Bar">Barra</option>
              <option value="Admin">Admin</option>
            </select>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        <p className={styles.toggle}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? ' Entrar' : ' Registrarse'}
          </button>
        </p>
      </div>

      <p className={styles.footer}>
        © {new Date().getFullYear()} HM Software Solutions. All rights reserved.
      </p>
    </div>
  );
}
