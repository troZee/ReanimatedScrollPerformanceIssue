/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {PickerText} from './PickerText';
import {TamaguiProvider, View, createTamagui} from 'tamagui';
import {config} from '@tamagui/config/v3';
const tamaguiConfig = createTamagui(config);

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  // or 'tamagui'
  interface TamaguiCustomConfig extends Conf {}
}

const renderCount = 10;
export const EMPTY_CHAR = '‎';

type PickerContext = {
  cellSize: number;
  setCellSize: Dispatch<SetStateAction<number>>;
};

const INITIAL_CELL_SIZE = 36;
const PickerContext = createContext<PickerContext>({
  cellSize: INITIAL_CELL_SIZE,
  setCellSize: () => {},
});

function Root(): React.JSX.Element {
  const {cellSize, setCellSize} = useContext(PickerContext);
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
          <View
            style={{paddingVertical: 8}}
            onLayout={
              x > 0 ? undefined : e => setCellSize(e.nativeEvent.layout.height)
            }
            key={x}>
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

function App() {
  const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
  const [isReady, setIsReady] = useState(false);

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <PickerContext.Provider
        value={{
          cellSize,
          setCellSize: size => {
            setIsReady(true);
            setCellSize(size);
          },
        }}>
        <View style={{opacity: isReady ? 1 : 0}}>
          <Root />
        </View>
      </PickerContext.Provider>
    </TamaguiProvider>
  );
}

export default App;
