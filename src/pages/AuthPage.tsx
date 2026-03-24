import { useState } from 'react';
import {AuthLayout} from '../layouts/authLayout/AuthLayout.tsx';
import {LoginForm } from '../components/form/LoginForm.tsx';
import {ForgotForm}  from '../components/form/ForgotForm.tsx';

export const AuthPage = () => {

  const [isForgotPassword, setIsForgot] = useState(false);
  
  const navButtonText = isForgotPassword ? 'Войти' : 'Забыл пароль';

  const toggleForm = () => {
    setIsForgot(!isForgotPassword);
  };
  return (
    <AuthLayout
      buttonText={navButtonText}
      onButtonClick={toggleForm}>
        {isForgotPassword? (
        <ForgotForm onButtonClick={toggleForm}/> 
      ) : (
        <LoginForm />
      )}
    </AuthLayout>
  );
};