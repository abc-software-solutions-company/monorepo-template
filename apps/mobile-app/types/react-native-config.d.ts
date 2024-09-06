declare module 'react-native-config' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface NativeConfig {
    RUDDER_STACK_WRITE_KEY: string;
    RUDDER_STACK_DATA_PLANE_URL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
