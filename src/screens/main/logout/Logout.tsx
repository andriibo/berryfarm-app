import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {strings} from 'src/locales/locales';
import {callLogOut} from 'src/stores/store';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import styles from './styles';

const Logout = (props: any) => {
  const handleSignOut = async () => {
    await callLogOut();
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={styles.button}>{strings.logout}</Text>
      </TouchableOpacity>
    </View>
  );
};

export {Logout};
