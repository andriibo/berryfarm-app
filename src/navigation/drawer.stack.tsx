import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import {Logout} from 'src/screens/main/logout';
import HandOverHarvestStack from 'src/navigation/handOverHarvest.stack';
import GiveQrCodeStack from 'src/navigation/giveQrCode.stack';
import CreateWorkerStack from 'src/navigation/createWorker.stack';
import HomeStack from 'src/navigation/home.stack';
import {strings} from 'src/locales/locales';
import GetQrCodeInfoStack from 'src/navigation/getQrCodeInfo.stack';

export type DrawerStackParamList = {
  HomeStack: undefined;
  CreateWorkerStack: undefined;
  GiveQrCodeStack: undefined;
  HandOverHarvestStack: undefined;
  GetQrCodeInfoStack: undefined;
};

const DrawerComponent = createDrawerNavigator<DrawerStackParamList>();

export const drawerOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
};

const DrawerStack = () => {
  return (
    <DrawerComponent.Navigator
      drawerContent={Logout}
      initialRouteName="HomeStack"
      screenOptions={{
        swipeEnabled: true,
        drawerActiveTintColor: colors.black,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 15,
        },
      }}>
      <DrawerComponent.Screen
        component={HomeStack}
        name="HomeStack"
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <DrawerComponent.Screen
        component={CreateWorkerStack}
        name="CreateWorkerStack"
        options={{
          headerShown: false,
          title: strings.registration,
        }}
      />
      <DrawerComponent.Screen
        component={HandOverHarvestStack}
        name="HandOverHarvestStack"
        options={{
          headerShown: false,
          title: strings.templates,
        }}
      />
      <DrawerComponent.Screen
        component={GiveQrCodeStack}
        name="GiveQrCodeStack"
        options={{
          headerShown: false,
          title: strings.giveQrCode,
        }}
      />
      <DrawerComponent.Screen
        component={GetQrCodeInfoStack}
        name="GetQrCodeInfoStack"
        options={{
          headerShown: false,
          title: strings.qrCodeInfo,
        }}
      />
    </DrawerComponent.Navigator>
  );
};

export default DrawerStack;
