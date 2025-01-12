import React from 'react';
import { t } from 'i18next';
import { Pressable } from 'react-native';
import { LoginManager } from 'react-native-fbsdk-next';
import { ScrollView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, ds } from '@repo/react-native-design-system';
import Divider from '@repo/react-native-ui-core/components/divider';
import Icon from '@repo/react-native-ui-core/components/icon';
import Text from '@repo/react-native-ui-core/components/text';
import { Theme } from '@repo/react-native-ui-core/interfaces/theme.interface';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';
import { useMutation } from '@tanstack/react-query';

import { ProfileAction } from '../interfaces/profile.interface';

import { hideGlobalModal, showGlobalModal } from '@/components/global-modal/global-modal';
import ModalConfirm from '@/components/modal-confirm';

import AuthApi from '@/modules/auth/api/auth.api';
import { useAuthState } from '@/modules/auth/states/auth.state';
import { LanguageNames } from '@/modules/language/constants/language.constant';
import { useLanguageState } from '@/modules/language/states/language.state';
import { AuthenticatedParamList, ProfileParamList, TravelBottomTabParamList } from '@/modules/navigation/interfaces/navigation.interface';
import { ThemeNames } from '@/modules/theme/constants/theme.constant';

import log from '@/utils/logger.util';

import ProfileActionList from './profile-action-list';
import ProfileAvatar from './profile-avatar';
import ProfileVersion from './profile-version';

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<ProfileParamList>,
  CompositeNavigationProp<StackNavigationProp<TravelBottomTabParamList>, DrawerNavigationProp<AuthenticatedParamList>>
>;

const Profile = () => {
  const navigation = useNavigation<NavigationProps>();
  const authState = useAuthState();
  const { language } = useLanguageState();
  const { theme, configs } = useCoreUITheme();
  const mutation = useMutation({
    mutationFn: () => AuthApi.signOut(),
    onSuccess: () => log.extend('auth').info('Logout Success'),
    onError: error => log.extend('auth').error('Logout Failed', error),
  });

  const profileActions: ProfileAction[] = [
    {
      icon: <Icon size={28} color={configs.primary[500]} name="User" />,
      name: t('edit_your_profile'),
      type: 'sub',
      action: () => navigation.navigate('ProfileEdit'),
    },
    {
      icon: <Icon size={28} color={configs.primary[500]} name="LifeBuoy" />,
      name: t('help_center'),
      type: 'sub',
      action: () => navigation.navigate('HelpCenter'),
    },
    {
      icon: <Icon size={28} color={configs.primary[500]} name="GlobeLock" />,
      name: t('terms_and_conditions'),
      type: 'sub',
      action: () => navigation.navigate('TermsAndConditions'),
    },
    {
      icon: <Icon size={28} color={configs.primary[500]} name="ShieldAlert" />,
      name: t('privacy_policy'),
      type: 'sub',
      action: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      icon: <Icon size={28} color={configs.primary[500]} name="Settings" />,
      name: t('settings'),
      type: 'sub',
      action: () => navigation.navigate('Settings'),
    },
    {
      icon: <Icon size={28} color={configs.primary[500]} name="Languages" />,
      name: t('languages'),
      type: 'sub',
      value: LanguageNames[language as keyof typeof LanguageNames],
      action: () => navigation.navigate('SettingLanguage'),
    },
    {
      icon: <Icon size={28} color={configs.primary[500]} name="Palette" />,
      name: t('themes'),
      type: 'sub',
      value: ThemeNames[theme as Theme],
      action: () => navigation.navigate('SettingTheme'),
    },
  ];

  const handleSignOut = () => {
    authState.signOut();
    GoogleSignin.signOut();
    LoginManager.logOut();
    mutation.mutate();
    hideGlobalModal('modal-confirm');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Divider height={14} />
      <ProfileAvatar />
      <ProfileActionList items={profileActions} style={ds.mt14} />
      <Pressable
        style={[ds.row, ds.itemsCenter, ds.justifyCenter, ds.gap10, ds.p20]}
        onPress={() => {
          showGlobalModal({
            modalKey: 'modal-confirm',
            component: (
              <ModalConfirm
                visible={true}
                title={t('signout_confirm_title')}
                message={t('signout_confirm_message')}
                btnConfirmText={t('confirm')}
                btnCancelText={t('cancel')}
                onConfirm={handleSignOut}
                onCancel={() => hideGlobalModal('modal-confirm')}
              />
            ),
            hideClose: true,
          });
        }}
      >
        <Icon size={28} color={Colors.red[500]} name="LogOut" />
        <Text fontWeight="Bold" color={Colors.red[500]}>
          {t('signout')}
        </Text>
      </Pressable>
      <ProfileVersion style={ds.mt10} />
    </ScrollView>
  );
};

export default Profile;
