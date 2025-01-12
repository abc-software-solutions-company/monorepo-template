import React, { FC, useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import Text from '@repo/react-native-ui-core/components/text';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { sleep } from '@/utils/miscs.util';

import { hideGlobalModal } from './global-modal/global-modal';

interface IModalSuccessProps {
  redirectTo?: () => void;
  onClose?: () => void;
}

const ModalSuccess: FC<IModalSuccessProps> = ({ redirectTo }) => {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);
  const { configs } = useCoreUITheme();

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  useEffect(() => {
    const handleModalAndRedirect = async () => {
      await sleep(2500);
      hideGlobalModal('modal-success');
      await sleep(300);
      if (redirectTo) {
        redirectTo();
      }
    };

    handleModalAndRedirect();
  }, [redirectTo]);

  return (
    <View style={[ds.column, ds.justifyCenter, ds.itemsCenter, ds.p20, { backgroundColor: configs.card }]}>
      <LottieView ref={animationRef} loop={false} source={require('@/assets/animations/anim-error.json')} style={[ds.w128, ds.h128]} />
      <Text fontWeight="Bold" style={ds.textCenter}>
        {t('modal_success_message')}
      </Text>
    </View>
  );
};

export default ModalSuccess;
