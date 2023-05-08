import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import React from 'react';
import {Wrapper} from 'src/screens/wrapper';
import {NavigationContainer} from '@react-navigation/native';
import {colors} from 'src/styles/colors';

const theme = {
  ...DefaultTheme,
  colors,
};

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Wrapper />
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
