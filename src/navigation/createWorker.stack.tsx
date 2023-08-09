import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';

export type CreateWorkerStackParamList = {
  CreateWorker: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const CreateWorkerStackComponent = createNativeStackNavigator<CreateWorkerStackParamList>();

const CreateWorkerStack = () => {
  return (
    <CreateWorkerStackComponent.Navigator initialRouteName="CreateWorker">
      <CreateWorkerStackComponent.Screen
        component={Screens.CreateWorker}
        name="CreateWorker"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.registration,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <CreateWorkerStackComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <CreateWorkerStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.registration,
          headerLeft: () => null,
        }}
      />
    </CreateWorkerStackComponent.Navigator>
  );
};

export default CreateWorkerStack;
