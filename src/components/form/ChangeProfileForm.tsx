import React, { useState, useRef, useEffect } from 'react';
import '../style/ProfileForm.css';
import { toast } from 'react-toastify';
import type {ProfileResponse} from '../types/Profile';
import {ChangePassword} from '../modalWindows/ChangePassword.tsx';
import { changePassword} from '../../service/apiService/authService.ts';
import { Popover, Form} from "antd";
import type { ChangePasswordRequest } from '../types/Auth.ts';
import { getImage, saveImage } from '../../service/Common/photoManager.ts';
import { AddPhotoProfile, GetPhotoProfile } from '../../service/apiService/profileService.ts';

interface EditFormProps {
  newData: ProfileResponse | null;
  onSave:(data:ProfileResponse | null) => void;
  onCancel: () => void;
  onEditClick: () => void;
  buttonText: string;   
}

export const ChangeProfileForm = ({newData, onSave, onCancel, onEditClick}: EditFormProps) => {

  
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileResponse | null>(newData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
      let url: string | null = null;
  
     if (newData?.id === undefined) return;
  
      getImage(newData.id)
        .then((blob) => {
          if (blob) {
            url = URL.createObjectURL(blob);
            setPreview(url);
            return; 
          }
  
          return GetPhotoProfile(newData.id).then((serverBlob) => {
            saveImage(newData.id, serverBlob).catch(console.error);
            url = URL.createObjectURL(serverBlob);
            setPreview(url);
          });
        })
        .catch(console.error);
  
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }, [newData?.id]);

   const handleSubmit = async () => {
      const values = await form.validateFields();
       const request: ChangePasswordRequest = {
        userId: newData?.id || 0,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword};
        
       await changePassword(request);

      toast.success('Пароль успешно изменен!', {
          autoClose: 1000,
        });

      form.resetFields();
      setOpen(false);
  };

  const content = (
    <ChangePassword onSave={handleSubmit}form={form}/>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

   const handleFileSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (!e.target.files || e.target.files.length === 0) return;
      if (newData?.id === undefined) return;
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

      saveImage(newData.id, file).catch(console.error);
      await AddPhotoProfile(newData?.id ?? 0, formData);
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
                alt="Preview" 
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
        </div>

      <div className="profile-box">
        <div className = 'header-box'>
          <text>Контактная инфромация</text>
          <span onClick={onEditClick}>Изменить</span>
        </div>

        <hr/>

        <div className = 'info-box-change'>
          <label>Имя</label>
          <input
            type='text'
            name="firstName"
            value={formData?.firstName}
            onChange={handleChange}/>

        </div>
        <div className = 'info-box-change'>
          <label>Фамилия</label>
          <input
            type='text'
            name="lastName"
            value={formData?.lastName}
            onChange={handleChange}/>
        </div>
        <div className = 'info-box-change'>
          <label>Отчество</label>
          <input
            type='text'
            name="patronymic"
            value={formData?.patronymic}
            onChange={handleChange}/>
        </div>
        <div className = 'info-box-change'>
          <label>Мобильный</label>
         <input
            type='text'
            name="phoneNumber"
            value={formData?.phoneNumber}
            onChange={handleChange}/>
        </div>
         <div className = 'info-box-change'>
          <label>Почта</label>
          <input
            type='text'
            name="email"
            value={formData?.email}
            disabled
            style={{ backgroundColor: "#f0f0f0" }}
            />
            <Popover
              content={content}
              trigger="click"
              placement="bottom"
              open={open}
              onOpenChange={setOpen}
            >
              <span className="change-password-link">
                Сменить пароль
              </span>
            </Popover>
        </div>
        <div className = 'info-box-change'>
          <label>Дата рождения</label>
          <input
            type='text'
            name="dataOfBirth"
            value={formData?.birthDate}
            disabled
            style={{ backgroundColor: "#f0f0f0" }}
            />
        </div>
         <div className = 'info-box-change'>
          <label>Должность</label>
          <input
            type='text'
            name="post"
            value={formData?.positionName}
            disabled
            style={{ backgroundColor: "#f0f0f0" }}
            />
        </div>
         <div>
         <button className = 'edit-buttom-success' onClick={() => onSave(formData)}>Сохранить</button>
         <button className = 'edit-buttom-cancel'  onClick={onCancel}>Отмена</button>
      </div>
      </div>
    </div>
  );
};
