import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import {useFarm} from 'src/stores/slices/farm.slice';
import {strings} from 'src/locales/locales';
import {Screens} from 'src/navigation/screens';
import {Logout} from 'src/screens/main/logout';

type ScenarioType = 'CreateWorker' | 'GiveQrCode';

export type DrawerStackParamList = {
  Home: undefined;
  CreateWorker: undefined;
  GiveQrCode: undefined;
  Templates: undefined;
  ScanQrCode: {scenario: ScenarioType};
  SuccessPage: {scenario: ScenarioType};
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
        options={{
          ...options,
          drawerItemStyle: {display: 'none'},
          title: farmName,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          ...options,
          drawerItemStyle: {display: 'none'},
          title: '',
        }}
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
      <DrawerComponent.Screen
        component={Screens.Templates}
        name="Templates"
        options={{...options, title: strings.templates}}
      />
      <DrawerComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{...options, drawerItemStyle: {display: 'none'}}}
      />
    </DrawerComponent.Navigator>
  );
};

export default DrawerStack;
