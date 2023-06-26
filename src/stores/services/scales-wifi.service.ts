import TcpSocket from 'react-native-tcp-socket';
import WifiManager from 'react-native-wifi-reborn';
import {Buffer} from 'buffer';
import {requestLocationPermission} from 'src/helpers/location-permission';

const options = {
  port: 1234,
  host: '192.168.4.1',
  reuseAddress: true,
};

const scalesSSID = 'ESP8266';

export const getWeight = async () => {
  const isGrantedLocation = await requestLocationPermission();

  console.log(isGrantedLocation, 'isGrantedLocation');
  if (isGrantedLocation) {
    const currentSSID = await WifiManager.getCurrentWifiSSID();

    console.log(currentSSID, 'currentSSID');
    if (currentSSID !== scalesSSID) {
      await WifiManager.connectToProtectedSSID(scalesSSID, '', false, false);
    }

    return getWeightFromWiFiScales();
  }
};

const getWeightFromWiFiScales = () => {
  const scalesWiFi = TcpSocket.createConnection(options, () => {});

  scalesWiFi.on('data', function (data) {
    console.log('message was received', (data as Buffer).toString());
    scalesWiFi.destroy();

    return (data as Buffer).toString();
  });

  scalesWiFi.on('error', function (error) {
    console.log(error);
    scalesWiFi.destroy();
  });

  scalesWiFi.on('close', function () {
    console.log('Connection closed!');
    scalesWiFi.destroy();
  });

  return null;
};
