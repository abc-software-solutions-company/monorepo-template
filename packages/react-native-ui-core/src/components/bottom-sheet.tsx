import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import { useCoreUITheme } from '../themes/theme.context';

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  initialIndex?: number;
  style?: ViewStyle;
  onPresent?: () => void;
  onDismiss?: () => void;
};

export type BottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

const CustomBackdrop = ({ animatedIndex, onDismiss }: BottomSheetBackdropProps & { onDismiss: () => void }) => {
  const animatedOpacity = useSharedValue(0);

  useAnimatedReaction(
    () => animatedIndex.value,
    currentIndex => {
      const newOpacity = interpolate(currentIndex, [0, 1], [0, 0.5], Extrapolation.CLAMP);

      animatedOpacity.value = withTiming(newOpacity, { duration: 150 });
    },
    [animatedIndex]
  );

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, ds.bgBlack, containerAnimatedStyle]}>
      <Pressable style={ds.flex1} onPress={onDismiss} />
    </Animated.View>
  );
};

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, snapPoints = ['50%', '50%'], initialIndex = 1, style, onPresent, onDismiss }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { configs } = useCoreUITheme();

    const handlePresent = useCallback(() => {
      bottomSheetModalRef.current?.present();
      onPresent?.();
    }, [onPresent]);

    const handleDismiss = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
      onDismiss?.();
    }, [onDismiss]);

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      dismiss: handleDismiss,
    }));

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <CustomBackdrop {...props} onDismiss={handleDismiss} />, [handleDismiss]);

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={initialIndex}
          snapPoints={snapPoints}
          backgroundComponent={null}
          backdropComponent={renderBackdrop}
          style={[ds.rounded12, dynamicStyles.background(configs.background), style]}
          onDismiss={onDismiss}
        >
          {children}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

export { BottomSheet };
