import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {Screens} from './screens';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {useFarm} from 'src/stores/slices/auth.slice';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {HeaderLeft} from 'src/components/header-left';
import {strings} from 'src/locales/locales';
import {useIsInternetConnected} from 'src/stores/slices/connect-device.slice';
import {getHeaderBackgroundColor, getTitle} from 'src/helpers/screen-options.helper';

export type HomeStackParamList = {
  Home: undefined;
  ConnectBle: undefined;
};

const HomeStackComponent = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  const {farmName} = useFarm();
  const navigation = useNavigation<DrawerNavigationProp<DrawerStackParamList>>();
  const isInternetConnected = useIsInternetConnected();
  const backgroundColor = useMemo(() => getHeaderBackgroundColor(isInternetConnected), [isInternetConnected]);

  return (
    <HomeStackComponent.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {backgroundColor},
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStackComponent.Screen
        component={Screens.Home}
        name="Home"
        options={{
          title: getTitle(farmName, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <IconButton icon="menu" iconColor={colors.white} onPress={navigation.openDrawer} size={20} />
          ),
        }}
      />
      <HomeStackComponent.Screen
        component={Screens.ConnectBle}
        name="ConnectBle"
        options={{
          title: getTitle(strings.scales, isInternetConnected),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <HeaderLeft />,
        }}
      />
    </HomeStackComponent.Navigator>
  );
};

export default HomeStack;
