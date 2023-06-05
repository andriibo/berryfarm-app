import React, {useCallback, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Button, Divider, Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/give-qr-code/styles';
import {Toast} from 'src/components/toast';
import {strings} from 'src/locales/locales';
import {useFarm} from 'src/stores/slices/farm.slice';
import {getWorkersByName} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {Worker} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setWorker} from 'src/stores/slices/worker.slice';

const Item = ({
  handleSelectWorker,
  worker,
}: {
  handleSelectWorker: (worker: Worker) => void;
  worker: Worker;
}) => {
  return (
    <TouchableOpacity
      onPress={() => handleSelectWorker(worker)}
      style={styles.item}>
      <View style={styles.titleItem}>
        <Text variant="titleMedium">{getFullname(worker)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GiveQrCode = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const [workers, setWorkers] = useState<Array<Worker>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScanQrCode, setCanScanQrCode] = useState(false);
  const [errorMessage, setError] = useState('');
  const {firestorePrefix} = useFarm();
  const handleSelectWorker = useCallback(
    (worker: Worker) => {
      setSearchQuery(getFullname(worker));
      setCanScanQrCode(true);
      setWorkers([]);
      dispatch(setWorker(worker));
    },
    [dispatch],
  );

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setCanScanQrCode(false);
      setWorkers([]);
    }, []),
  );

  const handleGetWorker = useCallback(
    async (name: string) => {
      setError('');
      setSearchQuery(name);
      setCanScanQrCode(false);
      if (name === '') {
        setWorkers([]);

        return;
      }

      try {
        const result = await getWorkersByName(
          name.toLowerCase(),
          firestorePrefix,
        );

        setWorkers(result);
      } catch (error: any) {
        console.log(error);
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        }
      }
    },
    [firestorePrefix, setWorkers],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <View>
          <Text variant="headlineSmall">{strings.worker}</Text>
          <View style={styles.wrapper}>
            <Searchbar
              onChangeText={handleGetWorker}
              placeholder={strings.firstName}
              style={styles.searchBar}
              testID="getName"
              value={searchQuery}
            />
            <Divider />
            <FlatList
              data={workers}
              keyExtractor={item => `${item.uuid}`}
              renderItem={({item}) => (
                <Item handleSelectWorker={handleSelectWorker} worker={item} />
              )}
            />
            {!workers.length && searchQuery && !canScanQrCode && (
              <Text style={styles.workerNotFound} variant="titleMedium">
                {strings.workerNotFound}
              </Text>
            )}

            {!workers.length && searchQuery && !canScanQrCode && (
              <Text
                onPress={() => navigation.navigate('CreateWorker')}
                style={styles.linkCreateWorker}
                variant="titleMedium">
                + {strings.registerWorker}
              </Text>
            )}
          </View>
        </View>

        <Button
          disabled={!canScanQrCode}
          icon="qrcode"
          mode="contained"
          onPress={() => navigation.navigate('ScanQrCode')}
          style={[styles.btn]}>
          {strings.scanQrCode}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {GiveQrCode};
