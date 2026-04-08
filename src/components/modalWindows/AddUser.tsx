import '../style/ModelWindows.css';
import { FaTimes } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import type { AdminCreateProfileRequest } from '../types/Admin.ts';
import { getAllDepartments} from '../../service/apiService/departamentsService.ts';
import Select from 'react-select';
import type { SingleValue} from 'react-select';
import {getAllPositionsByDepartamnetId} from '../../service/apiService/positionService.ts';
import { IMaskInput } from "react-imask";
import { ErrorModal } from './ErrorModal.tsx';
import { validateEmail } from '../../service/validators/formValidators.ts';
import { handleApiError } from '../../service/errorHandlers/apiErrorHandler.ts';

interface AddUserProps {
   onCancelWindow: () => void;
   onAddUser:(userData: AdminCreateProfileRequest) => void;
}

type CountryOption = {
  value: string;
  label: string;
  mask: string;
  placeholder: string;
};

const countryOptions: CountryOption[] = [
  {
    value: "by",
    label: "🇧🇾 +375 Belarus",
    mask: "+{375} (00) 000-00-00",
    placeholder: "+375 (__) ___-__-__",
  },
  {
    value: "ru",
    label: "🇷🇺 +7 Russia",
    mask: "+{7} (000) 000-00-00",
    placeholder: "+7 (___) ___-__-__",
  }
];

interface Values {
  firstName: string;
  lastName: string;
  surName: string;
  email: string;
  phoneNumber: string;
  dataOfBirth: string;
  department: string;
  position: string;
}

type OptionDepartmentPosition = {
    value: number;
    label: string;
};

export const AddUser = ({onCancelWindow, onAddUser}: AddUserProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(countryOptions[0]);

  const [singleSelectedDepartament, setSingleSelectedDepartament] = useState<SingleValue<OptionDepartmentPosition>>(null);
  const [singleSelectedPosition, setSingleSelectedPosition] = useState<SingleValue<OptionDepartmentPosition>>(null);
  
  const [errorModal, setErrorModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    details: '',
    errorType: 'validation' as const 
  });

 //начальная позиция окна
  const [position, setPosition] = useState({ x: 500, y: 500 });
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
          getAllDepartments().then(res => {
              const formatted = res.map((item) => ({
                    label: item.name,
                    value: item.id,
          }))
      
            setOptionsDepart(formatted)
          })
    }, [])

     useEffect(() => {
           getAllPositionsByDepartamnetId(singleSelectedDepartament?.value || undefined).then(res => {
                const formatted = res.map((item) => ({
                    label: item.name,
                    value: item.id,
                }))
    
          setOptionsPosition(formatted)
        })
    }, [singleSelectedDepartament])


  const [errors, setErrors] = useState<Partial<Values>>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [surName, setSurName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dataOfBirth, setDataOfBirth] = useState('');
  const [email, setEmail] = useState('');

  const handleCountryChange = (option: SingleValue<CountryOption>) => {
    if (!option) return;

    setSelectedCountry(option);
    setPhoneNumber("");
  };


  const handleSingleChange1 = (newValue: SingleValue<OptionDepartmentPosition>) => {
    setSingleSelectedDepartament(newValue);
    setSingleSelectedPosition(null);
  };

  const handleSingleChange2 = (newValue: SingleValue<OptionDepartmentPosition>) => {
    setSingleSelectedPosition(newValue);
  };

  const validate = () => {
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    const requiredLength =
    selectedCountry.value === "ru" ? 11 : 12;
    const newErrors: Partial<Values> = {};
    if (!firstName.trim()) newErrors.firstName = 'Заполните имя';
    if (!lastName.trim()) newErrors.lastName = 'Заполните фамилию';
    if (!surName.trim()) newErrors.surName = 'Заполните отчество';
    if (!email.trim()) {
        newErrors.email = 'Заполните email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Некорректный email';
      }
    if (!phoneNumber.trim())
      { 
        newErrors.phoneNumber = 'Заполните номер телефона'
      }else
        if (digitsOnly.length !== requiredLength) {
          newErrors.phoneNumber = `Номер должен содержать ${requiredLength} цифр`
       } 
      if (!dataOfBirth.trim()) {
        newErrors.dataOfBirth = 'Заполните дату рождения';
      } else {
        const birthDate = new Date(dataOfBirth);

        const birthYear = birthDate.getFullYear();
        const currentYear = new Date().getFullYear();

        if (birthYear < 1950 || birthYear > currentYear) {
          newErrors.dataOfBirth = `Год должен быть от 1950 до ${currentYear}`;
          return newErrors;
        }

        const today = new Date();
        let age = currentYear - birthYear;
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < 18) {
          newErrors.dataOfBirth = 'Вам должно быть 18 лет или больше';
        }
      }
    if (!singleSelectedDepartament) newErrors.department = 'Выберите отделение';
    if (!singleSelectedPosition) newErrors.position = 'Выберите должность';
    return newErrors;
  };

  const handleAdd = () => {  

      const cleaned = phoneNumber.replace(/[^\d+]/g, "")
    const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const newUser :AdminCreateProfileRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        patronymic: surName.trim(),
        phoneNumber:cleaned,
        birthDate: dataOfBirth.trim(),
        departmentId: singleSelectedDepartament?.value || 1,
        hireDate: new Date().toISOString(),
        email: email.trim(),
        positionId: singleSelectedPosition?.value || 1,  
    };

      try {
        onAddUser(newUser);
        setSingleSelectedDepartament(null);
        setSingleSelectedPosition(null);
        setFirstName('');
        setLastName('');
        setSurName('');
        setEmail('');
        setPhoneNumber('');
        setDataOfBirth('');
        onCancelWindow(); 
      } catch (error) {
        const apiError = handleApiError(error);
        setErrorModal({
          isOpen: true,
          title: apiError.title,
          message: apiError.message,
          details: apiError.details || '',
          errorType: (apiError.type as any) || 'server',
        });
      }
      }
  };

  return (
    <>
      <div className="profile-modal-box"

       style={{
          left: position.x,
          top: position.y,
        }}>
          <div className='header-modal'
          onMouseDown={handleMouseDown}>
              <h2>Добавление пользователя</h2>
              <button className='cross-modal' onClick={onCancelWindow}>
                  <FaTimes size={24} color="grey" />
              </button>
          </div>
        <div className='input-box'>
          <div className = 'info-box-modal'>
            <label>Имя</label>
            <input 
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFirstName(e.target.value);
              }}/>
              {errors.firstName && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.firstName}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Фамилия</label>
          <input 
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLastName(e.target.value);
              }}/>
                {errors.lastName && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0}}>{errors.lastName}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Отчество</label>
          <input 
            value={surName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSurName(e.target.value);
              }}/>
                {errors.surName && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.surName}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Дата рождения</label>
          <input 
            type='date'
            min="2026-01-01"
            max="2026-12-31"
            value={dataOfBirth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDataOfBirth(e.target.value);
                }}/>
                {errors.dataOfBirth && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.dataOfBirth}</p>}
          </div>
          <div className = 'info-box-modal'>
             <label>Номер телефона</label>
            <div className='phone-wrapper'>
                <Select
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                styles={{
                  container: (base) => ({
                    ...base,
                    width: 100,
                  }),
                  control: (base) => ({
                    ...base,
                    height: 35,
                    minHeight: 35,
                    borderRadius: 15,
                  }),
                }}
                />

              <IMaskInput
                  key={selectedCountry.value} 
                  mask={selectedCountry.mask}
                  value={phoneNumber}
                  onAccept={(value) => setPhoneNumber(value)}
                  placeholder={selectedCountry.placeholder}
                  className="phone-input"
              />
            </div>
               {errors.phoneNumber && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.phoneNumber}</p>}
          </div>
          
          <div className = 'info-box-modal'>
            <label>Отделение</label>
            <Select
              options={optionsDepart}
              value={singleSelectedDepartament}
              onChange={handleSingleChange1}
              placeholder="Выберите отделение"
              isClearable
              noOptionsMessage={() => "Нет доступных опций"}
              styles={{
                  control: (base) => ({ 
                    ...base, 
                    width: '250px',
                    minHeight: '40px',
                    fontSize: '14px',
                    borderRadius: '20px'
                  }),
                  container: (base) => ({ ...base, width: '250px', borderRadius: '20px' })
                }}
             />
             {errors.department && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.department}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Email</label>
          <input 
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              }}/>
               {errors.email && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0}}>{errors.email}</p>}
          </div>
          <div className = 'info-box-modal'>
            <label>Должность</label>
            <Select
              options={optionsPosition}
              value={singleSelectedPosition}
              onChange={handleSingleChange2}
              placeholder="Выберите должность"
              isClearable
              noOptionsMessage={() => "Нет доступных опций"}
              styles={{
                  control: (base) => ({ 
                    ...base, 
                    width: '250px',
                    minHeight: '40px',
                    fontSize: '14px',
                    borderRadius: '20px'
                  }),
                  container: (base) => ({ ...base, width: '250px' })
                }}
                isDisabled={!singleSelectedDepartament}
             />
             
             {errors.position && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.position}</p>}
          </div>
          <button className = 'edit-buttom-modal-success' onClick={handleAdd}>
            Добавить
          </button>
        </div>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
        errorType={errorModal.errorType}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </>
  );
};