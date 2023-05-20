import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import {useFarm} from 'src/stores/slices/auth.slice';
import {strings} from 'src/locales/locales';
import {Screens} from 'src/navigation/screens';
import {Logout} from 'src/screens/main/logout';

export type DrawerStackParamList = {
  Home: undefined;
  CreateWorker: undefined;
  GiveQrCode: undefined;
};

const DrawerComponent = createDrawerNavigator<DrawerStackParamList>();
const options = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const DrawerStack = () => {
  const {farmName} = useFarm();

  return (
    <DrawerComponent.Navigator
      drawerContent={Logout}
      screenOptions={{
        drawerActiveTintColor: colors.black,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 15,
        },
      }}>
      <DrawerComponent.Screen
        component={Screens.Home}
        name="Home"
        options={{...options, drawerLabel: strings.templates, title: farmName}}
      />
      <DrawerComponent.Screen
        component={Screens.CreateWorker}
        name="CreateWorker"
        options={{...options, title: strings.registration}}
      />
      <DrawerComponent.Screen
        component={Screens.GiveQrCode}
        name="GiveQrCode"
        options={{...options, title: strings.giveQrCode}}
      />
    </DrawerComponent.Navigator>
  );
};

export default DrawerStack;
