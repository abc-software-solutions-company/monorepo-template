import { AppRegistry, LogBox } from 'react-native';
import '@/locales/i18n';

import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs(['[zustand devtools middleware] Please install/enable Redux devtools extension']);

AppRegistry.registerComponent(appName, () => App);
