import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {Screens} from './screens';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {strings} from 'src/locales/locales';
import {HeaderLeft} from 'src/components/header-left';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';
import {getHeaderBackgroundColor, getTitle} from 'src/helpers/screen-options.helper';

export type HandOverHarvestStackParamList = {
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
  HandOverHarvest: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const HandOverHarvestStackComponent = createNativeStackNavigator<HandOverHarvestStackParamList>();

const HandOverHarvestStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(() => getHeaderBackgroundColor(isInternetConnected), [isInternetConnected]);

  return (
    <HandOverHarvestStackComponent.Navigator
      initialRouteName="ScanQrCode"
      screenOptions={{
        headerStyle: {backgroundColor},
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HandOverHarvestStackComponent.Screen
        component={Screens.ScanQrCode}
        initialParams={{scenario: ScenariosEnum.handOverHarvest}}
        name="ScanQrCode"
        options={{
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <HandOverHarvestStackComponent.Screen
        component={Screens.HandOverHarvest}
        name="HandOverHarvest"
        options={{
          title: getTitle(strings.hangOverHarvest, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <HandOverHarvestStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          title: getTitle(strings.hangOverHarvest, isInternetConnected),
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
