import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Screens} from './screens';
import {drawerOptions, DrawerStackParamList} from 'src/navigation/drawer.stack';
import {useFarm} from 'src/stores/slices/auth.slice';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {HeaderLeft} from 'src/components/header-left';

export type HomeStackParamList = {
  Home: undefined;
  ConnectBle: undefined;
};

const HomeStackComponent = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  const {farmName} = useFarm();
  const navigation = useNavigation<DrawerNavigationProp<DrawerStackParamList>>();

  return (
    <HomeStackComponent.Navigator initialRouteName="Home">
      <HomeStackComponent.Screen
        component={Screens.Home}
        name="Home"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: farmName,
          headerLeft: () => (
            <IconButton icon="menu" iconColor={colors.white} onPress={navigation.openDrawer} size={20} />
          ),
        }}
      />
      <HomeStackComponent.Screen
        component={Screens.ConnectBle}
        name="ConnectBle"
        options={{
          ...drawerOptions,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Connect Device',
          headerLeft: () => <HeaderLeft />,
        }}
      />
    </HomeStackComponent.Navigator>
  );
};

export default HomeStack;
