// src/views/LoginView.jsx
import { useState, useEffect } from 'react';

function seedDemoAccount() {
  try {
    const users = JSON.parse(localStorage.getItem('symptocare_users') || '[]');
    if (!users.find(u => u.email === 'demo@symptocare.com')) {
      users.push({
        id: 1, name: 'Demo User', email: 'demo@symptocare.com',
        password: 'password123', avatar: null,
        createdAt: new Date().toISOString(),
        profile: { name: 'Demo User', email: 'demo@symptocare.com', phone: '+91 9876543210', dob: '1990-01-01', bloodGroup: 'O+', allergies: ['Penicillin'], notifications: true },
      });
      localStorage.setItem('symptocare_users', JSON.stringify(users));
    }
  } catch {}
}
seedDemoAccount();

export default function LoginView({ onLogin, setView }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = isLogin ? validateLogin() : validateRegister();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      if (isLogin) {
        const users = JSON.parse(localStorage.getItem('symptocare_users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          localStorage.setItem('symptocare_current_user', JSON.stringify(user));
          if (onLogin) onLogin(user);
        } else {
          setErrors({ general: 'Invalid email or password. Try demo@symptocare.com / password123' });
        }
      } else {
        const users = JSON.parse(localStorage.getItem('symptocare_users') || '[]');
        
        if (users.find(u => u.email === formData.email)) {
          setErrors({ general: 'Email already registered' });
          setLoading(false);
          return;
        }
        
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar: null,
          createdAt: new Date().toISOString(),
          profile: {
            name: formData.name,
            email: formData.email,
            phone: '',
            dob: '',
            bloodGroup: '',
            allergies: [],
            notifications: true
          }
        };
        
        users.push(newUser);
        localStorage.setItem('symptocare_users', JSON.stringify(users));
        localStorage.setItem('symptocare_current_user', JSON.stringify(newUser));
        
        if (onLogin) onLogin(newUser);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="view">
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 50,
          maxWidth: 1200,
          margin: '0 auto',
          alignItems: 'center'
        }}>
          
          {/* Left Side */}
          <div>
            <div style={{ marginBottom: 40 }}>
              <div style={{
                width: 70,
                height: 70,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}>
                <i className="bi bi-heart-pulse-fill" style={{ fontSize: 36, color: 'white' }} />
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome to SymptoCare
              </h1>
              <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
                Your complete AI-powered healthcare platform. Get instant access to telemedicine,
                health tracking, online pharmacy, and AI diagnostics.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { icon: 'bi-camera-video', title: 'Telemedicine', desc: '24/7 video consultations with certified doctors', color: '#3b82f6' },
                { icon: 'bi-wallet2', title: 'Digital Wallet', desc: 'Secure payments & instant refunds', color: '#10b981' },
                { icon: 'bi-calendar-check', title: 'Smart Scheduling', desc: 'Book appointments in seconds', color: '#8b5cf6' },
                { icon: 'bi-shield-check', title: 'HIPAA Compliant', desc: 'Your data is fully encrypted & secure', color: '#ef4444' },
              ].map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className={`bi ${feature.icon}`} style={{ fontSize: 22, color: feature.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{feature.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div style={{ animation: 'fadeInRight 0.5s ease-out' }}>
            <div style={{
              background: 'white',
              borderRadius: 28,
              padding: 40,
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, background: '#f3f4f6', padding: 6, borderRadius: 16 }}>
                <button
                  style={{
                    flex: 1,
                    padding: 12,
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 15,
                    background: isLogin ? 'white' : 'transparent',
                    color: isLogin ? '#667eea' : '#6b7280',
                    boxShadow: isLogin ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                  onClick={() => { setIsLogin(true); setErrors({}); }}
                >
                  Sign In
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: 12,
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 15,
                    background: !isLogin ? 'white' : 'transparent',
                    color: !isLogin ? '#667eea' : '#6b7280',
                    boxShadow: !isLogin ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                  onClick={() => { setIsLogin(false); setErrors({}); }}
                >
                  Create Account
                </button>
              </div>

              {errors.general && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#dc2626',
                  fontSize: 13
                }}>
                  <i className="bi bi-exclamation-triangle-fill" />
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div style={{ position: 'relative', marginBottom: 20 }}>
                    <i className="bi bi-person" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 18 }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        border: `2px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: 12,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    {errors.name && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.name}</div>}
                  </div>
                )}

                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 18 }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: 12,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                  {errors.email && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.email}</div>}
                </div>

                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <i className="bi bi-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 18 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      border: `2px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                      borderRadius: 12,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                  <i 
                    className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9ca3af' }}
                  />
                  {errors.password && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.password}</div>}
                </div>

                {!isLogin && (
                  <>
                    <div style={{ position: 'relative', marginBottom: 20 }}>
                      <i className="bi bi-shield-check" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 18 }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 44px',
                          border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                          borderRadius: 12,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      />
                      {errors.confirmPassword && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.confirmPassword}</div>}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          style={{ width: 18, height: 18, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 13, color: '#4b5563' }}>
                          I agree to the <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>Terms of Service</a>
                        </span>
                      </label>
                      {errors.agreeTerms && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.agreeTerms}</div>}
                    </div>
                  </>
                )}

                {isLogin && (
                  <div style={{ textAlign: 'right', marginBottom: 24 }}>
                    <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontSize: 13 }}>Forgot Password?</a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />Processing...</>
                  ) : (
                    <>{isLogin ? 'Sign In' : 'Create Account'}</>
                  )}
                </button>
              </form>

              {isLogin && (
                <div style={{
                  marginTop: 24,
                  padding: 12,
                  background: '#f0fdf4',
                  borderRadius: 12,
                  border: '1px solid #bbf7d0',
                  fontSize: 12,
                  color: '#166534'
                }}>
                  <i className="bi bi-info-circle" style={{ marginRight: 6 }} />
                  Demo Account: demo@symptocare.com / password123
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}