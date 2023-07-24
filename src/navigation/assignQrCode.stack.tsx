import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';

export type AssignQrCodeStackParamList = {
  AssignQrCode: undefined;
  CreateWorkerStack: undefined;
  ScanQrCode: {scenario?: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const AssignQrCodeStackComponent = createNativeStackNavigator<AssignQrCodeStackParamList>();

export const AssignQrCodeStack = () => {
  return (
    <AssignQrCodeStackComponent.Navigator initialRouteName="AssignQrCode">
      <AssignQrCodeStackComponent.Screen
        component={Screens.AssignQrCode}
        name="AssignQrCode"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.assignQrCode,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <AssignQrCodeStackComponent.Screen
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
      <AssignQrCodeStackComponent.Screen
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
      <AssignQrCodeStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.assignQrCode,
          headerLeft: () => null,
        }}
      />
    </AssignQrCodeStackComponent.Navigator>
  );
};

export default AssignQrCodeStack;
