import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import HomeStack from './home.stack';
import {useFarm} from 'src/stores/slices/auth.slice';
import {strings} from 'src/locales/locales';

const DrawerComponent = createDrawerNavigator();
const DrawerStack = () => {
  const {farmName} = useFarm();

  return (
    <DrawerComponent.Navigator
      screenOptions={{
        drawerActiveTintColor: colors.black,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 15,
        },
      }}>
      <DrawerComponent.Screen
        component={HomeStack}
        name="Home"
        options={{
          drawerLabel: strings.templates,
          title: farmName,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </DrawerComponent.Navigator>
  );
};

export default DrawerStack;
