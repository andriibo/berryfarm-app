import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {setHarvestTemplate, useHarvestTemplate} from 'src/stores/slices/harvest-template.slice';
import {CreateWorkerStackParamList} from 'src/navigation/createWorker.stack';
import {FirestoreServiceError} from 'src/stores/errors';
import {validate as uuidValidate} from 'uuid';
import {setQrCode} from 'src/stores/slices/qrCode.slice';
import {requestCameraPermission} from 'src/helpers/camera-permission';
import {Loader} from 'src/components/loader';
import {TemplatesStackParamList} from 'src/navigation/templates.stack';
import Sound from 'react-native-sound';

const ScanQrCode = () => {
  const dispatch = useAppDispatch();
  const harvestTemplate = useHarvestTemplate();
  const worker = useWorker();
  const {firestorePrefix} = useFarm();
  const navigation = useNavigation<NativeStackNavigationProp<TemplatesStackParamList>>();
  const focus = useIsFocused();
  const [loader, setLoader] = useState(false);
  const {
    params: {scenario},
  } = useRoute<RouteProp<CreateWorkerStackParamList, 'ScanQrCode'>>();
  const scanText = useMemo(() => {
    if (scenario !== ScenariosEnum.assignQrCode && scenario !== ScenariosEnum.createWorker) {
      return strings.scanWorkerQrCodeWithCamera;
    }

    return strings.scanQrCodeWithCamera;
  }, [scenario]);
  const scanner = useRef<QRCodeScanner>(null);

  useFocusEffect(
    useCallback(() => {
      scanner.current?.reactivate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [harvestTemplate]),
  );

  useEffect(() => {
    if (focus) {
      setLoader(true);
      requestCameraPermission(navigation).then(() => setLoader(false));
    }
  }, [focus, navigation]);

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
      if (
        scenario !== ScenariosEnum.templates &&
        scenario !== ScenariosEnum.handOverHarvest &&
        qrCode.workerUuid !== undefined
      ) {
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
        dispatch(setHarvestTemplate({...harvestTemplate, qrCodeUuid: undefined, workerUuid: qrCode.workerUuid}));
      } else {
        dispatch(setHarvestTemplate({...harvestTemplate, qrCodeUuid: qrCode.uuid, workerUuid: undefined}));
      }

      navigation.navigate('HandOverHarvest', {scenario});
    },
    [dispatch, harvestTemplate, navigation, scenario],
  );

  const onSuccess = useCallback(
    async (event: any) => {
      try {
        playLocalSoundFile();
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

        if (scenario === ScenariosEnum.templates || scenario === ScenariosEnum.handOverHarvest) {
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

  const playLocalSoundFile = () => {
    Sound.setCategory('Playback');
    const mySound = new Sound(require('src/assets/sounds/chord.mp3'), error => {
      if (error) {
        console.error('failed to load the sound', error);

        return;
      }

      mySound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.error('playback failed due to audio decoding errors');
        }
      });
    });

    mySound.setVolume(0.9);
    mySound.release();
  };

  if (loader) {
    return <Loader />;
  }

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
