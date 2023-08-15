import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {getHeaderBackgroundColor, getTitle} from 'src/helpers/screen-options.helper';
import {colors} from 'src/styles/colors';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';

export type AssignQrCodeStackParamList = {
  AssignQrCode: undefined;
  CreateWorkerStack: undefined;
  ScanQrCode: {scenario?: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const AssignQrCodeStackComponent = createNativeStackNavigator<AssignQrCodeStackParamList>();

export const AssignQrCodeStack = () => {
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(() => getHeaderBackgroundColor(isInternetConnected), [isInternetConnected]);

  return (
    <AssignQrCodeStackComponent.Navigator
      initialRouteName="AssignQrCode"
      screenOptions={{
        headerStyle: {backgroundColor},
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <AssignQrCodeStackComponent.Screen
        component={Screens.AssignQrCode}
        name="AssignQrCode"
        options={{
          title: getTitle(strings.assignQrCode, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <AssignQrCodeStackComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <AssignQrCodeStackComponent.Screen
        component={Screens.CreateWorker}
        name="CreateWorkerStack"
        options={{
          title: getTitle(strings.registration, isInternetConnected),
        }}
      />
      <AssignQrCodeStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          title: getTitle(strings.assignQrCode, isInternetConnected),
          headerLeft: () => null,
        }}
      />
    </AssignQrCodeStackComponent.Navigator>
  );
};

export default AssignQrCodeStack;
