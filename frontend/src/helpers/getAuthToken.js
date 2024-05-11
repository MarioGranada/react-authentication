import { getTokenDuration } from './getTokenDuration';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return 'EXPIRED';
  }

  return token;
};

export default getAuthToken;
