import React, {Fragment, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import styles from 'src/screens/main/home/styles';
import {colors} from 'src/styles/colors';
import {setDevices, useIsDeviceConnected} from 'src/stores/slices/connect-device.slice';
import {deviceLabelStyle} from 'src/helpers/device-label-style';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'src/navigation/home.stack';
import {cleanHarvest} from 'src/stores/slices/harvest.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';

const buttons = [
  {title: strings.registration, destination: 'CreateWorkerStack'},
  {title: strings.assignQrCode, destination: 'AssignQrCodeStack'},
  {title: strings.templates, destination: 'TemplatesStack'},
  {title: strings.hangOverHarvest, destination: 'HandOverHarvestStack'},
  {title: strings.qrCodeInfo, destination: 'GetQrCodeInfoStack'},
];

const HomeButton = ({title, destination}: {title: string; destination: string}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(destination as never)}>
      <Surface elevation={4} style={styles.surface}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const Home = () => {
  const isDeviceConnected = useIsDeviceConnected();
  const deviceState = useMemo(() => deviceLabelStyle(isDeviceConnected), [isDeviceConnected]);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(cleanHarvest());
    }, [dispatch]),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={{flex: 1, marginHorizontal: '0%'}}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setDevices([]));
            navigation.navigate('ConnectBle');
          }}
          style={styles.deviceStateWrapper}>
          <IconButton icon={deviceState.icon} iconColor={deviceState.color} size={20} />
          <Text style={styles.deviceState}>{deviceState.title}</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          {buttons.map(({title, destination}) => {
            return (
              <Fragment key={title}>
                <HomeButton destination={destination} title={title} />
              </Fragment>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export {Home};
