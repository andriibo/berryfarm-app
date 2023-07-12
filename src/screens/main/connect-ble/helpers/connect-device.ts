import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from '@reduxjs/toolkit';
import {MutableRefObject} from 'react';
import {Characteristic, Device, Subscription} from 'react-native-ble-plx';
import {Config} from 'react-native-config';
import {setActiveDeviceId, setConnectedDevices, setIsDeviceConnected} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';

type FilteredCharacteristic = {notify: Characteristic[]; write: Characteristic[]};
const defaultFilteredCharacteristic: FilteredCharacteristic = {
  notify: [],
  write: [],
};

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
    dispatch(setIsDeviceConnected(false));
    deviceConnectionListener.current && deviceConnectionListener.current?.remove();
    deviceConnectionListener.current = undefined;
  });

  const isDeviceConnected = await deviceObject.isConnected();

  if (isDeviceConnected) {
    dispatch(setIsDeviceConnected(true));
    dispatch(setActiveDeviceId(device.id));
    dispatch(setConnectedDevices([]));
    dispatch(setConnectedDevices([device]));
    await AsyncStorage.setItem('deviceId', device.id);

    await deviceObject.discoverAllServicesAndCharacteristics();
    const services = await deviceObject.services();
    const characteristics: Characteristic[][] = [];

    services.forEach((service, index) => {
      service.characteristics().then(async c => {
        characteristics.push(c);

        if (index === services.length - 1) {
          const temp = characteristics.reduce((acc, current) => {
            return [...acc, ...current];
          }, []);

          const filteredCharacteristics: FilteredCharacteristic = temp.reduce(
            (acc: FilteredCharacteristic, item: Characteristic) => {
              if (item.isNotifiable && item.uuid !== Config.RAW_DATA_UUID) {
                acc.notify.push(item);
              } else if (item.isReadable) {
                acc.write.push(item);
              }

              return acc;
            },
            defaultFilteredCharacteristic,
          );

          console.log('filteredCharacteristics.notify', filteredCharacteristics.notify);
          console.log('filteredCharacteristics.write', filteredCharacteristics.write);

          // setCharsWrite(filteredCharacteristics.write)

          const notifySubs = filteredCharacteristics.notify.map(characteristic =>
            characteristic.monitor(error => {
              if (error) {
                if (error.message !== `Characteristic ${characteristic.id}.0 not found`) {
                  console.log(`${characteristic.uuid} Characteristic Error = `, error);

                  return;
                }

                console.log(`${characteristic.uuid} Error = `, error);

                return;
              }
            }),
          );

          console.log('notifySubs array', notifySubs);

          const getWithForOf = async () => {
            const data = [];

            for (const characteristic of filteredCharacteristics.write) {
              const result = await characteristic.read();

              data.push(result);
              console.log('end for of data -', data);
            }
          };

          await getWithForOf();

          //
          // const writeSubs = filteredCharacteristics.write.map((characteristic) =>
          //   characteristic.read().then((result) => console.log(`${characteristic.uuid} result =`, result)),
          // )
          //
          // console.log('writeSubs array', writeSubs)
        }
      });
    });
  } else {
    console.log(deviceObject);
  }
};
