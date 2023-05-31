import React, {useCallback, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Button, Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/create-worker/styles';
import {Toast} from 'src/components/toast';
import {strings} from 'src/locales/locales';
import {useFarm} from 'src/stores/slices/auth.slice';
import {getWorkersByName} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {Worker} from 'src/stores/types/worker.type';
const Item = ({worker}: {worker: Worker}) => (
  <TouchableOpacity onPress={() => {}}>
    <View>
      <Text variant="headlineMedium">
        {worker.firstName} {worker.middleName} {worker.lastName}
      </Text>
    </View>
  </TouchableOpacity>
);

const GiveQrCode = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [workers, setWorkers] = React.useState<Array<Worker>>([]);
  const [errorMessage, setError] = useState('');
  const {firestorePrefix} = useFarm();

  const handleFindWorker = useCallback(
    async (name: string) => {
      setError('');
      setSearchQuery(name);
      if (name === '') {
        setWorkers([]);
        console.log(workers);

        return;
      }

      try {
        const result = await getWorkersByName(
          name.toLowerCase(),
          firestorePrefix,
        );

        setWorkers(result);
        console.log(workers);
      } catch (error: any) {
        console.log(error);
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        }
      }
    },
    [firestorePrefix, workers, setWorkers],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {errorMessage && <Toast error={errorMessage} />}
        <View style={styles.wrapper}>
          <View>
            <Text variant="titleMedium">{strings.worker}</Text>
            <Searchbar
              onChangeText={handleFindWorker}
              placeholder={strings.firstName}
              style={{width: '100%'}}
              testID="findName"
              value={searchQuery}
            />
          </View>
          <View>
            <FlatList
              data={workers}
              keyExtractor={item => `${item.uuid}`}
              renderItem={({item}) => <Item worker={item} />}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              disabled={!workers.length}
              icon="qrcode"
              mode="contained"
              onPress={() => navigation.navigate('ScanQrCode')}
              style={[styles.btn]}>
              {strings.scanQrCode}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {GiveQrCode};
