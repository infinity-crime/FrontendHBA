import '../style/ModelWindows.css';
import { FaTimes } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import type { AdminProfileResponse} from '../types/Admin.ts';
import { getAllDepartments} from '../../service/apiService/departamentsService.ts';
import { getProfileById} from '../../service/apiService/profileService.ts';
import { type ProfileResponse } from '../types/Profile.ts';
import {getAllPositionsByDepartamnetId} from '../../service/apiService/positionService.ts';

interface EditUserProps {
  onCancelWindow: () => void;
  userData: AdminProfileResponse;
  onSave:(data:ProfileResponse | null)  => void;
}

interface ValuesEdit {
  firstName: string;
  lastName: string;
  surName: string;
  email: string;
  isActive: string;
  departmentId: string;
  positionId: string;
}

type Option = {
    value: boolean;
    label: string;
};

type OptionDepartmentPosition = {
    value: number;
    label: string;
};

export const EditUser = ({onSave, onCancelWindow ,userData}: EditUserProps) => {

  const [errors, setErrors] = useState<Partial<ValuesEdit>>({});
  const statusValue: Option[] = [
    { value: true, label: 'Активен' },
    { value: false, label: 'Не активен' },
  ];

  const [user, setUserData] = useState<ProfileResponse | null>(null);

  //начальная позиция окна - центр экрана
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 300 });
  //флаг показывающий происходит ли перетаскивание
  const [dragging, setDragging] = useState(false);
  //используется useRef чтобы не вызывать лишних изменений 
  const dragStart = useRef({ x: 0, y: 0 }); //координаты мыши
  const startPos = useRef({ x: 0, y: 0 }); //координаты окна

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); 
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x: position.x, y: position.y };
    setDragging(true);
  };

  //если флаг dragging меняется то вызывается этот effect
  useEffect(() => {
  if (!dragging) return;

  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({
      x: startPos.current.x + dx,
      y: startPos.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}, [dragging]); 

   const [optionsDepart, setOptionsDepart] = useState<
      { label: string; value: number }[]
    >([])

    const [optionsPosition, setOptionsPosition] = useState<
      { label: string; value: number }[]
    >([])

  useEffect(() => {
        if(!userData?.userId) return
        
       getProfileById(userData?.userId).then(res => {
          setUserData(res)
        })
      }, [userData?.userId]);  

  useEffect(() => {
      getAllDepartments().then(res => {
          const formatted = res.map((item) => ({
                label: item.name,
                value: item.id,
      }))
  
        setOptionsDepart(formatted)
      })
      }, [])

   useEffect(() => {
      if (!user?.departmentId) return; 
      getAllPositionsByDepartamnetId(user?.departmentId || undefined).then(res => {
        const formatted = res.map((item) => ({
            label: item.name,
            value: item.id,
          }))
      
      setOptionsPosition(formatted)
          })  
      }, [user?.departmentId])   


  const selectedStatus = statusValue.find(option => option.value === user?.isActive);
  const selectedDepartment = optionsDepart.find(option => option.value === user?.departmentId);
  const selectedPosition = optionsPosition.find(option => option.value === user?.positionId);


  const validate = () => {
    const newErrors: Partial<ValuesEdit> = {};
    if (!user?.firstName.trim()) newErrors.firstName = 'Заполните имя';
    if (!user?.lastName.trim()) newErrors.lastName = 'Заполните фамилию';
    if (!user?.patronymic.trim()) newErrors.surName = 'Заполните отчество';
    if (!user?.email.trim()) newErrors.email = 'Заполните email';
    if (!user?.isActive) newErrors.isActive = 'Выберите статус';
    if (!user?.departmentId) newErrors.departmentId = 'Выберите отделение';
    if (!user?.positionId) newErrors.positionId = 'Выберите должность';
    return newErrors;
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setUserData(prev => {
      if (!prev) return prev

      return {
        ...prev,
        [name]: value
      }
    })
      setErrors({ ...errors, [name]: '' });
    };

  const handleSelectChange = (field: keyof ValuesEdit) => (selectedOption: SingleValue<Option>) => {
    const value = selectedOption ? selectedOption.value : null;
    setUserData(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value
      };  
    });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSelectDepartamentChange = (field: keyof ValuesEdit) => (selectedOption: SingleValue<OptionDepartmentPosition>) => {
    const value = selectedOption ? selectedOption.value : null;
    setUserData(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value
      };  
    });
    setErrors({ ...errors, [field]: '' });
  };

  //Решить проблему с измением position если departament изменился
  const handleSelectPositionChange = (field: keyof ValuesEdit) => (selectedOption: SingleValue<OptionDepartmentPosition>) => {
    const value = selectedOption ? selectedOption.value : null;
    setUserData(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value
      };  
    });
    setErrors({ ...errors, [field]: '' });
  };

  const handleCheck = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
        onSave(user);
    }
  };

  return (
    <div className="profile-modal-box"
     style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
      }}>
         <div className='header-modal'
         onMouseDown={handleMouseDown}>
            <h2>Изменение пользователя</h2>
            <button className='cross-modal' onClick={onCancelWindow}>
                <FaTimes size={24} color="grey" />
            </button>
        </div>
        <div className='input-box'>
          <div className = 'info-box-modal'>
            <label>Имя</label>
            <input
              type='text'
              name="firstName"
              value={user?.firstName}
              onChange={handleChange}/>
               {errors.firstName && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.firstName}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Фамилия</label>
            <input
              type='text'
              name="lastName"
              value={user?.lastName}
              onChange={handleChange}/>
              {errors.lastName && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.lastName}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Отчество</label>
            <input
              type='text'
              name="surName"
              value={user?.patronymic}
              onChange={handleChange}/>
              {errors.surName && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.surName}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Статус</label>
            <Select
                options={statusValue}
                value={selectedStatus}
                onChange={handleSelectChange('isActive')}
                placeholder="Выберите статус"
                isClearable
                noOptionsMessage={() => "Нет доступных опций"}
                styles={{
                    control: (base) => ({ 
                      ...base, 
                      width: '250px',
                      minHeight: '32px',
                      fontSize: '14px',
                      borderRadius: '20px'
                    }),
                    container: (base) => ({ ...base, width: '250px', borderRadius: '20px' })
                  }}
              />
              {errors.isActive && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.isActive}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Отделение</label>
          <Select
                options={optionsDepart}
                value={selectedDepartment}
                onChange={handleSelectDepartamentChange('departmentId')}
                placeholder="Выберите отделение"
                isClearable
                noOptionsMessage={() => "Нет доступных опций"}
                styles={{
                    control: (base) => ({ 
                      ...base, 
                      width: '250px',
                      minHeight: '32px',
                      fontSize: '14px',
                      borderRadius: '20px'
                    }),
                    container: (base) => ({ ...base, width: '250px', borderRadius: '20px' })
                  }}
              />
              {errors.departmentId && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.departmentId}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Email</label>
            <input
              type='text'
              name="email"
              value={user?.email}
              onChange={handleChange}/>
                {errors.email && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.email}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Должность</label>
            <Select
                options={optionsPosition}
                value={selectedPosition}
                onChange={handleSelectPositionChange('positionId')}
                placeholder="Выберите должность"
                isClearable
                noOptionsMessage={() => "Нет доступных опций"}
                styles={{
                    control: (base) => ({ 
                      ...base, 
                      width: '250px',
                      minHeight: '32px',
                      fontSize: '14px',
                      borderRadius: '20px'
                    }),
                    container: (base) => ({ ...base, width: '250px', borderRadius: '20px' })
                  }}
                  isDisabled={!selectedDepartment}
              />
              {errors.positionId && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.positionId}</p>}
          </div>
        <button className = 'edit-buttom-modal-success-r' onClick={handleCheck}>
          Сохранить
        </button>
      </div>
    </div>
  );
};