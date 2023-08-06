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

export type TemplatesStackParamList = {
  Templates: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
  HandOverHarvest: undefined;
  SuccessPage: {scenario: ScenariosEnum};
};

const TemplatesStackComponent = createNativeStackNavigator<TemplatesStackParamList>();

const TemplatesStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();

  return (
    <TemplatesStackComponent.Navigator initialRouteName="Templates">
      <TemplatesStackComponent.Screen
        component={Screens.Templates}
        name="Templates"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: strings.templates,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
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
      <TemplatesStackComponent.Screen
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
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
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
      <TemplatesStackComponent.Screen
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
              onPress={() => navigation.navigate('Templates')}
              size={20}
            />
          ),
        }}
      />
    </TemplatesStackComponent.Navigator>
  );
};

export default TemplatesStack;
