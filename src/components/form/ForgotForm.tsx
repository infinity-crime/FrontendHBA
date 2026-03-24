import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { forgotPassword,  verifyResetCodePassword, resetPassword} from '../../service/apiService/authService.ts';
import '../style/AuthForm.css';
import type { VerifyResetCodetRequest, ResetPasswordRequest } from '../types/Auth.ts';


interface ForgotProps {   
  onButtonClick: () => void;   
}

export const ForgotForm = ( {onButtonClick}   : ForgotProps) => {
    
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeError, setCodeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = () => {
    const newErrors: typeof passwordErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'Пароль обязателен';
    } else {
      const requirements: string[] = [];
      if (newPassword.length < 8) requirements.push('минимум 8 символов');
      if (!/\d/.test(newPassword)) requirements.push('хотя бы одну цифру');
      if (!/[A-Z]/.test(newPassword)) requirements.push('хотя бы одну заглавную букву');
      if (!/[!@#$%^&*_-]/.test(newPassword)) requirements.push('хотя бы один спецсимвол (!@#$%^&*_-)');

      if (requirements.length > 0) {
        newErrors.newPassword= 'Пароль должен содержать: ' + requirements.join(', ');
      }
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    return newErrors;
  };
  
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!isValidEmail(email)){
      setEmailError('Введите корректный email');
      return;
    }

    setEmailError('');  

    await forgotPassword(email).then(() => { 
        toast.success('Инструкции отправлены, если такой адрес зарегистрирован', {
            autoClose: 1000,
           })
            setTimeout(() => {
              setStep(2);
            }, 1000);
          }).catch(() => {});
  };

  const handleStep2 = async(e: React.FormEvent) => {
    e.preventDefault();
    if(code.trim().length === 0){
        setCodeError('Введите код');
        return;
    }else if(code.trim().length !== 6){
      setCodeError('Код должен содержать 6 символов');
      return;
    }
    
    const verifyRequest: VerifyResetCodetRequest = { email:email, code:code };
    await verifyResetCodePassword(verifyRequest).then(() => {

      toast.success('Код подтвержден!', {
          autoClose: 1000,
          })
          setTimeout(() => {
            setStep(3); 
          }, 1000);
      }).catch(() => {});
  };

  const handleFinish = async (e: React.FormEvent) => {
     e.preventDefault();
    const validationErrors = validatePassword();
    setPasswordErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {

      const resetRequest: ResetPasswordRequest = {
        email: email,
        newPassword: newPassword,
        verifyPassword : confirmPassword,
      }

      await resetPassword(resetRequest).then(() => {
          toast.success('Успешно сохранено!', {
          autoClose: 1000,
          })
          setTimeout(() => {
           onButtonClick();
          }, 1000);
        }
      ).catch(() => {});
    }
  };

  return (
   <div className="auth-container">
        {step === 1 && (
        <div className="auth-box">
        <form onSubmit={handleStep1} className="auth-form" method='POST'>
            <label htmlFor="email">Сброс пароля</label>
            <div className="form-group">
                <input
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                        setEmailError('');
                    }}
                    placeholder= "Электронная почта"
                />
                {emailError && (
                    <div style={{ color: 'red', margin: '10px 0' }}>
                      {emailError}
                    </div>
                  )}
            </div>
                      
            <button type="submit" className="auth-button">
                Отправить код
            </button>
        </form>
        </div>
        )}

        {step === 2 && (
        <div className="auth-box">
            <form onSubmit={handleStep2} className="auth-form" method='POST'>
            <label htmlFor="code">Сброс пароля</label>
            <div className="form-group">
                    <input
                        id = "code"
                        value={code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                        placeholder= "Код"
                    />

                    {codeError && (
                      <div style={{ color: 'red', margin: '10px 0' }}>
                        {codeError}
                      </div>
                    )}
                </div>
                        
                <button type="submit" className="auth-button" >
                    Отправить код
                </button>
            </form>
        </div>
        )}

        {step === 3 && (
        <div className="auth-box">
        <form onSubmit={handleFinish} className="auth-form" method='POST'>
           <label >Сброс пароля</label>
            <div className="form-group">
                 <div className='input-button'>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNewPassword(e.target.value);
                        if (passwordErrors.newPassword) setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
                        }}
                        placeholder="Новый пароль"
                        />
                 
                        <span 
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
            </div>

            <div className="form-group">
                 <div className='input-button'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setConfirmPassword(e.target.value);
                        if (passwordErrors.confirmPassword) setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        placeholder="Повторите пароль"
                        />
                 
                        <span 
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {Object.keys(passwordErrors).length > 0 && (
                      <div style={{ color: 'red', margin: '10px 0' }}>
                        {Object.values(passwordErrors).map((err, idx) => (
                          <div key={idx}>{err}</div>
                        ))}
                      </div>
                  )}
            </div>
                      
            <button type="submit" 
            className="auth-button">
               Сохранить
            </button>
        </form>
        </div>
        )}
      </div>
  );
};
