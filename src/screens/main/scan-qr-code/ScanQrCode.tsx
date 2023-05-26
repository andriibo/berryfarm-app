import React from 'react';
import {Text, TouchableOpacity, Linking} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import styles from 'src/screens/main/scan-qr-code/styles';

const ScanQrCode = () => {
  const onSuccess = (e: any) => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured.', err),
    );
  };

  return (
    <QRCodeScanner
      bottomContent={
        <TouchableOpacity style={styles.buttonTouchable}>
          <Text style={styles.buttonText}>OK!</Text>
        </TouchableOpacity>
      }
      flashMode={RNCamera.Constants.FlashMode.torch}
      onRead={onSuccess}
      topContent={<Text style={styles.centerText}>Scan the QR code.</Text>}
    />
  );
};

export {ScanQrCode};
