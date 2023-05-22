import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import styles from 'src/screens/main/home/styles';

const Home = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();

  return (
    <SafeAreaView style={{flex: 1, flexDirection: 'row', marginTop: '10%'}}>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateWorker')}
        style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{strings.registration}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('GiveQrCode')}
        style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{strings.giveQrCode}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Templates')}
        style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{strings.templates}</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export {Home};
