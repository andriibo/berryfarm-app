import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {FarmsEnum} from '../../enums/farms.enum';
import styles from './styles';

const LandingPage = () => {
  const handleClick = (farm: FarmsEnum) => {
    console.log(farm);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FastImage
          source={require('../../assets/images/logo-white.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.subheading}>Выберите ферму, чтобы продолжить</Text>
        <TouchableOpacity onPress={() => handleClick(FarmsEnum.lyubotin)}>
          <Text style={styles.btn}>Люботин</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClick(FarmsEnum.seredynka)}>
          <Text style={styles.btn}>Серединка</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClick(FarmsEnum.test)}>
          <Text style={styles.btn}>Тестовый сервер</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={true}>
          <Text style={[styles.btn, styles.continue]}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;
