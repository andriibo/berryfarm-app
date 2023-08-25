import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Alert, Linking, SectionList, Text, TouchableOpacity, View} from 'react-native';
import {BleManager, Device, Subscription} from 'react-native-ble-plx';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {androidBLE, iosBLE, isIOS} from 'src/constants/constants';
import {HomeStackParamList} from 'src/navigation/home.stack';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {
  setConnectedDevices,
  setDevices,
  useActiveDeviceId,
  useConnectedDevices,
  useDevices,
  useIsBleScanning,
  useIsDeviceConnected,
} from 'src/stores/slices/connect-device.slice';
import {connectDevice} from './helpers/connect-device';
import {disconnectDevice} from './helpers/disconnect-device';
import {startScanBle} from './helpers/start-scan-ble';
import styles from './styles';
import {strings} from 'src/locales/locales';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';
import {stopScanBle} from 'src/screens/main/connect-ble/helpers/stop-scan-ble';

export const bleManager = new BleManager();
const ListEmptyComponent = () => <Text style={styles.boldTextStyle}>{strings.noDevices}</Text>;

const ConnectBle = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useAppDispatch();
  const devices = useDevices();
  const connectedDevices = useConnectedDevices();
  const isBleScanning = useIsBleScanning();
  const activeDeviceId = useActiveDeviceId();
  const deviceConnectionListener = useRef<Subscription>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);
  const isDeviceConnected = useIsDeviceConnected();

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => isBleScanning && <Text style={styles.searching}>{strings.searching}</Text>,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () =>
        !isConnecting && (
          <IconButton
            icon="arrow-left"
            iconColor={colors.white}
            onPress={() => {
              navigation.goBack();
              stopScanBle(dispatch);
            }}
            size={20}
          />
        ),
    });
  });

  useEffect(() => {
    const subscription = bleManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        startScanBle(dispatch, devices, isBleScanning, navigation).then();
        subscription.remove();
      }

      if (state === 'PoweredOff') {
        stopScanBle(dispatch);
        Alert.alert(strings.toConnectScalesNeedsTurnOnBluetooth, strings.turnOnBluetoothInParameters, [
          {
            text: strings.cancel,
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
          {
            text: strings.settings,
            onPress: () => {
              isIOS ? Linking.openURL(iosBLE) : Linking.sendIntent(androidBLE);
            },
          },
        ]);
      }
    }, true);

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, dispatch, navigation]);

  const handleDisconnectByTap = async (device: Device) => {
    await AsyncStorage.removeItem('deviceId');
    disconnectDevice(dispatch, device);
  };

  const pairWithDevice = async (device: Device) => {
    try {
      if (!isDeviceConnected) {
        await handleConnectByTap(device);
      }

      if (isDeviceConnected && activeDeviceId !== device.id) {
        const deviceToDisconnect = connectedDevices.find(connectedDevice => {
          return connectedDevice.id === activeDeviceId;
        });

        if (deviceToDisconnect) {
          await handleDisconnectByTap(deviceToDisconnect);
        }

        await handleConnectByTap(device);
      }

      if (isDeviceConnected && activeDeviceId === device.id) {
        Alert.alert(strings.disconnect, `${strings.doYouWantToDisconnectScales} ${device.id} ${device.name}?`, [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.yes,
            onPress: () => handleDisconnectByTap(device),
          },
        ]);
      }
    } catch (err) {
      Alert.alert(strings.error, strings.unableConnectScales, [
        {
          text: strings.ok,
          style: 'default',
        },
      ]);

      const validDevices = devices.filter(item => {
        return item.id !== device.id;
      });

      dispatch(setDevices(validDevices));
      dispatch(setConnectedDevices([]));
      disconnectDevice(dispatch, device);
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }
  };

  const handleConnectByTap = async (device: Device) => {
    setConnectingDeviceId(device.id);
    setIsConnecting(true);
    await connectDevice(dispatch, device, deviceConnectionListener);
    navigation.navigate('Home');
    stopScanBle(dispatch);
  };

  const sections = useMemo(
    () => [
      {
        title: '',
        data: connectedDevices,
      },
      {
        title: '',
        data: devices.filter(item => item?.id !== connectedDevices[0]?.id),
      },
    ],
    [connectedDevices, devices],
  );

  const keyExtractor = (item: Device) => item.id;
  const renderItem = ({item}: {item: Device}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={isConnecting}
      onPress={() => pairWithDevice(item)}
      style={styles.itemWrapper}>
      <View style={styles.item}>
        <Text style={styles.itemText}>
          {item.id} {item.name}
        </Text>
        {connectingDeviceId === item.id && !isDeviceConnected && isConnecting && <Text>{strings.connecting}</Text>}
        {activeDeviceId === item.id && isDeviceConnected && <Text>{strings.connected}</Text>}
      </View>
      <IconButton
        icon="bluetooth"
        iconColor={activeDeviceId === item.id && isDeviceConnected ? colors.primary : colors.black}
        size={20}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.area, {marginTop: -insets.top, marginBottom: -insets.bottom}]}>
      <SectionList
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={({section: {title, data}}) => (data.length ? <Text>{title}</Text> : null)}
        sections={sections}
      />
    </SafeAreaView>
  );
};

export {ConnectBle};
