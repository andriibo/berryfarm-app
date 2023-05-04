import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {FarmsEnum} from '../../enums/farms.enum';

const LandingPage = () => {
  const farms = [
    {label: FarmsEnum.lyubotin, value: 'lyubotin'},
    {label: FarmsEnum.seredynka, value: 'seredynka'},
    {label: FarmsEnum.test, value: 'test'},
  ];

  const [selectedFarm, handleClick] = useState('');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FastImage
          source={require('../../assets/images/logo-white.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.subheading}>Выберите ферму, чтобы продолжить</Text>
        {farms.map(farm => (
          <TouchableOpacity onPress={() => handleClick(farm.value)}>
            <Text
              style={[
                styles.btn,
                selectedFarm === farm.value ? styles.btnSelected : {},
              ]}>
              {farm.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity disabled={!selectedFarm}>
          <Text style={[styles.btn, styles.continue]}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;
