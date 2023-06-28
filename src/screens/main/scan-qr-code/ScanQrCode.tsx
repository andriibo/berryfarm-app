import React, {useCallback, useRef, useState} from 'react';
import {Alert, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import styles from 'src/screens/main/scan-qr-code/styles';
import {useFarm} from 'src/stores/slices/auth.slice';
import {getQrCodeByUuid, updateQrCode} from 'src/stores/services/firestore.service';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useWorker} from 'src/stores/slices/worker.slice';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScenariosEnum} from 'src/enums/scenarios.enum';
import {QrCode} from 'src/stores/types/qrCode.type';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {IHarvest, setHarvest, useHarvest} from 'src/stores/slices/harvest.slice';
import {CreateWorkerStackParamList} from 'src/navigation/createWorker.stack';
import {HandOverHarvestStackParamList} from 'src/navigation/handOverHarvest.stack';
import {FirestoreServiceError} from 'src/stores/errors';
import {validate as uuidValidate} from 'uuid';
import {Loader} from 'src/components/loader';

const ScanQrCode = () => {
  const dispatch = useAppDispatch();
  const harvest = useHarvest() as IHarvest;
  const worker = useWorker();
  const {firestorePrefix} = useFarm();
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<CreateWorkerStackParamList, 'ScanQrCode'>>();
  const scanner = useRef(null);
  const [loader, setLoader] = useState(false);

  const showAlert = useCallback(
    (message: string) => {
      Alert.alert(strings.error, message, [
        {
          text: strings.back,
          style: 'cancel',
          onPress: () => {
            // @ts-ignore
            scanner.current?.reactivate(true);
            navigation.goBack();
          },
        },
        {
          text: strings.retry,
          onPress: () => {
            // @ts-ignore
            scanner.current?.reactivate(true);
          },
        },
      ]);
    },
    [navigation],
  );

  const assignQrCodeToWorker = useCallback(
    async (qrCode: QrCode) => {
      if (scenario !== ScenariosEnum.handOverHarvest && qrCode.workerUuid !== undefined) {
        showAlert(strings.qrCodeGiven);

        return;
      }

      qrCode.workerUuid = worker.uuid;
      updateQrCode(qrCode, firestorePrefix);
      // @ts-ignore
      scanner.current?.reactivate(true);
      navigation.navigate('SuccessPage', {scenario});
      setLoader(false);
    },
    [firestorePrefix, navigation, scenario, showAlert, worker.uuid],
  );

  const handleHarvest = useCallback(
    (qrCode: QrCode) => {
      if (qrCode.workerUuid) {
        dispatch(setHarvest({...harvest, workerUuid: qrCode.workerUuid}));
      } else {
        dispatch(setHarvest({...harvest, qrCodeUuid: qrCode.uuid}));
      }

      // @ts-ignore
      scanner.current?.reactivate(true);
      navigation.navigate('HandOverHarvest');
      setLoader(false);
    },
    [dispatch, harvest, navigation],
  );

  const onSuccess = useCallback(
    async (event: any) => {
      setLoader(true);
      try {
        if (!uuidValidate(event.data)) {
          setLoader(false);
          showAlert(strings.qrCodeNotFound);

          return;
        }

        getQrCodeByUuid(event.data, firestorePrefix).then(qrCode => {
          if (!qrCode) {
            setLoader(false);
            showAlert(strings.qrCodeNotFound);

            return;
          }

          if (scenario === ScenariosEnum.handOverHarvest) {
            handleHarvest(qrCode);

            return;
          }

          assignQrCodeToWorker(qrCode);
        });
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          showAlert(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [assignQrCodeToWorker, firestorePrefix, handleHarvest, scenario, showAlert],
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <QRCodeScanner
      flashMode={RNCamera.Constants.FlashMode.auto}
      onRead={onSuccess}
      ref={scanner}
      showMarker={true}
      topContent={
        <Text style={styles.centerText}>
          {scenario === ScenariosEnum.handOverHarvest
            ? strings.scanWorkerQrCodeWithCamera
            : strings.scanQrCodeWithCamera}
        </Text>
      }
    />
  );
};

export {ScanQrCode};
