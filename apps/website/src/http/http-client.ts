import Axios from 'axios';

const defaultBaseURL = process.env.NEXT_PUBLIC_API_URL;
const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

export const createAxiosInstance = (baseURL = defaultBaseURL) => {
  return Axios.create({
    baseURL,
    timeout: 90000,
    withCredentials: isProduction,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
