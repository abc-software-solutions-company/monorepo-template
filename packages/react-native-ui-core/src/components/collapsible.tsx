import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, LayoutChangeEvent, Platform, UIManager, View, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CollapsibleProps = {
  expanded: boolean;
  children: ReactNode;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  style?: ViewStyle;
};

const Collapsible: React.FC<CollapsibleProps> = ({ expanded, children, onAnimationStart, onAnimationEnd, style }) => {
  const animationHeight = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const initialRender = useRef(true);

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;

    setContentHeight(height);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (expanded) {
        animationHeight.setValue(1);
      }

      return;
    }

    if (onAnimationStart) {
      onAnimationStart();
    }

    Animated.timing(animationHeight, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    });
  }, [expanded, animationHeight, onAnimationStart, onAnimationEnd]);

  const height = animationHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  return (
    <Animated.View style={[ds.overflowHidden, style, { height }]}>
      <View style={[ds.absolute, ds.wFull]} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  );
};

export default Collapsible;
