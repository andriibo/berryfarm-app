import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Alert, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import styles from 'src/screens/main/scan-qr-code/styles';
import {useFarm} from 'src/stores/slices/auth.slice';
import {getQrCodeByUuid, updateQrCode} from 'src/stores/services/firestore.service';
import {RouteProp, useFocusEffect, useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
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
import {setQrCode} from 'src/stores/slices/qrCode.slice';
import {requestCameraPermission} from 'src/helpers/camera-permission';

const ScanQrCode = () => {
  const dispatch = useAppDispatch();
  const harvest = useHarvest() as IHarvest;
  const worker = useWorker();
  const {firestorePrefix} = useFarm();
  const navigation = useNavigation<NativeStackNavigationProp<HandOverHarvestStackParamList>>();
  const focus = useIsFocused();
  const {
    params: {scenario},
  } = useRoute<RouteProp<CreateWorkerStackParamList, 'ScanQrCode'>>();
  const scanText = useMemo(() => {
    if (scenario === ScenariosEnum.handOverHarvest || scenario === ScenariosEnum.getQrCodeInfo) {
      return strings.scanWorkerQrCodeWithCamera;
    }

    return strings.scanQrCodeWithCamera;
  }, [scenario]);
  const scanner = useRef<QRCodeScanner>(null);

  useFocusEffect(
    useCallback(() => {
      scanner.current?.reactivate();
    }, []),
  );

  useEffect(() => {
    if (focus) {
      requestCameraPermission(navigation).then();
    }
  });

  const showAlert = useCallback(
    (message: string) => {
      Alert.alert(strings.error, message, [
        {
          text: strings.back,
          style: 'cancel',
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: strings.retry,
          onPress: () => {
            // set small timeout before reactivating scanner to prevent a lot of scans
            setTimeout(() => scanner.current?.reactivate(), 500);
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
      navigation.navigate('SuccessPage', {scenario});
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

      navigation.navigate('HandOverHarvest');
    },
    [dispatch, harvest, navigation],
  );

  const onSuccess = useCallback(
    async (event: any) => {
      try {
        if (!uuidValidate(event.data)) {
          showAlert(strings.qrCodeNotFound);

          return;
        }

        const qrCode = await getQrCodeByUuid(event.data, firestorePrefix);

        if (!qrCode) {
          showAlert(strings.qrCodeNotFound);

          return;
        }

        if (scenario === ScenariosEnum.getQrCodeInfo) {
          dispatch(setQrCode(qrCode));
          navigation.navigate('QrCodeInfo');

          return;
        }

        if (scenario === ScenariosEnum.handOverHarvest) {
          handleHarvest(qrCode);

          return;
        }

        await assignQrCodeToWorker(qrCode);
      } catch (error: any) {
        if (error instanceof FirestoreServiceError) {
          showAlert(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [assignQrCodeToWorker, dispatch, firestorePrefix, handleHarvest, navigation, scenario, showAlert],
  );

  return (
    <QRCodeScanner
      flashMode={RNCamera.Constants.FlashMode.auto}
      onRead={onSuccess}
      ref={scanner}
      showMarker={true}
      topContent={<Text style={styles.centerText}>{scanText}</Text>}
    />
  );
};

export {ScanQrCode};
