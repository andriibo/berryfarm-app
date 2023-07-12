import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Dispatch} from '@reduxjs/toolkit';
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Alert, Linking, SectionList, Text, TouchableOpacity, View} from 'react-native';
import {BleManager, Device, Subscription} from 'react-native-ble-plx';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {androidBLE, iosBLE, isIOS} from 'src/constants/constants';
import {HomeStackParamList} from 'src/navigation/home.stack';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {
  setConnectedDevices,
  setDevices,
  setIsEnabledScreens,
  setIsSearching,
  useActiveDeviceId,
  useConnectedDevices,
  useDevices,
  useIsDeviceConnected,
  useIsInternetConnected,
  useIsSearching,
} from 'src/stores/slices/connect-device.slice';
import {connectDevice} from './helpers/connect-device';
import {disconnectDevice} from './helpers/disconnect-device';
import {startScanBle} from './helpers/start-scan-ble';
import styles from './styles';
import {strings} from 'src/locales/locales';
import {colors} from 'src/styles/colors';
import {IconButton} from 'react-native-paper';

export const bleManager = new BleManager();
const ItemSeparatorComponent = () => <View style={styles.separator} />;
const ListEmptyComponent = () => <Text style={styles.boldTextStyle}>No Devices</Text>;

const stopDeviceScan = (dispatch: Dispatch) => {
  dispatch(setIsSearching(false));
  bleManager.stopDeviceScan();
};

const ConnectBle = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useAppDispatch();
  const devices = useDevices();
  const connectedDevices = useConnectedDevices();
  const isSearch = useIsSearching();
  const activeDeviceId = useActiveDeviceId();
  const isPeripheralConnected = useIsDeviceConnected();
  const deviceConnectionListener = useRef<Subscription>();
  const isInternetConnected = useIsInternetConnected();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);

  // const navigationState = useNavigationState((state) => state)
  // const currentRoute = navigationState && navigationState.routes[navigationState.index].name

  const handleSearch = async () => {
    if (!isSearch) {
      dispatch(setDevices([]));
      dispatch(setIsSearching(true));
      await startScanBle(dispatch, devices, connectedDevices);
    } else {
      stopDeviceScan(dispatch);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setDevices([]));
      if (!isPeripheralConnected) {
        dispatch(setIsSearching(true));
        startScanBle(dispatch, devices, connectedDevices).then();
      }

      if (!isInternetConnected) {
        dispatch(setIsEnabledScreens(true));
      }
    }, [dispatch, isInternetConnected]),
  );

  useEffect(() => {
    if (connectedDevices.length && !isPeripheralConnected) {
      disconnectDevice(dispatch, connectedDevices[0]);
      dispatch(setDevices([...devices].filter(item => item.id !== connectedDevices[0].id)));
      handleSearch().then();
      setIsConnecting(false);
    }
  }, [connectedDevices, isPeripheralConnected]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSearch}>
          <Text style={{color: colors.white, fontSize: 17}}>{isSearch ? 'Searching...' : 'Search'}</Text>
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    const subscription = bleManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        startScanBle(dispatch, devices, connectedDevices).then();
        subscription.remove();
      }

      if (state === 'PoweredOff') {
        stopDeviceScan(dispatch);
        Alert.alert(strings.technowagyNeedsBluetooth, strings.turnOnBluetoothInParameters, [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.parameters,
            onPress: () => {
              isIOS ? Linking.openURL(iosBLE) : Linking.sendIntent(androidBLE);
            },
          },
        ]);
      }
    }, true);

    return () => subscription.remove();
  }, [connectedDevices, devices, dispatch]);

  const handleDisconnectByTap = async (item: Device) => {
    await AsyncStorage.removeItem('deviceId');
    dispatch(setDevices([]));
    dispatch(setConnectedDevices([]));
    disconnectDevice(dispatch, item);
    await startScanBle(dispatch, devices, connectedDevices);
  };

  // useEffect(() => {
  //   console.log(currentRoute)
  //   setTimeout(() => {
  //     if (isConnecting && !isPeripheralConnected && currentRoute === 'ConnectBle') {
  //       handleSearch().then()
  //     }
  //   }, 30000)
  // }, [currentRoute, isConnecting, isPeripheralConnected])

  const pairWithDevice = async (item: Device) => {
    bleManager.stopDeviceScan();
    dispatch(setIsSearching(false));
    try {
      const isDeviceConnected = await bleManager.isDeviceConnected(item.id);

      if (isDeviceConnected) {
        Alert.alert('Disconnect', `Do you want to disconnect device ${item.name}`, [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.yes,
            onPress: () => handleDisconnectByTap(item),
          },
        ]);
      } else {
        await setConnectingDeviceId(item.id);
        await setIsConnecting(true);
        await connectDevice(dispatch, item, deviceConnectionListener);
        setConnectingDeviceId(null);

        setTimeout(() => navigation.navigate('Home'), 2000);
      }
    } catch (err) {
      if (err === `Device ${item.id} was disconnected.`) {
        Alert.alert('Error', 'Unable to connect to the device. Please try again.', [
          {
            text: strings.ok,
            style: 'default',
          },
        ]);
      }

      dispatch(setConnectedDevices([]));
      disconnectDevice(dispatch, item);
      setIsConnecting(false);
      setConnectingDeviceId(null);
      handleSearch().then();
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }
  };

  const sections = useMemo(
    () => [
      {
        title: 'Connected',
        data: connectedDevices,
      },
      {
        title: 'Other',
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
        <Text style={styles.itemText}>{item.name}</Text>
        {connectingDeviceId === item.id && isConnecting && <Text>Connecting</Text>}
        {activeDeviceId === item.id && !isConnecting && <Text>Connected</Text>}
      </View>
      <IconButton icon="bluetooth" iconColor={activeDeviceId === item.id ? colors.primary : colors.black} size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {marginTop: -insets.top, marginBottom: -insets.bottom}]}>
      <SectionList
        ItemSeparatorComponent={ItemSeparatorComponent}
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
