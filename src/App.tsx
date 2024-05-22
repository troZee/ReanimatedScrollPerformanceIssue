import React from 'react';
import {Picker} from './Picker';

import {TamaguiProvider, View, createTamagui} from 'tamagui';
import {config} from '@tamagui/config/v3';
const tamaguiConfig = createTamagui(config);

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig;
declare module 'tamagui' {
  // or 'tamagui'
  interface TamaguiCustomConfig extends Conf {}
}

function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <View style={{flexDirection: 'row'}}>
        <Picker />
        <Picker />
        <Picker />
      </View>
    </TamaguiProvider>
  );
}

export default App;
