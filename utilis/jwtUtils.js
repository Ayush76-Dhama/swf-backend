import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};

export const removeToken = () => {
  localStorage.removeItem('adminToken');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const getAdminInfo = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}; 