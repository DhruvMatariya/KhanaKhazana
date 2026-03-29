import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/dashboard');
      } else {
        await axios.post(`${API_BASE_URL}/api/auth/register`, { username, password, email });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color:'#333' }}>
          {isLogin ? 'Restaurant Login' : 'Register Account'}
        </h2>
        {error && <p style={{ color: isLogin ? 'red' : 'green', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {!isLogin && (
            <input 
              type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          )}
          <input 
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px', cursor: 'pointer', color: '#3b82f6' }} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
