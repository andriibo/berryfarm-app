import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export type HandOverHarvestStackParamList = {
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
  HandOverHarvest: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const HandOverHarvestStackComponent = createNativeStackNavigator<HandOverHarvestStackParamList>();

const HandOverHarvestStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();

  return (
    <HandOverHarvestStackComponent.Navigator initialRouteName="ScanQrCode">
      <HandOverHarvestStackComponent.Screen
        component={Screens.ScanQrCode}
        initialParams={{scenario: ScenariosEnum.handOverHarvest}}
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
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
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
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <IconButton
              icon="arrow-left"
              iconColor={colors.white}
              onPress={() => navigation.navigate('ScanQrCode', {scenario: ScenariosEnum.handOverHarvest})}
              size={20}
            />
          ),
        }}
      />
    </HandOverHarvestStackComponent.Navigator>
  );
};

export default HandOverHarvestStack;
