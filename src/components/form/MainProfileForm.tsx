import React, { useState, useRef, useEffect } from 'react';
import '../style/ProfileForm.css';
import { toast } from 'react-toastify';
import type { ProfileResponse } from '../types/Profile';
import { getDepartById} from '../../service/apiService/departamentsService.ts';
import { Tooltip } from "antd"
import { AddPhotoProfile, GetPhotoProfile } from '../../service/apiService/profileService.ts';
import { getImage, saveImage } from '../../service/Common/photoManager.ts';

interface ViewFormProps {
  userData: ProfileResponse | null;
  onEditClick: () => void;
  onAdminClick: () => void;
  buttonText: string;   
}


export const MainProfileForm = ({userData, onEditClick, onAdminClick}: ViewFormProps) => {

  const [headDepartment, setHeadDepartment] = useState<string>('');

  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
      if(!userData?.departmentId) return
      
     getDepartById(userData?.departmentId).then(res => {
        setHeadDepartment(res.headDepartment)
      })
  }, [userData?.departmentId]); 

  useEffect(() => {
    let url: string | null = null;

   if (userData?.id === undefined) return;

    getImage(userData.id)
      .then((blob) => {
        if (blob) {
          url = URL.createObjectURL(blob);
          setPreview(url);
          return; 
        }

        return GetPhotoProfile(userData.id).then((serverBlob) => {
          saveImage(userData.id, serverBlob).catch(console.error);
          url = URL.createObjectURL(serverBlob);
          setPreview(url);
        });
      })
      .catch(console.error);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [userData?.id]);

  const handleFileSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) return;
    if (userData?.id === undefined) return;
    const file = e.target.files?.[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение', {
          autoClose: 1000,
      });
      return;
    }

    if (file.size > 200 * 1024) {
      toast.error('Максимальный размер файла 200КБ.', 
      {
          autoClose: 1000,
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", file, file.name); 
    
    saveImage(userData.id, file).catch(console.error);
    await AddPhotoProfile(userData?.id ?? 0, formData);
    setPreview(URL.createObjectURL(file));
 
    toast.success('Фото добавлено!', 
      {
          autoClose: 1000,
      });
  };

  return (
    <div className='profile-container'>
      <div className='photo-box'>
          <div className="photo-container">
            {preview ? (
              <img 
                src={preview} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }} 
              />
            ) : (
              <div className="photo-placeholder">
                <span>📷</span>
                <p>Фото еще не загружено</p>
              </div>
            )}
          </div>

          <div className="button-container">
            <span 
              className="file-button" 
              onClick={() => fileInputRef.current?.click()}>
                Добавить фото
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e)}
            style={{ display: 'none' }}
          />

          <div className='admin-button'>
            <button onClick={onAdminClick}>
              Управление сотрудниками
            </button>
          </div>
        </div> 

      <div className="profile-box">
        <div className = 'header-box'>
          <text>Контактная инфромация</text>
          <span onClick={onEditClick}>Изменить</span>
        </div>

        <hr/>

        <div className = 'info-box'>
          <label>Имя</label>
          <text>{userData?.firstName}</text>
        </div>
        <div className = 'info-box'>
          <label>Фамилия</label>
          <text>{userData?.lastName}</text>
        </div>
        <div className = 'info-box'>
          <label>Отчество</label>
          <text>{userData?.patronymic}</text>
        </div>
        <div className = 'info-box'>
          <label>Дата рождения</label>
          <text>{userData?.birthDate}</text>
        </div>
        <div className = 'info-box'>
          <label>Почта</label>
          <text>{userData?.email}</text>
        </div>
        <div className = 'info-box'>
          <label>Мобильный</label>
          <text>{userData?.phoneNumber}</text>
        </div>
        <div className = 'info-box'>
          <Tooltip title={headDepartment}
            overlayClassName="custom-tooltip">
          <label>Отдел</label>
          </Tooltip>
          <text>{userData?.departmentName}</text>
        </div>
        <div className = 'info-box'>
          <label>Должность</label>
          <text>{userData?.positionName}</text>
        </div>
      </div>
    </div>
    
  );
};
