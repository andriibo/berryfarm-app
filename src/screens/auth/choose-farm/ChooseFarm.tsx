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
import {getFarmByDoc} from 'src/stores/services/firestore.service';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setFarm} from 'src/stores/slices/auth.slice';
import {FirestoreServiceError} from 'src/stores/errors';
import {Loader} from 'src/components/loader';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';

const farms = [
  {label: strings.lyubotin, value: FarmsEnum.lyubotin},
  {label: strings.seredynka, value: FarmsEnum.seredynka},
  {label: strings.testServer, value: FarmsEnum.testServer},
];

const ChooseFarm = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [selectedFarm, handleClick] = useState<FarmsEnum>();
  const [loader, setLoader] = useState(false);

  const chooseFarm = useCallback(async () => {
    setLoader(true);
    try {
      const farm = await getFarmByDoc(selectedFarm as FarmsEnum);

      if (!farm) {
        dispatch(addErrorNotification(strings.farmNotFound));

        return;
      }

      dispatch(setFarm(farm));
      navigation.navigate('Login');
    } catch (error: any) {
      if (error instanceof FirestoreServiceError) {
        dispatch(addErrorNotification(error.message));
      } else {
        console.error(error);
      }
    } finally {
      setLoader(false);
    }
  }, [selectedFarm, navigation, dispatch]);

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        <FastImage resizeMode="contain" source={require('src/assets/images/logo.png')} style={styles.image} />
        <View style={{flex: 1, justifyContent: 'space-around', width: '100%', alignItems: 'center'}}>
          <Text style={styles.subheading} variant="bodyLarge">
            {strings.selectFarm}
          </Text>
          {farms.map(farm => (
            <Button
              compact={false}
              key={farm.value}
              labelStyle={[styles.btnLabel, {color: selectedFarm === farm.value ? colors.white : colors.black}]}
              mode={selectedFarm === farm.value ? 'contained-tonal' : 'outlined'}
              onPress={() => handleClick(farm.value)}
              style={[styles.btn, selectedFarm === farm.value && styles.btnSelected]}>
              {farm.label}
            </Button>
          ))}
          <Button
            contentStyle={{height: 50}}
            disabled={!selectedFarm}
            mode="contained"
            onPress={chooseFarm}
            style={[styles.btn, styles.continue]}>
            {strings.continue}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {ChooseFarm};
