import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import Heading from '@repo/react-native-ui-core/components/heading';
import Separator from '@repo/react-native-ui-core/components/separator';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

interface IModalConfirmProps {
  visible?: boolean;
  title?: string;
  message?: string;
  btnConfirmText?: string;
  btnCancelText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const ModalConfirm: FC<IModalConfirmProps> = ({ title, message, btnConfirmText, btnCancelText, onCancel, onConfirm }) => {
  const { t } = useTranslation();
  const { configs } = useCoreUITheme();

  return (
    <View style={[ds.column, { backgroundColor: configs.card }]}>
      <View style={ds.p20}>
        <Heading as="h4">{title}</Heading>
        <Text fontWeight="Medium" style={ds.mt20}>
          {message}
        </Text>
      </View>
      <Separator />
      <View style={ds.row}>
        <Pressable style={[ds.grow, ds.minW144]} onPress={onCancel}>
          <Text fontWeight="Bold" style={[ds.textCenter, ds.px20, ds.py16]}>
            {btnCancelText || t('cancel')}
          </Text>
        </Pressable>
        <Separator orientation="vertical" />
        <Pressable style={[ds.grow, ds.minW144]} onPress={onConfirm}>
          <Text fontWeight="Bold" color={configs.primary[500]} style={[ds.textCenter, ds.px20, ds.py16]}>
            {btnConfirmText || t('confirm')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ModalConfirm;
