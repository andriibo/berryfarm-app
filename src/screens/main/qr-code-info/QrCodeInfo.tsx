import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from 'src/screens/main/qr-code-info/styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Badge, Button, Text} from 'react-native-paper';
import {strings} from 'src/locales/locales';
import {getFullname} from 'src/helpers/worker.helper';
import {useQrCode} from 'src/stores/slices/qrCode.slice';
import {getWorkerByUuid} from 'src/stores/services/firestore.service';
import {FirestoreServiceError} from 'src/stores/errors';
import {useFarm} from 'src/stores/slices/auth.slice';
import {Worker, WorkerStatus} from 'src/stores/types/worker.type';
import {showByFormat} from 'src/helpers/date.helper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {GetQrCodeInfoStackParamList} from 'src/navigation/getQrCodeInfo.stack';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {addErrorNotification} from 'src/stores/slices/notifications.slice';
import {Loader} from 'src/components/loader';

const QrCodeInfo = () => {
  const dispatch = useAppDispatch();
  const {firestorePrefix} = useFarm();
  const qrCode = useQrCode();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<GetQrCodeInfoStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      if (qrCode.workerUuid) {
        setLoader(true);
        getWorkerByUuid(qrCode.workerUuid, firestorePrefix)
          .then(data => {
            if (data) {
              setWorker(data);
            } else {
              dispatch(addErrorNotification(strings.workerNotFound));
            }
          })
          .catch(error => {
            if (error instanceof FirestoreServiceError) {
              dispatch(addErrorNotification(error.message));
            } else {
              console.error(error);
            }
          })
          .finally(() => {
            setLoader(false);
          });
      }
    }, [dispatch, firestorePrefix, qrCode]),
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View>
            <Text style={styles.label} variant="headlineSmall">
              {strings.worker}
            </Text>
            <Text variant="titleLarge">
              {worker ? getFullname(worker) : strings.qrCodeNotIssuedToWorker}
              {worker && worker?.status !== WorkerStatus.active && (
                <>
                  {' '}
                  <Badge size={30}>{strings.notActive}</Badge>
                </>
              )}
            </Text>
          </View>
          <View style={{marginTop: '30%'}}>
            <Text style={styles.label} variant="headlineSmall">
              {strings.issueQrCodeDate}
            </Text>
            <Text variant="titleLarge">
              {qrCode.connectedTimestamp
                ? showByFormat(qrCode.connectedTimestamp.seconds * 1000, 'YYYY-MM-DD HH:mm:ss')
                : '--------'}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Button
            contentStyle={{height: 50}}
            icon="qrcode"
            labelStyle={{fontSize: 18}}
            mode="contained"
            onPress={navigation.goBack}
            style={[styles.btn]}>
            {strings.scanQrCode}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {QrCodeInfo};
