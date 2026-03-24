import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../service/apiService/authService.ts';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;  
}

export const MainLayout = ({ children}: MainLayoutProps) => {

  const fetchLogout = () => {
    logout().finally(() => {
      window.location.href = '/login';
    })
  }

  return (
    <div className="main-layout">
      <nav className="main-nav">
        <div className="main-nav-logo">HolidayBox</div>
        <div className = "main-nav-items">
            <Link to="/catalog"className='main-nav-item'>Каталог</Link>
            <Link to="/sales" className='main-nav-item'>Продажи</Link>
            <Link to="/notifications" className='main-nav-item'>Уведомления</Link>
            <Link to="/profile" className='main-nav-item'>Профиль</Link>
            <button className='logout-button' onClick={fetchLogout}>Выйти</button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};
