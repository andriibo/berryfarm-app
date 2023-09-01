import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {colors} from 'src/styles/colors';
import {Logout} from 'src/screens/main/logout';
import AssignQrCodeStack from 'src/navigation/assignQrCode.stack';
import CreateWorkerStack from 'src/navigation/createWorker.stack';
import TemplatesStack from 'src/navigation/templates.stack';
import HomeStack from 'src/navigation/home.stack';
import {strings} from 'src/locales/locales';
import GetQrCodeInfoStack from 'src/navigation/getQrCodeInfo.stack';
import {useAutoBleReconnect} from 'src/stores/hooks/use-auto-ble-reconnect';
import HandOverHarvestStack from 'src/navigation/handOverHarvest.stack';

export type DrawerStackParamList = {
  HomeStack: undefined;
  CreateWorkerStack: undefined;
  AssignQrCodeStack: undefined;
  TemplatesStack: undefined;
  GetQrCodeInfoStack: undefined;
  HandOverHarvestStack: undefined;
};

const DrawerComponent = createDrawerNavigator<DrawerStackParamList>();

const DrawerStack = () => {
  useAutoBleReconnect();

  return (
    <DrawerComponent.Navigator
      drawerContent={Logout}
      initialRouteName="HomeStack"
      screenOptions={{
        swipeEnabled: true,
        drawerActiveTintColor: colors.black,
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 18,
          color: colors.onSurface,
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
        component={AssignQrCodeStack}
        name="AssignQrCodeStack"
        options={{
          headerShown: false,
          title: strings.assignQrCode,
        }}
      />
      <DrawerComponent.Screen
        component={TemplatesStack}
        name="TemplatesStack"
        options={{
          headerShown: false,
          title: strings.templates,
        }}
      />
      <DrawerComponent.Screen
        component={HandOverHarvestStack}
        name="HandOverHarvestStack"
        options={{
          headerShown: false,
          title: strings.hangOverHarvest,
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
