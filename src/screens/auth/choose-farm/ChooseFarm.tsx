import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {strings} from 'src/locales/locales';
import {FarmsEnum} from 'src/enums/farms.enum';
import {colors} from 'src/styles/colors';
import {AuthStackParamList} from 'src/navigation/auth.stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {getFarm} from 'src/stores/services/firestore.service';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setFarm} from 'src/stores/slices/farm.slice';
import {Toast} from 'src/components/toast';
import {FirestoreServiceError} from 'src/stores/errors';

const farms = [
  {label: strings.lyubotin, value: FarmsEnum.lyubotin},
  {label: strings.seredynka, value: FarmsEnum.seredynka},
  {label: strings.testServer, value: FarmsEnum.testServer},
];

const ChooseFarm = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [selectedFarm, handleClick] = useState<FarmsEnum>();
  const [errorMessage, setError] = useState('');

  const login = useCallback(async () => {
    try {
      const farm = await getFarm(selectedFarm as FarmsEnum);

      if (farm === null) {
        setError(strings.farmNotFound);

        return;
      }

      dispatch(setFarm(farm));
      navigation.navigate('Login');
    } catch (error: any) {
      if (error instanceof FirestoreServiceError) {
        setError(error.message);
      }
    }
  }, [selectedFarm, navigation, dispatch]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
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
            labelStyle={{
              color: selectedFarm === farm.value ? colors.white : colors.black,
            }}
            mode={selectedFarm === farm.value ? 'contained-tonal' : 'outlined'}
            onPress={() => handleClick(farm.value)}
            style={[
              styles.btn,
              selectedFarm === farm.value && styles.btnSelected,
            ]}>
            {farm.label}
          </Button>
        ))}
        <Button
          disabled={!selectedFarm}
          mode="contained"
          onPress={login}
          style={[styles.btn, styles.continue]}>
          {strings.continue}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {ChooseFarm};
