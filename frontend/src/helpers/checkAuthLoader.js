import { redirect } from 'react-router-dom';
import getAuthToken from './getAuthToken';

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/');
  }

  return null;
}
