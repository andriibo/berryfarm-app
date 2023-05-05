import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {strings} from 'src/locales/locales';
import {FarmsEnum} from 'src/enums/farms.enum';

const farms = [
  {label: strings.lyubotin, value: FarmsEnum.lyubotin},
  {label: strings.seredynka, value: FarmsEnum.seredynka},
  {label: strings.testServer, value: FarmsEnum.testServer},
];

const LandingPage = () => {
  const [selectedFarm, handleClick] = useState<FarmsEnum>();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FastImage
          source={require('src/assets/images/logo-white.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.subheading}>{strings.selectFarm}</Text>
        {farms.map(farm => (
          <TouchableOpacity
            key={farm.value}
            onPress={() => handleClick(farm.value)}>
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
          <Text style={[styles.btn, styles.continue]}>{strings.continue}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;
