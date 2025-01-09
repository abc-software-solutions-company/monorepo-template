import Axios from 'axios';
import Config from 'react-native-config';

const defaultBaseURL = Config.RN_PUBLIC_API ?? 'http://localhost:3500';

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
