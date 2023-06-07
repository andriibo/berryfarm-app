import React, {useLayoutEffect, useState} from 'react';
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
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {useWorker} from 'src/stores/slices/worker.slice';
import {strings} from 'src/locales/locales';
import {FirestoreServiceError} from 'src/stores/errors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerStackParamList} from 'src/navigation/drawer.stack';

const ScanQrCode = () => {
  const worker = useWorker();
  const [errorMessage, setError] = useState('');
  const {firestorePrefix} = useFarm();
  const navigation =
    useNavigation<NativeStackNavigationProp<DrawerStackParamList>>();
  const {
    params: {scenario},
  } = useRoute<RouteProp<DrawerStackParamList, 'ScanQrCode'>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          iconColor={colors.white}
          onPress={navigation.goBack}
          size={20}
        />
      ),
    });
  }, [navigation]);

  const onSuccess = async (event: any) => {
    setError('');
    try {
      const qrCode = await getQrCodeByUuid(event.data, firestorePrefix);

      if (qrCode === null) {
        setError(strings.qrCodeNotFound);

        return;
      }

      if (qrCode?.workerUuid === worker.uuid) {
        setError(strings.qrCodeGiven);

        return;
      }

      qrCode.workerUuid = worker.uuid;
      await updateQrCode(qrCode, firestorePrefix);
    } catch (error: any) {
      if (error instanceof FirestoreServiceError) {
        setError(error.message);
      } else {
        console.error(error);
      }
    }

    navigation.navigate('SuccessPage', {scenario});
  };

  return (
    <>
      {errorMessage && <Toast error={errorMessage} />}
      <QRCodeScanner
        flashMode={RNCamera.Constants.FlashMode.auto}
        onRead={onSuccess}
        reactivate={true}
        showMarker={true}
        topContent={
          <Text style={styles.centerText}>{strings.scanQrCodeWithCamera}</Text>
        }
      />
    </>
  );
};

export {ScanQrCode};
