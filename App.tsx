import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import React from 'react';
import {Wrapper} from 'src/screens/wrapper';
import {NavigationContainer} from '@react-navigation/native';
import {colors} from 'src/styles/colors';
import {Provider} from 'react-redux';
import {persistor, store} from 'src/stores/store';
import {PersistGate} from 'redux-persist/integration/react';

const theme = {
  ...DefaultTheme,
  colors,
};

function App() {
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <SafeAreaProvider>
              <Wrapper />
            </SafeAreaProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </PaperProvider>
  );
}

export default App;
