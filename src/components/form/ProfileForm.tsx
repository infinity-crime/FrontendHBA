import { useState, useEffect } from 'react';
import {ChangeProfileForm} from './ChangeProfileForm.tsx';
import {MainProfileForm} from './MainProfileForm.tsx';
import { AdminForm } from './AdminForm.tsx';
import {getProfile, updateProfile} from '../../service/apiService/profileService.ts';
import type { ProfileResponse, UpdateProfile } from '../types/Profile.ts';
import type { JwtPayload} from '../types/JwtPayload';
import { jwtDecode } from 'jwt-decode';

export const ProfileForm = () => {

 const [data, setData] = useState<ProfileResponse| null>(null);

 const fetchProfile = () => {
    getProfile().then(res => {
      setData(res)
    })
  }

  useEffect(() => {
   fetchProfile();
  }, []); 


const [isChangeMod, setChangeMod] = useState(false);
const [isAdminMod, setAdminMod] = useState(false);


const changeText = isChangeMod ? 'Отменить' : 'Изменить';

  const toggleForm = () => {
    setChangeMod(!isChangeMod);
  };

  const adminToggeleForm = () => {
    setAdminMod(!isAdminMod);
  }

  const handleSave = async(newData: ProfileResponse | null) => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const updateUser: UpdateProfile= {
          id: newData?.id,
          userId:userId,
          firstName: newData?.firstName,
          lastName: newData?.lastName,
          patronymic:newData?.patronymic,
          phoneNumber: newData?.phoneNumber
        };
      await updateProfile(updateUser);
      await fetchProfile();
      setChangeMod(!isChangeMod);
  };


  return (
     <div>
      {isChangeMod ? (
        <ChangeProfileForm 
          newData={data}
          onSave={handleSave}
          onCancel={() => setChangeMod(false)}
          onEditClick={toggleForm}
          buttonText={changeText}
          />
      ) : isAdminMod ? (
          <AdminForm 
          onAdminClick ={adminToggeleForm}/>
        ) : (
        <MainProfileForm 
          userData={data}
          onEditClick ={toggleForm}
          onAdminClick ={adminToggeleForm}
          buttonText={changeText}
        />
      )
    }
    </div>
  )
};
