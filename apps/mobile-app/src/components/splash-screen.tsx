import React, { FC, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

type SplashScreenProps = {
  onAnimationEnd: () => void;
};

const SplashScreen: FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const { configs } = useCoreUITheme();
  const splashOpacity = useSharedValue(0);

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  useEffect(() => {
    splashOpacity.value = withTiming(1, { duration: 600 }, () => {
      splashOpacity.value = withDelay(
        3500,
        withTiming(0, { duration: 600 }, finished => {
          if (finished) {
            runOnJS(onAnimationEnd)();
          }
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        ds.flex1,
        ds.itemsCenter,
        ds.justifyCenter,
        ds.absolute,
        ds.hFull,
        ds.wFull,
        ds.top0,
        ds.left0,
        animatedSplashStyle,
        dynamicStyles.background(configs.background),
      ]}
    >
      <LottieView autoPlay loop={false} source={require('@/assets/animations/anim-react-native.json')} style={[ds.w208, ds.h208]} />
    </Animated.View>
  );
};

export default SplashScreen;
