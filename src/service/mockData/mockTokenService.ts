// Mock Token Service - генерирует простой JWT токен для разработки
export const generateMockToken = (): string => {
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
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'mockuser',
    'iat': Math.floor(Date.now() / 1000),
    'exp': Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 дней
  };
  
  // Simple base64 encode
  const base64UrlEncode = (str: string): string => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode('mock-signature');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
