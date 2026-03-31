import '../style/ModelWindows.css';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { getAllDepartments } from '../../service/apiService/departamentsService.ts';
import type { DepartmentPositionResponse } from '../types/DepartmentPosition.ts';

interface EditPositionProps {
  onCancelWindow: () => void;
  positionData: DepartmentPositionResponse;
  onSave:(positionData: DepartmentPositionResponse | null) => void;
}

export type EditPositionValue = {
    position:string;
}

export const EditPosition = ({onCancelWindow, onSave, positionData}: EditPositionProps) => {

   const [positions, setPositionData] = useState<DepartmentPositionResponse| null>(positionData);
   const [errors, setErrors] = useState<Partial<EditPositionValue>>({});

   //начальная позиция окна - центр экрана
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 200 });
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

    const selectedDepartment = optionsDepart.find(option => option.value === positions?.department.id);

    useEffect(() => {
          getAllDepartments().then(res => {
              const formatted = res.map((item) => ({
                    label: item.name,
                    value: item.id,
          }))
          setOptionsDepart(formatted)
          })
    }, [])
    
   const validate = () => {
    const newErrors: Partial<EditPositionValue> = {};
    if (!positions?.position.name.trim()) newErrors.position = 'Заполните должность';
    return newErrors;
  };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setPositionData(prev => {
      if (!prev) return prev

      return {
        ...prev,
        position: {
        ...prev.position,
        name: value,   
        },
      };  
    })
      setErrors({ ...errors, [name]: '' });
    };

    const handleCheck = () => {
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            onSave(positions);
        }
    };

  return (
    <div className='profile-modal-box  position'
     style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
      }}>
            <div className='header-modal'
            onMouseDown={handleMouseDown}>
                <h2>Изменение должности</h2>
                <button className='cross-modal' onClick={onCancelWindow}>
                    <FaTimes size={24} color="grey" />
                </button>
            </div>
          <div>
            <div className = 'info-box-modal-name'>
              <label>Должность</label>
              <input 
                type='text'
                value={positions?.position.name}
                onChange={handleChange}
                disabled={!selectedDepartment}
                />
             {errors.position && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.position}</p>}
            </div>
          </div>
        <button className = 'edit-buttom-modal-success' onClick={handleCheck}>
          Изменить
          </button>
      </div>
  );
};