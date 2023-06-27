import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {drawerOptions} from 'src/navigation/drawer.stack';

export type HandOverHarvestStackParamList = {
  Templates: undefined;
  HandOverHarvest: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const HandOverHarvestStackComponent = createNativeStackNavigator<HandOverHarvestStackParamList>();

const HandOverHarvestStack = () => {
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
          headerLeft: () => <HeaderLeft />,
        }}
      />
    </HandOverHarvestStackComponent.Navigator>
  );
};

export default HandOverHarvestStack;
