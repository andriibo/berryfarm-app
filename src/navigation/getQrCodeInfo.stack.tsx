import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';

export type GetQrCodeInfoStackParamList = {
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
};

const GetQrCodeInfoStackComponent = createNativeStackNavigator<GetQrCodeInfoStackParamList>();

const GetQrCodeInfoStack = () => {
  return (
    <GetQrCodeInfoStackComponent.Navigator initialRouteName="ScanQrCode">
      <GetQrCodeInfoStackComponent.Screen
        component={Screens.ScanQrCode}
        initialParams={{scenario: ScenariosEnum.getQrCodeInfo}}
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
      <GetQrCodeInfoStackComponent.Screen
        component={Screens.QrCodeInfo}
        name="QrCodeInfo"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.qrCodeInfo,
          headerLeft: () => <HeaderLeft />,
        }}
      />
    </GetQrCodeInfoStackComponent.Navigator>
  );
};

export default GetQrCodeInfoStack;
