import React, {useCallback, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Button, Divider, Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/give-qr-code/styles';
import {Toast} from 'src/components/toast';
import {strings} from 'src/locales/locales';
import {useFarm} from 'src/stores/slices/auth.slice';
import {getWorkersByName} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/nativdee-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {Worker} from 'src/stores/types/worker.type';

const Item = ({
  handleSelectWorker,
  worker,
}: {
  handleSelectWorker: (name: string) => void;
  worker: Worker;
}) => {
  const name = `${worker.firstName}${
    worker.middleName ? ` ${worker.middleName}` : ''
  } ${worker.lastName}`;

  return (
    <TouchableOpacity
      onPress={() => handleSelectWorker(name)}
      style={styles.item}>
      <View style={styles.titleItem}>
        <Text variant="titleMedium">{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GiveQrCode = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const [workers, setWorkers] = useState<Array<Worker>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScanQrCode, setCanScanQrCode] = useState(false);
  const [errorMessage, setError] = useState('');
  const {firestorePrefix} = useFarm();
  const handleSelectWorker = useCallback((name: string) => {
    setSearchQuery(name);
    setCanScanQrCode(true);
    setWorkers([]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setCanScanQrCode(false);
      setWorkers([]);
    }, []),
  );

  const handleFindWorker = useCallback(
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
              onChangeText={handleFindWorker}
              placeholder={strings.firstName}
              style={styles.searchBar}
              testID="findName"
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
                Работник не найден
              </Text>
            )}

            {!workers.length && searchQuery && !canScanQrCode && (
              <Text
                onPress={() => navigation.navigate('CreateWorker')}
                style={styles.linkCreateWorker}
                variant="titleMedium">
                + Зарегистрировать работника
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
