import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import {useFarm} from 'src/stores/slices/farm.slice';
import {strings} from 'src/locales/locales';
import {Screens} from 'src/navigation/screens';
import {Logout} from 'src/screens/main/logout';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {HeaderLeft} from 'src/components/header-left/HeaderLeft';
import {Home} from 'src/screens/main/home';

export type DrawerStackParamList = {
  Home: undefined;
  CreateWorker: undefined;
  GiveQrCode: undefined;
  Templates: undefined;
  HandOverHarvest: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
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
      initialRouteName="Home"
      screenOptions={{
        swipeEnabled: true,
        drawerActiveTintColor: colors.black,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 15,
        },
      }}>
      <DrawerComponent.Screen
        component={Home}
        name="Home"
        options={{
          ...options,
          drawerItemStyle: {display: 'flex'},
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
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.CreateWorker}
        name="CreateWorker"
        options={{
          ...options,
          title: strings.registration,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.GiveQrCode}
        name="GiveQrCode"
        options={{
          ...options,
          title: strings.giveQrCode,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.Templates}
        name="Templates"
        options={{
          ...options,
          title: strings.templates,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.HandOverHarvest}
        name="HandOverHarvest"
        options={{
          ...options,
          drawerItemStyle: {display: 'flex'},
          title: strings.hangOverHarvest,
          headerLeft: () => <HeaderLeft />,
        }}
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
