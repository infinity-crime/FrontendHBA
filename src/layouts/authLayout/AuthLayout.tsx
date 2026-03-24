import React from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  buttonText: string;     
  onButtonClick: () => void;   
}

export const AuthLayout = ({ children, buttonText, 
  onButtonClick }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <nav className="nav">
        <div className="nav-logo">HolidayBox</div>
        <span className="nav-button" onClick={onButtonClick} >{buttonText}</span>
      </nav>
      <main>{children}</main>
    </div>
    
  );
};
