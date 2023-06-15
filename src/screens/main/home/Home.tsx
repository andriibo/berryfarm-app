import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import styles from 'src/screens/main/home/styles';
import {colors} from 'src/styles/colors';

const Home = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateWorker')}
          style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{strings.registration}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GiveQrCode')}
          style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{strings.giveQrCode}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Templates')}
          style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{strings.templates}</Text>
          </View>
        </TouchableOpacity>
        {/*<TouchableOpacity style={styles.wrapper}>*/}
        {/*  <View style={styles.titleWrapper}>*/}
        {/*    <Text style={styles.titleText}>{strings.qrCodeInformation}</Text>*/}
        {/*  </View>*/}
        {/*</TouchableOpacity>*/}
      </View>
      <View style={styles.container} />
    </SafeAreaView>
  );
};

export {Home};
