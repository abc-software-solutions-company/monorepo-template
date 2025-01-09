export function getHeaderTitle(routeName: string) {
  switch (routeName) {
    case 'Profile':
      return 'screen_profile';
    case 'ProfileEdit':
      return 'screen_profile_edit';
    case 'SettingTheme':
      return 'screen_setting_theme';
    default:
      return routeName;
  }
}
