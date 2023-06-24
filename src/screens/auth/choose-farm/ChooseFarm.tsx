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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getFarmByDoc} from 'src/stores/services/firestore.service';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setFarm} from 'src/stores/slices/auth.slice';
import {Toast} from 'src/components/toast';
import {FirestoreServiceError} from 'src/stores/errors';
import {Buffer} from 'buffer';
import TcpSocket from 'react-native-tcp-socket';
import WifiManager from 'react-native-wifi-reborn';
import {requestLocationPermission} from 'src/helpers/location-permission';

const farms = [
  {label: strings.lyubotin, value: FarmsEnum.lyubotin},
  {label: strings.seredynka, value: FarmsEnum.seredynka},
  {label: strings.testServer, value: FarmsEnum.testServer},
];

const options = {
  port: 1234,
  host: '192.168.4.1',
  reuseAddress: true,
};

const scalesSSID = 'ESP8266';

const ChooseFarm = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [selectedFarm, handleClick] = useState<FarmsEnum>();
  const [errorMessage, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
      WifiManager.getCurrentWifiSSID().then(
        ssid => {
          if (ssid === scalesSSID) {
            const scalesWiFi = TcpSocket.createConnection(options, () => {});

            scalesWiFi.on('data', function (data) {
              console.log('message was received', (data as Buffer).toString());
              scalesWiFi.destroy();
            });

            scalesWiFi.on('error', function (error) {
              console.log(error);
              scalesWiFi.destroy();
            });

            scalesWiFi.on('close', function () {
              console.log('Connection closed!');
              scalesWiFi.destroy();
            });
          }
          console.log('Your current connected wifi SSID is ' + ssid);
        },
        error => {
          console.log(error);
          console.log('Cannot get current SSID!');
        },
      );
    }, []),
  );

  const chooseFarm = useCallback(async () => {
    setError('');
    try {
      const farm = await getFarmByDoc(selectedFarm as FarmsEnum);

      if (!farm) {
        setError(strings.farmNotFound);

        return;
      }

      dispatch(setFarm(farm));
      navigation.navigate('Login');
    } catch (error: any) {
      if (error instanceof FirestoreServiceError) {
        setError(error.message);
      } else {
        console.error(error);
      }
    }
  }, [selectedFarm, navigation, dispatch]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <FastImage resizeMode="contain" source={require('src/assets/images/logo.png')} style={styles.image} />
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
            style={[styles.btn, selectedFarm === farm.value && styles.btnSelected]}>
            {farm.label}
          </Button>
        ))}
        <Button disabled={!selectedFarm} mode="contained" onPress={chooseFarm} style={[styles.btn, styles.continue]}>
          {strings.continue}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {ChooseFarm};
