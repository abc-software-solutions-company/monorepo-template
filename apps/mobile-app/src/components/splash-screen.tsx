import React, { FC, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { ds } from '~react-native-design-system';

type SplashScreenProps = {
  onAnimationEnd: () => void;
};

const SplashScreen: FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const splashOpacity = useSharedValue(0);

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  useEffect(() => {
    splashOpacity.value = withTiming(1, { duration: 600 }, () => {
      splashOpacity.value = withDelay(
        4000,
        withTiming(0, { duration: 600 }, finished => {
          if (finished) {
            runOnJS(onAnimationEnd)();
          }
        })
      );
    });
  }, []);

  return (
    <Animated.View style={[ds.flex1, ds.itemsCenter, ds.justifyCenter, ds.absolute, ds.hFull, ds.wFull, ds.top0, ds.left0, animatedSplashStyle]}>
      <LottieView autoPlay loop={false} source={require('@/assets/animations/anim-react-native.json')} style={[ds.w208, ds.h208]} />
    </Animated.View>
  );
};

export default SplashScreen;
