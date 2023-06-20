import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import {useFarm} from 'src/stores/slices/auth.slice';
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
  headerOptions: {},
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
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
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerItemStyle: {display: 'flex'},
          title: farmName,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          ...options,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.registration,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.GiveQrCode}
        name="GiveQrCode"
        options={{
          ...options,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.giveQrCode,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.Templates}
        name="Templates"
        options={{
          ...options,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.templates,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <DrawerComponent.Screen
        component={Screens.HandOverHarvest}
        name="HandOverHarvest"
        options={{
          ...options,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
