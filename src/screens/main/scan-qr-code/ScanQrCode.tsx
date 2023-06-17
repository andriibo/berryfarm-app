import React, {useCallback, useState} from 'react';
import {Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import styles from 'src/screens/main/scan-qr-code/styles';
import {useFarm} from 'src/stores/slices/farm.slice';
import {
  getQrCodeByUuid,
  updateQrCode,
} from 'src/stores/services/firestore.service';
import {Toast} from 'src/components/toast';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useWorker} from 'src/stores/slices/worker.slice';
import {strings} from 'src/locales/locales';
import {FirestoreServiceError} from 'src/stores/errors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {QrCode} from 'src/stores/types/qrCode.type';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {
  IHarvest,
  setHarvest,
  useHarvest,
} from 'src/stores/slices/harvest.slice';

const ScanQrCode = () => {
  const dispatch = useAppDispatch();
  const harvest = useHarvest() as IHarvest;
  const worker = useWorker();
  const [errorMessage, setError] = useState('');
  const {firestorePrefix} = useFarm();
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<DrawerStackParamList, 'ScanQrCode'>>();

  const assignQrCodeToWorker = useCallback(
    async (qrCode: QrCode) => {
      if (
        scenario !== ScenariosEnum.handOverHarvest &&
        qrCode.workerUuid !== undefined
      ) {
        setError(strings.qrCodeGiven);

        return;
      }

      qrCode.workerUuid = worker.uuid;
      await updateQrCode(qrCode, firestorePrefix);
      navigation.navigate('SuccessPage', {scenario});
    },
    [firestorePrefix, navigation, scenario, worker.uuid],
  );

  const handleHarvest = useCallback(
    (qrCode: QrCode) => {
      if (qrCode.workerUuid) {
        dispatch(setHarvest({...harvest, workerUuid: qrCode.workerUuid}));
      } else {
        dispatch(setHarvest({...harvest, qrCodeUuid: qrCode.uuid}));
      }
    },
    [dispatch, harvest],
  );

  const onSuccess = useCallback(
    async (event: any) => {
      setError('');
      try {
        const qrCode = await getQrCodeByUuid(event.data, firestorePrefix);

        if (!qrCode) {
          setError(strings.qrCodeNotFound);

          return;
        }

        if (scenario === ScenariosEnum.handOverHarvest) {
          handleHarvest(qrCode);
          navigation.navigate('HandOverHarvest');

          return;
        }

        await assignQrCodeToWorker(qrCode);
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          setError(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [
      assignQrCodeToWorker,
      firestorePrefix,
      handleHarvest,
      navigation,
      scenario,
    ],
  );

  return (
    <>
      {errorMessage && <Toast error={errorMessage} />}
      <QRCodeScanner
        flashMode={RNCamera.Constants.FlashMode.auto}
        onRead={onSuccess}
        reactivate={true}
        showMarker={true}
        topContent={
          <Text style={styles.centerText}>
            {scenario === ScenariosEnum.handOverHarvest
              ? strings.scanWorkerQrCodeWithCamera
              : strings.scanQrCodeWithCamera}
          </Text>
        }
      />
    </>
  );
};

export {ScanQrCode};
