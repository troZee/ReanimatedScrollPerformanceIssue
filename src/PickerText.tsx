import React from 'react';
import type {SharedValue} from 'react-native-reanimated';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {interpolateLinear, interpolateSin} from './interpolate';
import {Text, ViewProps} from 'react-native';

const PICKER_TEXT_MIN_OPACITY = 0.2;
const PICKER_MIN_SCALE = 0.85;
const PICKER_TEXT_ROTATE_X = 30;
const PICKER_TEXT_TRANSLATE_Y = 10;

type PickerTextProps = ViewProps & {
  index: number;
  scrollProgress: SharedValue<number>;
  renderCount: number;
};

const AnimatedPickerText = Animated.createAnimatedComponent(Text);

function PickerText({
  renderCount,
  scrollProgress,
  index,
  ...rest
}: PickerTextProps) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolateSin(
        Math.abs(scrollProgress.value - index),
        [0, renderCount / 2],
        [1, PICKER_TEXT_MIN_OPACITY],
      ),
      transform: [
        {
          scale: interpolateLinear(
            Math.abs(scrollProgress.value - index),
            [0, renderCount / 2],
            [1, PICKER_MIN_SCALE],
          ),
        },
        {
          rotateX: `${interpolateLinear(
            Math.abs(scrollProgress.value - index),
            [-Math.floor(renderCount / 2), Math.floor(renderCount / 2)],
            [-PICKER_TEXT_ROTATE_X, PICKER_TEXT_ROTATE_X],
          )}deg`,
        },
        {
          translateY: interpolateSin(
            scrollProgress.value - index,
            [-Math.floor(renderCount / 2), Math.floor(renderCount / 2)],
            [PICKER_TEXT_TRANSLATE_Y, -PICKER_TEXT_TRANSLATE_Y],
          ),
        },
      ],
    }),
    [renderCount],
  );

  return (
    <AnimatedPickerText
      {...rest}
      style={[
        {
          opacity: PICKER_TEXT_MIN_OPACITY,
          transform: [
            {
              scale: PICKER_MIN_SCALE,
            },
            {
              rotateX: `${PICKER_TEXT_ROTATE_X}deg`,
            },
            {
              translateY: PICKER_TEXT_TRANSLATE_Y,
            },
          ],
        },
        animatedStyle,
      ]}
    />
  );
}

export {PickerText};
