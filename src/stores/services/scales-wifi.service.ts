import TcpSocket from 'react-native-tcp-socket';
import WifiManager from 'react-native-wifi-reborn';
import {requestLocationPermission} from 'src/helpers/location-permission';
import {wifiScalesSSID, wifiScalesTcpOptions} from 'src/constants/constants';

export const connectToWiFiScales = async () => {
  const isGrantedLocation = await requestLocationPermission();

  if (isGrantedLocation) {
    const currentSSID = await WifiManager.getCurrentWifiSSID();

    if (currentSSID !== wifiScalesSSID) {
      await WifiManager.connectToProtectedSSID(wifiScalesSSID, '', false, false);
    }

    return TcpSocket.createConnection(wifiScalesTcpOptions, () => {});
  }

  return null;
};
