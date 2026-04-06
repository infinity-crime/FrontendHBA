/**
 * Обработчик ошибок API
 * Определяет типы ошибок и преобразует их в понятные сообщения пользователю
 */

export interface ApiError {
  type: 'validation' | 'server' | 'network' | 'permission' | 'conflict' | 'unknown';
  title: string;
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * Ошибка 409: Конфликт данных - пользователь с таким login/email уже существует
 */
export const handleConflictError = (error: any): ApiError => {
  const message = error?.response?.data?.message || error?.message || '';
  
  if (message.includes('email') || message.includes('mail')) {
    return {
      type: 'conflict',
      title: 'Email уже используется',
      message: 'Пользователь с таким email уже зарегистрирован в системе.',
      details: 'Пожалуйста, используйте другой email адрес.',
      statusCode: 409,
    };
  }

  if (message.includes('login') || message.includes('username')) {
    return {
      type: 'conflict',
      title: 'Логин уже используется',
      message: 'Пользователь с таким логином уже существует в системе.',
      details: 'Пожалуйста, используйте другой логин.',
      statusCode: 409,
    };
  }

  return {
    type: 'conflict',
    title: 'Конфликт данных',
    message: 'Запрос конфликтует с существующими данными в системе.',
    details: message,
    statusCode: 409,
  };
};

/**
 * Ошибка 403: Доступ запрещен - недостаточные права
 */
export const handlePermissionError = (error: any): ApiError => {
  return {
    type: 'permission',
    title: 'Доступ запрещен',
    message: 'У вас недостаточно прав для выполнения этого действия.',
    details: 'Пожалуйста, свяжитесь с администратором системы.',
    statusCode: 403,
  };
};

/**
 * Ошибка 400: Ошибка валидации - неверные данные
 */
export const handleValidationError = (error: any): ApiError => {
  const message = error?.response?.data?.message || error?.message || '';
  const errors = error?.response?.data?.errors || {};

  const errorDetails = Object.entries(errors)
    .map(([key, value]: [string, any]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n');

  return {
    type: 'validation',
    title: 'Ошибка валидации данных',
    message: 'Проверьте введенные данные и попробуйте снова.',
    details: errorDetails || message,
    statusCode: 400,
  };
};

/**
 * Ошибка 500: Серверная ошибка
 */
export const handleServerError = (error: any): ApiError => {
  const message = error?.response?.data?.message || 'Неизвестная ошибка сервера';
  
  return {
    type: 'server',
    title: 'Ошибка сервера',
    message: 'На сервере произошла ошибка. Пожалуйста, попробуйте позже.',
    details: message,
    statusCode: error?.response?.status || 500,
  };
};

/**
 * Ошибка сети - сервер недоступен
 */
export const handleNetworkError = (error: any): ApiError => {
  if (error?.code === 'ECONNABORTED') {
    return {
      type: 'network',
      title: 'Время ожидания истекло',
      message: 'Запрос выполнялся слишком долго. Проверьте подключение к интернету.',
      details: 'Пожалуйста, попробуйте еще раз.',
    };
  }

  return {
    type: 'network',
    title: 'Ошибка подключения',
    message: 'Не удалось подключиться к серверу. Проверьте подключение к интернету.',
    details: 'Убедитесь, что вы подключены к интернету, и попробуйте еще раз.',
  };
};

/**
 * Главный обработчик ошибок API
 */
export const handleApiError = (error: any): ApiError => {
  if (!error) {
    return {
      type: 'unknown',
      title: 'Неизвестная ошибка',
      message: 'Произошла непредвиденная ошибка.',
    };
  }

  // Проверяем статус код
  const status = error?.response?.status;

  switch (status) {
    case 400:
      return handleValidationError(error);
    case 403:
      return handlePermissionError(error);
    case 409:
      return handleConflictError(error);
    case 500:
    case 502:
    case 503:
      return handleServerError(error);
    default:
      // Проверяем на сетевые ошибки
      if (error?.code === 'ECONNABORTED' || error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
        return handleNetworkError(error);
      }

      // Если нет ответа от сервера
      if (!error?.response) {
        return handleNetworkError(error);
      }

      // Неизвестная ошибка
      return {
        type: 'unknown',
        title: 'Ошибка',
        message: error?.response?.data?.message || error?.message || 'Произошла ошибка при обработке запроса.',
        statusCode: status,
      };
  }
};
