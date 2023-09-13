import React from 'react';
import {DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import {strings} from 'src/locales/locales';
import {callLogOut} from 'src/stores/store';
import {View} from 'react-native';
import {Divider} from 'react-native-paper';
import styles from './styles';
import {colors} from 'src/styles/colors';

const Logout = (props: any) => {
  const handleSignOut = async () => {
    await callLogOut();
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
        <DrawerItemList {...props} />
        <View style={styles.logout}>
          <Divider style={{marginBottom: 20}} />
          <DrawerItem
            label={strings.logout}
            labelStyle={{fontSize: 18, color: colors.onSurfaceVariant}}
            onPress={handleSignOut}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export {Logout};
