import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {colors} from 'src/styles/colors';

export type AuthStackParamList = {
  ChooseFarm: undefined;
  Login: undefined;
};

const AuthStackComponent = createNativeStackNavigator<AuthStackParamList>();

const options = {
  title: '',
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerShadowVisible: false,
};

export const AuthStack = () => {
  return (
    <AuthStackComponent.Navigator initialRouteName="ChooseFarm">
      <AuthStackComponent.Screen
        component={Screens.ChooseFarm}
        name="ChooseFarm"
        options={{...options, header: () => null}}
      />
      <AuthStackComponent.Screen
        component={Screens.Login}
        name="Login"
        options={{...options}}
      />
    </AuthStackComponent.Navigator>
  );
};

export default AuthStack;