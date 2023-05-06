import React, {useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {strings} from 'src/locales/locales';
import {FarmsEnum} from 'src/enums/farms.enum';
import {Button} from 'react-native-paper';

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
          resizeMode="contain"
          source={require('src/assets/images/logo.png')}
          style={styles.image}
        />
        <Text style={styles.subheading} variant="bodyLarge">
          {strings.selectFarm}
        </Text>
        {farms.map(farm => (
          <Button
            compact={false}
            key={farm.value}
            mode={selectedFarm === farm.value ? 'elevated' : 'contained-tonal'}
            onPress={() => handleClick(farm.value)}
            style={[
              styles.btn,
              selectedFarm === farm.value ? styles.btnSelected : {},
            ]}>
            {farm.label}
          </Button>
        ))}
        <Button
          disabled={!selectedFarm}
          mode="contained"
          style={[styles.btn, styles.continue]}>
          {strings.continue}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;
