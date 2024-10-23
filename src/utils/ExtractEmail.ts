
import { jwtDecode } from 'jwt-decode';

export const getEmailFromToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};
