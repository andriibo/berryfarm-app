import React, {useCallback, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Button, Divider, Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/give-qr-code/styles';
import {strings} from 'src/locales/locales';
import {useFarm} from 'src/stores/slices/auth.slice';
import {getWorkersByName} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Worker} from 'src/stores/types/worker.type';
import {capitalizeFirstLowercaseRest, getFullname} from 'src/helpers/worker.helper';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {setWorker} from 'src/stores/slices/worker.slice';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {Loader} from 'src/components/loader';
import {colors} from 'src/styles/colors';
import {GiveQrCodeStackParamList} from 'src/navigation/giveQrCode.stack';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';

const Item = ({handleSelectWorker, worker}: {handleSelectWorker: (worker: Worker) => void; worker: Worker}) => {
  return (
    <TouchableOpacity onPress={() => handleSelectWorker(worker)} style={styles.item}>
      <View style={styles.titleItem}>
        <Text variant="titleMedium">{getFullname(worker)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GiveQrCode = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<GiveQrCodeStackParamList>>();
  const [loader, setLoader] = useState(false);
  const [workers, setWorkers] = useState<Array<Worker>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScanQrCode, setCanScanQrCode] = useState(false);
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
      setSearchQuery(name);
      setCanScanQrCode(false);
      if (name === '' || name.length < 3) {
        setWorkers([]);

        return;
      }

      setLoader(true);

      try {
        const result = await getWorkersByName(capitalizeFirstLowercaseRest(name), firestorePrefix);

        setWorkers(result);
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          dispatch(addErrorNotification(error.message));
        } else {
          console.error(error);
        }
      } finally {
        setLoader(false);
      }
    },
    [dispatch, firestorePrefix],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
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
              renderItem={({item}) => <Item handleSelectWorker={handleSelectWorker} worker={item} />}
            />
            {!workers.length && searchQuery && !canScanQrCode && (
              <Text style={styles.workerNotFound} variant="titleMedium">
                {strings.workerNotFound}
              </Text>
            )}

            {!workers.length && searchQuery && !canScanQrCode && (
              <Text
                onPress={() => navigation.navigate('CreateWorkerStack')}
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
