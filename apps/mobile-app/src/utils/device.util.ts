import DeviceInfo from 'react-native-device-info';

export const getDeviceId = async () => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();

    return deviceId;
  } catch (err) {
    return '';
  }
};
