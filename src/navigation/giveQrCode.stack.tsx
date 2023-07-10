import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';

export type GiveQrCodeStackParamList = {
  GiveQrCode: undefined;
  CreateWorkerStack: undefined;
  ScanQrCode: {scenario?: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const GiveQrCodeStackComponent = createNativeStackNavigator<GiveQrCodeStackParamList>();

export const GiveQrCodeStack = () => {
  return (
    <GiveQrCodeStackComponent.Navigator initialRouteName="GiveQrCode">
      <GiveQrCodeStackComponent.Screen
        component={Screens.GiveQrCode}
        name="GiveQrCode"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.giveQrCode,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <GiveQrCodeStackComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: '',
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <GiveQrCodeStackComponent.Screen
        component={Screens.CreateWorker}
        name="CreateWorkerStack"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.registration,
        }}
      />
      <GiveQrCodeStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.giveQrCode,
          headerLeft: () => null,
        }}
      />
    </GiveQrCodeStackComponent.Navigator>
  );
};

export default GiveQrCodeStack;
