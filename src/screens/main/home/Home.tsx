import React, {Fragment, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Snackbar, Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useNavigation} from '@react-navigation/native';
import styles from 'src/screens/main/home/styles';
import {colors} from 'src/styles/colors';
import {useIsDeviceConnected, useIsInternetConnected} from 'src/stores/slices/connect-device.slice';
import {deviceLabelStyle} from 'src/helpers/device-label-style';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'src/navigation/home.stack';

const buttons = [
  {title: strings.registration, destination: 'CreateWorkerStack'},
  {title: strings.giveQrCode, destination: 'GiveQrCodeStack'},
  {title: strings.templates, destination: 'HandOverHarvestStack'},
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
  const isInternetConnected = useIsInternetConnected();
  const isDeviceConnected = useIsDeviceConnected();
  const deviceState = useMemo(() => deviceLabelStyle(isDeviceConnected), [isDeviceConnected]);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <TouchableOpacity
        // disabled={isDeviceConnected}
        onPress={() => navigation.navigate('ConnectBle')}
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
      <Snackbar onDismiss={() => {}} visible={!isInternetConnected}>
        <Text style={styles.snackbar}>{strings.appWorksOffline}</Text>
      </Snackbar>
    </SafeAreaView>
  );
};

export {Home};
