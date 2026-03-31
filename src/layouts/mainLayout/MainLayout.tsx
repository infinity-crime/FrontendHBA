import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../service/apiService/authService.ts';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;  
}

export const MainLayout = ({ children}: MainLayoutProps) => {
  const location = useLocation();

  const fetchLogout = () => {
    logout().finally(() => {
      window.location.href = '/login';
    })
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  }

  return (
    <div className="main-layout">
      <nav className="main-nav">
        <div className="main-nav-logo">HolidayBox</div>
        <div className = "main-nav-items">
            <Link to="/catalog" className={`main-nav-item ${isActive('/catalog') ? 'active' : ''}`}>Каталог</Link>
            <Link to="/sales" className={`main-nav-item ${isActive('/sales') ? 'active' : ''}`}>Продажи</Link>
            <Link to="/notifications" className={`main-nav-item ${isActive('/notifications') ? 'active' : ''}`}>Уведомления</Link>
            <Link to="/profile" className={`main-nav-item ${isActive('/profile') ? 'active' : ''}`}>Профиль</Link>
            <button className='logout-button' onClick={fetchLogout}>Выйти</button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};
