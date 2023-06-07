import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Button, Divider, Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/give-qr-code/styles';
import {Toast} from 'src/components/toast';
import {strings} from 'src/locales/locales';
import {useFarm} from 'src/stores/slices/farm.slice';
import {getWorkers} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {Worker} from 'src/stores/types/worker.type';
import {getFullname} from 'src/helpers/worker.helper';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setWorker} from 'src/stores/slices/worker.slice';
import {ScenariosEnum} from 'src/enums/scenarios.enum';

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
  const [foundWorkers, setFoundWorkers] = useState<Array<Worker>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScanQrCode, setCanScanQrCode] = useState(false);
  const [errorMessage, setError] = useState('');
  const {firestorePrefix} = useFarm();
  const handleSelectWorker = useCallback(
    (worker: Worker) => {
      setSearchQuery(getFullname(worker));
      setCanScanQrCode(true);
      setFoundWorkers([]);
      dispatch(setWorker(worker));
    },
    [dispatch],
  );

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setCanScanQrCode(false);
      setFoundWorkers([]);
    }, []),
  );

  useEffect(() => {
    getWorkers(firestorePrefix)
      .then(res => {
        setWorkers(res);
      })
      .catch(error => {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      });
  }, [firestorePrefix]);

  const handleGetWorker = useCallback(
    async (name: string) => {
      setError('');
      setSearchQuery(name);
      setCanScanQrCode(false);
      if (name === '') {
        setFoundWorkers([]);

        return;
      }

      try {
        const result = workers.filter(worker => {
          return (
            worker.firstName?.toLowerCase().includes(name.toLowerCase()) ||
            worker.lastName?.toLowerCase().includes(name.toLowerCase()) ||
            worker.middleName?.toLowerCase().includes(name.toLowerCase())
          );
        });

        setFoundWorkers(result);
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [workers],
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
              data={foundWorkers}
              keyExtractor={item => `${item.uuid}`}
              renderItem={({item}) => (
                <Item handleSelectWorker={handleSelectWorker} worker={item} />
              )}
            />
            {!foundWorkers.length && searchQuery && !canScanQrCode && (
              <Text style={styles.workerNotFound} variant="titleMedium">
                {strings.workerNotFound}
              </Text>
            )}

            {!foundWorkers.length && searchQuery && !canScanQrCode && (
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
          onPress={() =>
            navigation.navigate('ScanQrCode', {
              scenario: ScenariosEnum.giveQrCode,
            })
          }
          style={[styles.btn]}>
          {strings.scanQrCode}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export {GiveQrCode};
