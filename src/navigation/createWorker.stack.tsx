import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {getHeaderBackgroundColor, getTitle} from 'src/helpers/screen-options.helper';
import {colors} from 'src/styles/colors';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';

export type CreateWorkerStackParamList = {
  CreateWorker: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const CreateWorkerStackComponent = createNativeStackNavigator<CreateWorkerStackParamList>();

const CreateWorkerStack = () => {
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(() => getHeaderBackgroundColor(isInternetConnected), [isInternetConnected]);

  return (
    <CreateWorkerStackComponent.Navigator
      initialRouteName="CreateWorker"
      screenOptions={{
        headerStyle: {backgroundColor},
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <CreateWorkerStackComponent.Screen
        component={Screens.CreateWorker}
        name="CreateWorker"
        options={{
          title: getTitle(strings.registration, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <CreateWorkerStackComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <CreateWorkerStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          title: getTitle(strings.registration, isInternetConnected),
          headerLeft: () => null,
        }}
      />
    </CreateWorkerStackComponent.Navigator>
  );
};

export default CreateWorkerStack;
