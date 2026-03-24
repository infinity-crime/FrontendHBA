export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: number | undefined;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "userRole"?: string;
  "exp"?: number;
  "iss"?: string;
  "aud"?: string;
}