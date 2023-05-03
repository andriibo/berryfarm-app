import LandingPage from './src/screens/landing/Landing';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import React from 'react';

function App() {
  return (
    <SafeAreaProvider>
      <LandingPage />
    </SafeAreaProvider>
  );
}

export default App;
