import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';

const Home = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('CreateWorker')}>
          <Text>{strings.registration}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GiveQrCode')}>
          <Text>{strings.giveQrCode}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text>{strings.templates}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export {Home};
