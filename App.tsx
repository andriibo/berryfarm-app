import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import React from 'react';
import {Wrapper} from './src/screens/wrapper';
import {NavigationContainer} from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
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
