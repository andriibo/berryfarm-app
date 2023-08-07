import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions, DrawerStackParamList} from 'src/navigation/drawer.stack';
import {IconButton} from 'react-native-paper';
import {colors} from 'src/styles/colors';
import {CommonActions, useNavigation} from '@react-navigation/native';

export type GetQrCodeInfoStackParamList = {
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
};

const GetQrCodeInfoStackComponent = createNativeStackNavigator<GetQrCodeInfoStackParamList>();

const GetQrCodeInfoStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();

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
          // eslint-disable-next-line react/no-unstable-nested-components
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
