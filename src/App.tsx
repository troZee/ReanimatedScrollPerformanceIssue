/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {PickerText} from './PickerText';

const cellSize = 36;
const renderCount = 10;
export const EMPTY_CHAR = '‎';

function App(): React.JSX.Element {
  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y / cellSize;
    //const currentIndex = Math.round(event.contentOffset.y / cellSize);
  });

  const paddingCount = Math.floor(renderCount / 2);

  const paddedItems = useMemo(
    () => [
      ...new Array(paddingCount).fill(EMPTY_CHAR),
      ...new Array(50).fill(1),
      ...new Array(paddingCount).fill(EMPTY_CHAR),
    ],
    [paddingCount],
  );

  return (
    <View>
      <Animated.ScrollView
        snapToInterval={cellSize}
        style={{height: cellSize * renderCount}}
        scrollEventThrottle={16}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        onScroll={scrollHandler}>
        {paddedItems.map((_, x) => (
          <View key={x} style={{height: cellSize}}>
            <PickerText
              renderCount={renderCount}
              scrollProgress={translationY}
              index={x - paddingCount}>
              {x}
            </PickerText>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
