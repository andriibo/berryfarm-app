import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {IconButton} from 'react-native-paper';
import {colors} from 'src/styles/colors';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';
import {getHeaderBackgroundColor, getTitle} from 'src/helpers/screen-options.helper';

export type GetQrCodeInfoStackParamList = {
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
};

const GetQrCodeInfoStackComponent = createNativeStackNavigator<GetQrCodeInfoStackParamList>();

const GetQrCodeInfoStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(() => getHeaderBackgroundColor(isInternetConnected), [isInternetConnected]);

  return (
    <GetQrCodeInfoStackComponent.Navigator
      initialRouteName="ScanQrCode"
      screenOptions={{
        headerStyle: {backgroundColor},
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <GetQrCodeInfoStackComponent.Screen
        component={Screens.ScanQrCode}
        initialParams={{scenario: ScenariosEnum.getQrCodeInfo}}
        name="ScanQrCode"
        options={{
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <GetQrCodeInfoStackComponent.Screen
        component={Screens.QrCodeInfo}
        name="QrCodeInfo"
        options={{
          title: getTitle(strings.qrCodeInfo, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              iconColor={colors.white}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{name: 'ScanQrCode'}],
                  }),
                );
                navigation.navigate('HomeStack');
              }}
              size={20}
            />
          ),
        }}
      />
    </GetQrCodeInfoStackComponent.Navigator>
  );
};

export default GetQrCodeInfoStack;
