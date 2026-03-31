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

  const handleButton = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 handleButton called with email:', email);
    
    // Validate login - только менеджер или админ
    const trimmedEmail = email.trim().toLowerCase();
    console.log('✏️ trimmedEmail:', trimmedEmail);
    
    if (trimmedEmail !== 'менеджер' && trimmedEmail !== 'админ') {
      console.log('❌ Invalid login');
      toast.error('Неверный логин. Используйте: менеджер или админ',
      {
          autoClose: 1500,
      });
      return;
    }
    
    try {
      console.log('⏳ Generating token for:', trimmedEmail);
      
      // Generate mock token with login (password is ignored)
      const mockToken = generateMockToken(trimmedEmail);
      console.log('✅ Generated token:', mockToken);
      console.log('📦 Token length:', mockToken.length);
      
      // Save to localStorage
      try {
        localStorage.setItem('access_token', mockToken);
        localStorage.setItem('userLogin', trimmedEmail);
        console.log('💾 Token saved to localStorage');
      } catch (storageError) {
        console.error('❌ Storage error:', storageError);
        toast.error('Ошибка сохранения данных',
        {
            autoClose: 1500,
        });
        return;
      }
      
      toast.success('Успешный вход!',
      {
          autoClose: 1000,
      });

      setTimeout(() => {
        console.log('🚀 Navigating to /catalog');
        navigate('/catalog', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Full error object:', JSON.stringify(error));
      
      toast.error('Ошибка при входе: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'),
      {
          autoClose: 1500,
      });
    }
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

