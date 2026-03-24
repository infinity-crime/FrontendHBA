import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../style/AuthForm.css';
import { generateMockToken } from '../../service/mockData/mockTokenService.ts';
import type { LoginRequest } from '../types/Auth.ts';


export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleButton = async (e:React.FormEvent) => {
    e.preventDefault();
    
    // Generate mock token and store it
    const mockToken = generateMockToken();
    localStorage.setItem('access_token', mockToken);
    
    toast.success('Успешный вход!',
    {
        autoClose: 1000,
    });

    setTimeout(() => {
      navigate('/catalog', { replace: true });
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <form  onSubmit={handleButton} className="auth-form" method="POST">
          <div className="form-group">
              <input
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                placeholder="Логин"
              />
          </div>
          
            <div className="form-group">
              <div className='input-button'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                  placeholder="Пароль"
                />

                <span 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          
          <button type="submit" className="auth-button">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

