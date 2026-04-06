/**
 * Валидаторы для формул приложения
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Ошибка валидации: Пустые поля при входе
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: Record<string, string[]> = {};

  if (!email || email.trim().length === 0) {
    errors.email = ['Логин не может быть пустым'];
  } else if (email.trim().toLowerCase() !== 'менеджер' && email.trim().toLowerCase() !== 'админ') {
    errors.email = ['Логин должен быть "менеджер" или "админ"'];
  }

  if (!password || password.length === 0) {
    errors.password = ['Пароль не может быть пустым'];
  } else if (password.length < 3) {
    errors.password = ['Пароль должен содержать минимум 3 символа'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Ошибка валидации: Неверный формат email при создании пользователя
export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim().length === 0) {
    errors.push('Email не может быть пустым');
  } else if (!emailRegex.test(email)) {
    errors.push('Email должен быть в формате: example@domain.com');
  } else if (email.length > 100) {
    errors.push('Email не должен превышать 100 символов');
  }

  return errors;
};

// Ошибка валидации: Пустые обязательные поля при создании пользователя
export const validateUserProfile = (data: {
  login?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  departmentId?: number;
  positions?: number[];
}): ValidationResult => {
  const errors: Record<string, string[]> = {};

  if (!data.login || data.login.trim().length === 0) {
    errors.login = ['Логин не может быть пустым'];
  } else if (data.login.length < 3) {
    errors.login = ['Логин должен содержать минимум 3 символа'];
  } else if (data.login.length > 50) {
    errors.login = ['Логин не должен превышать 50 символов'];
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = ['Email не может быть пустым'];
  } else {
    const emailErrors = validateEmail(data.email);
    if (emailErrors.length > 0) {
      errors.email = emailErrors;
    }
  }

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = ['Имя не может быть пустым'];
  } else if (data.firstName.length > 50) {
    errors.firstName = ['Имя не должно превышать 50 символов'];
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = ['Фамилия не может быть пустой'];
  } else if (data.lastName.length > 50) {
    errors.lastName = ['Фамилия не должна превышать 50 символов'];
  }

  if (!data.departmentId || data.departmentId <= 0) {
    errors.departmentId = ['Должен быть выбран отдел'];
  }

  if (!data.positions || data.positions.length === 0) {
    errors.positions = ['Должна быть выбрана минимум одна должность'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Ошибка валидации: Неверные данные при создании позиции
export const validatePosition = (data: {
  name?: string;
  departmentId?: number;
  salary?: number | string;
}): ValidationResult => {
  const errors: Record<string, string[]> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = ['Название должности не может быть пустым'];
  } else if (data.name.length > 100) {
    errors.name = ['Название должности не должна превышать 100 символов'];
  }

  if (!data.departmentId || data.departmentId <= 0) {
    errors.departmentId = ['Должен быть выбран отдел'];
  }

  const salary = typeof data.salary === 'string' ? parseFloat(data.salary) : data.salary;
  if (data.salary === undefined || data.salary === null || data.salary === '') {
    errors.salary = ['Оклад не может быть пустым'];
  } else if (isNaN(salary) || salary < 0) {
    errors.salary = ['Оклад должен быть положительным числом'];
  } else if (salary > 999999999) {
    errors.salary = ['Оклад не должен превышать 999,999,999'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Ошибка валидации: Пустое изображение при обновлении профиля
export const validateFileUpload = (file: File | null, maxSizeMB: number = 5): ValidationResult => {
  const errors: Record<string, string[]> = {};

  if (!file) {
    errors.file = ['Файл не выбран'];
  } else {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.file = [`Размер файла не должен превышать ${maxSizeMB}MB`];
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.file = ['Допустимые форматы: JPEG, PNG, GIF, WebP'];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Ошибка валидации: Пустые поля в форме уведомлений
export const validateNotification = (data: {
  title?: string;
  message?: string;
  type?: string;
}): ValidationResult => {
  const errors: Record<string, string[]> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = ['Заголовок не может быть пустым'];
  } else if (data.title.length > 200) {
    errors.title = ['Заголовок не должен превышать 200 символов'];
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = ['Сообщение не может быть пустым'];
  } else if (data.message.length > 1000) {
    errors.message = ['Сообщение не должно превышать 1000 символов'];
  }

  if (!data.type || type.trim().length === 0) {
    errors.type = ['Тип уведомления должен быть выбран'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
