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

export type TemplatesStackParamList = {
  Blocks: undefined;
  Templates: undefined;
  ScanQrCode: {scenario: ScenariosEnum};
  QrCodeInfo: undefined;
  HandOverHarvest: {scenario: ScenariosEnum};
  SuccessPage: {scenario: ScenariosEnum};
};

const TemplatesStackComponent = createNativeStackNavigator<TemplatesStackParamList>();

const TemplatesStack = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(() => getHeaderBackgroundColor(isInternetConnected), [isInternetConnected]);

  return (
    <TemplatesStackComponent.Navigator
      initialRouteName="Blocks"
      screenOptions={{
        headerStyle: {backgroundColor},
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <TemplatesStackComponent.Screen
        component={Screens.Blocks}
        name="Blocks"
        options={{
          title: getTitle(strings.blocks, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
        component={Screens.Templates}
        name="Templates"
        options={{
          title: getTitle(strings.templates, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
        component={Screens.ScanQrCode}
        name="ScanQrCode"
        options={{
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
        component={Screens.QrCodeInfo}
        name="QrCodeInfo"
        options={{
          title: getTitle(strings.qrCodeInfo, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
        component={Screens.HandOverHarvest}
        name="HandOverHarvest"
        options={{
          title: getTitle(strings.hangOverHarvest, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <TemplatesStackComponent.Screen
        component={Screens.SuccessPage}
        name="SuccessPage"
        options={{
          title: getTitle(strings.hangOverHarvest, isInternetConnected),
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
