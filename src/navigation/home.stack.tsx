import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';

export type HomeStackParamList = {
  Home: undefined;
};

const HomeStackComponent = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <HomeStackComponent.Navigator initialRouteName="Home">
      <HomeStackComponent.Screen
        component={Screens.Home}
        name="Home"
        options={{
          headerShown: false,
        }}
      />
    </HomeStackComponent.Navigator>
  );
};

export default HomeStack;
