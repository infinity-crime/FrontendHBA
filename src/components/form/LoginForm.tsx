import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../style/AuthForm.css';
import { generateMockToken } from '../../service/mockData/mockTokenService.ts';
import { validateLoginForm } from '../../service/validators/formValidators.ts';
import { FieldError } from '../errors/ValidationError.tsx';
import { ErrorModal } from '../modalWindows/ErrorModal.tsx';


export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    errorType: 'validation' | 'server' | 'network' | 'permission' | 'conflict';
  }>({ isOpen: false, title: '', message: '', errorType: 'validation' });

  const navigate = useNavigate();

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleButton = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 handleButton called with email:', email);
    
    // Validate login with validators
    const validation = validateLoginForm(email, password);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      console.log('❌ Validation failed:', validation.errors);
      setErrorModal({
        isOpen: true,
        title: 'Ошибка валидации входа',
        message: 'Пожалуйста, проверьте введенные данные',
        errorType: 'validation',
      });
      return;
    }
    
    // Mark all fields as touched for UI feedback
    setTouchedFields({ email: true, password: true });
    
    try {
      const trimmedEmail = email.trim().toLowerCase();
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
        setErrorModal({
          isOpen: true,
          title: 'Ошибка сохранения',
          message: 'Не удалось сохранить данные в браузере',
          errorType: 'server' as const,
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
      setErrorModal({
        isOpen: true,
        title: 'Ошибка при входе',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        errorType: 'server',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <form  onSubmit={handleButton} className="auth-form" method="POST">
          <div className="form-group">
            <label>Логин</label>
            <input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setValidationErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.email;
                  return newErrors;
                });
              }}
              onBlur={() => handleBlur('email')}
              placeholder="Логин"
              style={{ borderColor: validationErrors.email ? '#d32f2f' : undefined }}
            />
            {touchedFields.email && validationErrors.email && (
              <FieldError error={validationErrors.email[0]} touched />
            )}
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <div className='input-button'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                  });
                }}
                onBlur={() => handleBlur('password')}
                placeholder="Пароль"
                style={{ borderColor: validationErrors.password ? '#d32f2f' : undefined }}
              />

              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {touchedFields.password && validationErrors.password && (
              <FieldError error={validationErrors.password[0]} touched />
            )}
          </div>
          
          <button type="submit" className="auth-button">
            Войти
          </button>
        </form>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        errorType={errorModal.errorType as any}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};

