import { AppRegistry, LogBox } from 'react-native';

import App from './App';
import { name as appName } from './app.json';

import '@/locales/i18n';

LogBox.ignoreLogs(['[zustand devtools middleware] Please install/enable Redux devtools extension']);

AppRegistry.registerComponent(appName, () => App);
