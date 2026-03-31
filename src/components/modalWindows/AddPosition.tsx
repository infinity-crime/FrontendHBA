import '../style/ModelWindows.css';
import { FaTimes } from 'react-icons/fa';
import { useState, useEffect, useRef} from 'react';
import type {CreatePositionRequest} from '../types/Position.ts';
import Select from 'react-select';
import type { SingleValue} from 'react-select';
import { getAllDepartments } from '../../service/apiService/departamentsService.ts';

interface AddPositionProps {
  onAddPosition:(userData: CreatePositionRequest) => void;
  onCancelWindow: () => void;
}

type OptionDepartmentPosition = {
    value: number;
    label: string;
}

interface AddPositionValues {
  department: string;
  position: string;
}  

export const AddPosition = ({onCancelWindow, onAddPosition}: AddPositionProps) => {

  const [singleSelectedDepartament, setSingleSelectedDepartament] = useState<SingleValue<OptionDepartmentPosition>>(null);
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Partial<AddPositionValues>>({});
  
  //начальная позиция окна (центр экрана)
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
  
  // запросы на получения всех отделов
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
    const newErrors: Partial<AddPositionValues> = {};
    if (!singleSelectedDepartament) newErrors.department = 'Выберите отдел';
    if (!name.trim()) newErrors.position = 'Заполните должность';
    return newErrors;
  };

  const handleAddPosition = () => {  
     const validationErrors = validate();
      setErrors(validationErrors);
       if (Object.keys(validationErrors).length === 0) {
          const newPosition :CreatePositionRequest = {
            departmentId: singleSelectedDepartament?.value || 1,
            name: name || "", 
          };
          onAddPosition(newPosition);
          setSingleSelectedDepartament(null);
          setName('');
          onCancelWindow();
      }
    };

    const handleSingleChangeDepartment = (newValue: SingleValue<OptionDepartmentPosition>) => {
        setSingleSelectedDepartament(newValue);
      };
  
  return (
    <div className='profile-modal-box position'
     style={{
        left: position.x,
        top: position.y,
      }}>
            <div className='header-modal'
            onMouseDown={handleMouseDown}>
                <h2>Добавление должности</h2>
                <button className='cross-modal' onClick={onCancelWindow}>
                    <FaTimes size={24} color="grey" />
                </button>
            </div>
          <div>
            <div className = 'info-box-modal-name'>
              <label>Отделение</label>
              <Select
                options={optionsDepart}
                value={singleSelectedDepartament}
                onChange={handleSingleChangeDepartment}
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
                  container: (base) => ({ ...base, width: '250px' }),
                }}
              />
                {errors.department && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.department}</p>}
              <label>Должность</label>
                <input 
                type='text'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                }}
                disabled={!singleSelectedDepartament}
                />
                {errors.position && <p style={{ color: 'red', fontSize: '12px', marginBottom: 0 }}>{errors.position}</p>}
            </div>
          </div>
        <button className = 'edit-buttom-modal-success' onClick={handleAddPosition}>
          Добавить
        </button>
      </div>
  );
};