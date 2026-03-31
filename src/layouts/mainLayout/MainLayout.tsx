import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from 'antd';
import { logout } from '../../service/apiService/authService.ts';
import { getMockNotifications } from '../../service/mockData/mockNotificationData.ts';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;  
}

export const MainLayout = ({ children}: MainLayoutProps) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const notifications = getMockNotifications();
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

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
            <Badge count={unreadCount} style={{ backgroundColor: '#ff4d4f' }} overflowCount={99}>
              <Link to="/notifications" className={`main-nav-item ${isActive('/notifications') ? 'active' : ''}`}>Уведомления</Link>
            </Badge>
            <Link to="/profile" className={`main-nav-item ${isActive('/profile') ? 'active' : ''}`}>Профиль</Link>
            <button className='logout-button' onClick={fetchLogout}>Выйти</button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};
