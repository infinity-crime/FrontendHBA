/**
 * ФАЙЛ С ПРИМЕРАМИ ИСПОЛЬЗОВАНИЯ КОМПОНЕНТОВ ДЛЯ ОБРАБОТКИ ОШИБОК
 * 
 * Этот файл показывает, как использовать компоненты обработки ошибок
 * в реальных компонентах приложения
 */

// ============================================================
// ПРИМЕР 1: Использование ErrorModal в LoginForm
// ============================================================

/*
import { ErrorModal } from '../modalWindows/ErrorModal';
import { validateLoginForm } from '../../service/validators/formValidators';

export const LoginForm = () => {
  const [errorModal, setErrorModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    errorType: 'validation' as const 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateLoginForm(email, password);
    
    if (!validation.isValid) {
      setErrorModal({
        isOpen: true,
        title: 'Ошибка валидации входа',
        message: 'Пожалуйста, проверьте введенные данные',
        errorType: 'validation',
      });
      return;
    }
    
    // Выполнить вход...
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Формы */}
      </form>
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        errorType={errorModal.errorType}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};
*/

// ============================================================
// ПРИМЕР 2: Использование ErrorModal для ошибок API
// ============================================================

/*
import { handleApiError } from '../../service/errorHandlers/apiErrorHandler';
import { ErrorModal } from '../modalWindows/ErrorModal';

export const AddUser = () => {
  const [errorModal, setErrorModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    details: '',
    errorType: 'validation' as const 
  });

  const handleAddUser = async (userData) => {
    try {
      await addUserApi(userData);
      // Успех - показать сообщение
    } catch (error) {
      const apiError = handleApiError(error);
      setErrorModal({
        isOpen: true,
        title: apiError.title,
        message: apiError.message,
        details: apiError.details || '',
        errorType: apiError.type as any,
      });
    }
  };

  return (
    <div>
      <button onClick={() => handleAddUser(userData)}>
        Добавить пользователя
      </button>
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
        errorType={errorModal.errorType}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};
*/

// ============================================================
// ПРИМЕР 3: Использование FieldError для ошибок полей
// ============================================================

/*
import { FieldError } from '../errors/ValidationError';
import { validateEmail } from '../../service/validators/formValidators';

export const UserForm = () => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailErrors = validateEmail(e.target.value);
    setErrors(emailErrors);
  };

  return (
    <div>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        onBlur={() => setTouched(true)}
      />
      {touched && errors.length > 0 && (
        <FieldError error={errors[0]} touched />
      )}
    </div>
  );
};
*/

// ============================================================
// ПРИМЕР 4: Использование ValidationError для списка ошибок
// ============================================================

/*
import { ValidationError } from '../errors/ValidationError';
import { validateUserProfile } from '../../service/validators/formValidators';

export const UserProfileForm = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = () => {
    const validation = validateUserProfile(formData);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // Отправить форму...
  };

  return (
    <div>
      <ValidationError errors={validationErrors} position="top" />
      
      {/* Форма */}
    </div>
  );
};
*/

// ============================================================
// ПРИМЕР 5: Полный пример формы с всеми типами ошибок
// ============================================================

/*
import { useState } from 'react';
import { ErrorModal } from '../modalWindows/ErrorModal';
import { FieldError, ValidationError } from '../errors/ValidationError';
import { validateFileUpload } from '../../service/validators/formValidators';
import { handleApiError } from '../../service/errorHandlers/apiErrorHandler';

export const CompleteExampleForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [errorModal, setErrorModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    details: '',
    errorType: 'validation' as const 
  });

  // Обработка выбора файла
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    // Валидация файла
    const validation = validateFileUpload(selectedFile);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      setErrorModal({
        isOpen: true,
        title: 'Ошибка при загрузке файла',
        message: validation.errors.file?.[0] || 'Ошибка валидации',
        details: 'Пожалуйста, выберите изображение размером не более 5MB',
        errorType: 'validation',
      });
      return;
    }

    setFile(selectedFile);

    // Отправить на сервер
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Успех
    } catch (error) {
      const apiError = handleApiError(error);
      setErrorModal({
        isOpen: true,
        title: apiError.title,
        message: apiError.message,
        details: apiError.details || '',
        errorType: apiError.type as any,
      });
    }
  };

  return (
    <div>
      <ValidationError errors={validationErrors} position="top" />
      
      <input
        type="file"
        onChange={handleFileSelect}
        accept="image/*"
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
        errorType={errorModal.errorType}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};
*/

// ============================================================
// ТИПЫ ОШИБОК И ИХ ИСПОЛЬЗОВАНИЕ
// ============================================================

/**
 * Типы ошибок:
 * 
 * 1. 'validation' - Ошибки валидации (оранжевый цвет)
 *    - Пустые обязательные поля
 *    - Неверный формат данных
 *    - Ошибки валидации файлов
 * 
 * 2. 'server' - Ошибки сервера (красный цвет)
 *    - HTTP 500, 502, 503: Internal Server Error
 *    - Неожиданная ошибка на сервере
 * 
 * 3. 'network' - Ошибки сети (розовый цвет)
 *    - Сервер недоступен
 *    - Проблема с интернет-соединением
 *    - Timeout при запросе
 * 
 * 4. 'permission' - Доступ запрещен (фиолетовый цвет)
 *    - HTTP 403: Forbidden
 *    - Недостаточно прав для операции
 * 
 * 5. 'conflict' - Конфликт данных (красно-оранжевый)
 *    - HTTP 409: Conflict
 *    - Email/user/name уже существует
 *    - Дублирование данных
 */

export const ERROR_HANDLING_EXAMPLES = {
  validation: {
    type: 'validation',
    title: 'Ошибка валидации',
    message: 'Пожалуйста, проверьте введенные данные',
    color: '#ff9800', // Orange
  },
  server: {
    type: 'server',
    title: 'Ошибка сервера',
    message: 'На сервере произошла ошибка. Пожалуйста, попробуйте позже.',
    color: '#f44336', // Red
  },
  network: {
    type: 'network',
    title: 'Ошибка подключения',
    message: 'Не удалось подключиться к серверу',
    color: '#e91e63', // Pink
  },
  permission: {
    type: 'permission',
    title: 'Доступ запрещен',
    message: 'У вас недостаточно прав для выполнения этого действия',
    color: '#9c27b0', // Purple
  },
  conflict: {
    type: 'conflict',
    title: 'Конфликт данных',
    message: 'Запрос конфликтует с существующими данными',
    color: '#ff5722', // Deep Orange
  },
};
