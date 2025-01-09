import Config from 'react-native-config';

import { IRudderStackConfig } from '../interfaces/analytics.interface';

export const defaultRudderStackConfig: IRudderStackConfig = {
  writeKey: Config.RUDDER_STACK_WRITE_KEY,
  dataPlaneUrl: Config.RUDDER_STACK_DATA_PLANE_URL,
};
