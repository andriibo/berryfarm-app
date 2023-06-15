import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Snackbar, Text, IconButton} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import React, {useCallback, useState} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setLoadedData} from 'src/stores/slices/device.slice';
import {
  getFarms,
  getQrCodes,
  getTemplates,
  getUsers,
  getWorkers,
} from 'src/stores/services/firestore.service';
import {Loader} from 'src/components/loader';
import {FirestoreServiceError} from 'src/stores/errors';
import {Toast} from 'src/components/toast';

const LoadData = () => {
  const [errorMessage, setError] = useState('');
  const netState = useNetInfo();
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      setError('');
      if (netState.isConnected) {
        getFarms()
          .then(items => {
            items.forEach(farm => {
              const prefix = farm.firestorePrefix;

              getUsers(prefix).then();
              getWorkers(prefix).then();
              getQrCodes(prefix).then();
              getTemplates(prefix).then();
            });
            dispatch(setLoadedData(true));
          })
          .catch(error => {
            if (error instanceof FirestoreServiceError) {
              setError(error.message);
            } else {
              console.error(error);
            }
          });
      }
    }, [dispatch, netState.isConnected]),
  );

  if (netState.isConnected) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      {errorMessage && <Toast error={errorMessage} />}
      <View style={styles.container}>
        <FastImage
          resizeMode="contain"
          source={require('src/assets/images/logo.png')}
          style={styles.image}
        />
        <Text variant="titleLarge">{strings.noInternetConnection}</Text>
        <IconButton icon="alert-circle-outline" size={100} />
        <Snackbar
          onDismiss={() => {}}
          visible={true}
          wrapperStyle={{position: 'relative'}}>
          <Text style={styles.snackbar}>{strings.logInOnline}</Text>
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export {LoadData};
