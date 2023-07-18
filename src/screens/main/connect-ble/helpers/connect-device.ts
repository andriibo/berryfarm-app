import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from '@reduxjs/toolkit';
import {MutableRefObject} from 'react';
import {Characteristic, Device, Subscription} from 'react-native-ble-plx';
import {
  setActiveDeviceId,
  setConnectedDevices,
  setIsDeviceConnected,
  setWeight,
} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';
import {Config} from 'react-native-config';
import {Buffer} from 'buffer';
import {disconnectDevice} from 'src/screens/main/connect-ble/helpers/disconnect-device';

type FilteredCharacteristic = Characteristic[];
const defaultFilteredCharacteristic: FilteredCharacteristic = [];

export const connectDevice = async (
  dispatch: Dispatch,
  device: Device | null,
  deviceConnectionListener: MutableRefObject<Subscription | undefined>,
) => {
  if (device === null) {
    return;
  }

  const deviceObject = await bleManager.connectToDevice(device.id, {autoConnect: true});

  await deviceObject.onDisconnected(() => {
    disconnectDevice(dispatch, device);
    deviceConnectionListener.current && deviceConnectionListener.current?.remove();
    deviceConnectionListener.current = undefined;
  });

  const isDeviceConnected = await deviceObject.isConnected();

  if (isDeviceConnected) {
    dispatch(setIsDeviceConnected(true));
    dispatch(setActiveDeviceId(device.id));
    dispatch(setConnectedDevices([device]));
    await AsyncStorage.setItem('deviceId', device.id);

    await deviceObject.discoverAllServicesAndCharacteristics();
    const services = await deviceObject.services();
    const characteristics: Characteristic[][] = [];

    services.forEach((service, index) => {
      service.characteristics().then(async items => {
        characteristics.push(items);

        if (index === services.length - 1) {
          const temp = characteristics.reduce((acc, current) => {
            return [...acc, ...current];
          }, []);

          const filteredCharacteristics: FilteredCharacteristic = temp.reduce(
            (acc: FilteredCharacteristic, item: Characteristic) => {
              if (item.isNotifiable && item.uuid !== Config.RAW_DATA_UUID) {
                acc.push(item);
              }

              return acc;
            },
            defaultFilteredCharacteristic,
          );

          filteredCharacteristics.map(characteristic =>
            characteristic.monitor((error, result) => {
              if (error) {
                if (error.message !== `Characteristic ${characteristic.id}.0 not found`) {
                  console.log(`${characteristic.uuid} Characteristic Error = `, error);

                  return;
                }

                console.log(`${characteristic.uuid} Error = `, error);

                return;
              }

              if (typeof result?.value === 'string') {
                const decodedValue = Buffer.from(result?.value, 'base64').toString();
                const arrayValues = decodedValue.split('R::W');

                if (arrayValues.length > 1) {
                  dispatch(setWeight(Number(arrayValues[1])));
                }
              } else {
                dispatch(setWeight(null));
              }
            }),
          );
        }
      });
    });
  } else {
    console.log(deviceObject);
  }
};
