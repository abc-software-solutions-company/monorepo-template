import Axios from 'axios';

const defaultBaseURL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3500';

export const createAxiosInstance = (baseURL = defaultBaseURL) => {
  return Axios.create({
    baseURL,
    timeout: 90000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
