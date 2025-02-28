import Axios from 'axios';

const defaultBaseURL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3500';

// Check if we're in production environment
const isProduction = import.meta.env.VITE_PUBLIC_APP_ENV === 'production';

export const createAxiosInstance = (baseURL = defaultBaseURL) => {
  return Axios.create({
    baseURL,
    timeout: 90000,
    withCredentials: isProduction, // Only use withCredentials in production
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
