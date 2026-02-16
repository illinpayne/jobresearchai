import Cookies from 'js-cookie';

export const setSessionToken = (token: string) => {
  Cookies.set('token', token);
};

export const getSessionToken = () => Cookies.get('token');

export const removeSessionToken = () => {
  Cookies.remove('token');
  Cookies.remove('refresh-token');
};
