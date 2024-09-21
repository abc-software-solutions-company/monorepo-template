declare module 'react-native-config' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface NativeConfig {
    APP_ENV: string;
    RN_PUBLIC_API: string;
    RN_GOOGLE_WEB_CLIENT_ID: string;
    RUDDER_STACK_WRITE_KEY: string;
    RUDDER_STACK_DATA_PLANE_URL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
