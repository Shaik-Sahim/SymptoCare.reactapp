// src/views/RegisterView.jsx
// RegisterView is a thin wrapper – LoginView already handles both modes.
import LoginView from './LoginView.jsx';

export default function RegisterView({ onRegister, setView }) {
  return <LoginView onLogin={onRegister} setView={setView} />;
}