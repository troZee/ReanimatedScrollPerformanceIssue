import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, View} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {PickerText} from './PickerText';

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

function PickerInternal(): React.JSX.Element {
  const {cellSize, setCellSize} = useContext(PickerContext);
  const translationY = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y / cellSize;
    //const currentIndex = Math.round(event.contentOffset.y / cellSize);
  });

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentIndex = Math.round(e.nativeEvent.contentOffset.y / cellSize);
      if (currentIndex !== selectedIndex) {
        setSelectedIndex(currentIndex);
      }
    },
    [cellSize, selectedIndex],
  );

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
        onScroll={scrollHandler}
        onMomentumScrollEnd={onScrollEnd}>
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

function Picker() {
  const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
  const [isReady, setIsReady] = useState(false);

  return (
    <PickerContext.Provider
      value={{
        cellSize,
        setCellSize: size => {
          setIsReady(true);
          setCellSize(size);
        },
      }}>
      <View style={{opacity: isReady ? 1 : 0, width: '33%'}}>
        <PickerInternal />
      </View>
    </PickerContext.Provider>
  );
}

export {Picker};
