import { IRudderStackConfig } from '../interfaces/analytics.interface';

export const defaultRudderStackConfig: IRudderStackConfig = {
  writeKey: process.env.RUDDER_STACK_WRITE_KEY,
  dataPlaneUrl: process.env.RUDDER_STACK_DATA_PLANE_URL,
};
