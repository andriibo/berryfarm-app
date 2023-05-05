import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';

export type LandingStackParamList = {
  Landing: undefined;
};

const LandingStackComponent =
  createNativeStackNavigator<LandingStackParamList>();

export const LandingStack = () => {
  return (
    <LandingStackComponent.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Landing">
      <LandingStackComponent.Screen
        component={Screens.Landing}
        name="Landing"
      />
    </LandingStackComponent.Navigator>
  );
};

export default LandingStack;
