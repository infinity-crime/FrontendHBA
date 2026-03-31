// Mock Token Service - генерирует простой JWT токен для разработки
export const generateMockToken = (login: string = ''): string => {
  // Создаём простой JWT токен с необходимыми claims
  // Формат: header.payload.signature
  
  // Header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  // Payload с необходимыми claims
  const payload = {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '1',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': login || 'mockuser',
    'userRole': login === 'админ' ? 'admin' : login === 'менеджер' ? 'manager' : 'user',
    'iat': Math.floor(Date.now() / 1000),
    'exp': Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 дней
  };
  
  // Функция для base64 кодирования, работающая с кириллицей
  const base64UrlEncode = (str: string): string => {
    try {
      // Используем TextEncoder для правильного кодирования UTF-8
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      
      // Конвертируем in base64
      let binary = '';
      for (let i = 0; i < data.length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      
      return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } catch (error) {
      console.error('Base64 encode error:', error);
      // Fallback: используем простое кодирование для ASCII
      return btoa(unescape(encodeURIComponent(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode('mock-signature');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
