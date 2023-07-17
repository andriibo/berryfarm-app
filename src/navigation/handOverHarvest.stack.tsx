import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {useIsDeviceConnected} from 'src/stores/slices/connect-device.slice';
import {useNavigation} from '@react-navigation/native';

export type HandOverHarvestStackParamList = {
  Templates: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
  HandOverHarvest: undefined;
  SuccessPage: {scenario: ScenariosEnum};
};

const HandOverHarvestStackComponent = createNativeStackNavigator<HandOverHarvestStackParamList>();

const HandOverHarvestStack = () => {
  const isDeviceConnected = useIsDeviceConnected();
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();

  return (
    <HandOverHarvestStackComponent.Navigator initialRouteName="Templates">
      <HandOverHarvestStackComponent.Screen
        component={Screens.Templates}
        name="Templates"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.templates,
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <HandOverHarvestStackComponent.Screen
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
      <HandOverHarvestStackComponent.Screen
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
      <HandOverHarvestStackComponent.Screen
        component={Screens.HandOverHarvest}
        name="HandOverHarvest"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.hangOverHarvest,
          headerLeft: () => <HeaderLeft />,
          headerRight: () =>
            isDeviceConnected ? <IconButton icon="weight-kilogram" iconColor={colors.white} size={30} /> : null,
        }}
      />
      <HandOverHarvestStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.hangOverHarvest,
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              iconColor={colors.white}
              onPress={() => navigation.navigate('Templates')}
              size={20}
            />
          ),
        }}
      />
    </HandOverHarvestStackComponent.Navigator>
  );
};

export default HandOverHarvestStack;
