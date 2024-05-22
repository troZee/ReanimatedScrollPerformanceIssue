import React from 'react';
import {View} from 'react-native';

import {Picker} from './Picker';

function App() {
  return (
    <View style={{flexDirection: 'row'}}>
      <Picker />
      <Picker />
      <Picker />
    </View>
  );
}

export default App;
