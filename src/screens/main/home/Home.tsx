import React, {useCallback, useMemo} from 'react';
import {Dimensions, StatusBar, TouchableOpacity, View} from 'react-native';
import {IconButton, Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {strings} from 'src/locales/locales';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import styles from 'src/screens/main/home/styles';
import {setDevices, useIsDeviceConnected} from 'src/stores/slices/connect-device.slice';
import {deviceLabelStyle} from 'src/helpers/device-label-style';
import {cleanHarvestTemplate} from 'src/stores/slices/harvest-template.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';
import {colors} from 'src/styles/colors';

const Home = () => {
  const isDeviceConnected = useIsDeviceConnected();
  const deviceState = useMemo(() => deviceLabelStyle(isDeviceConnected), [isDeviceConnected]);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const iconSize = useMemo(() => Dimensions.get('window').width / 8, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(cleanHarvestTemplate());
    }, [dispatch]),
  );

  console.log(Dimensions.get('window').width / 8);

  return (
    <SafeAreaView style={styles.area}>
      <StatusBar hidden={true} />
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setDevices([]));
            navigation.navigate('ConnectBle' as never);
          }}
          style={styles.deviceStateWrapper}>
          <IconButton icon={deviceState.icon} iconColor={deviceState.color} size={20} style={{marginTop: 6}} />
          <Text style={styles.deviceState}>{deviceState.title}</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateWorkerStack' as never)}>
            <Surface elevation={4} style={styles.surface}>
              <View style={styles.titleWrapper}>
                <IconButton icon={'account-plus'} iconColor={colors.primary} size={iconSize} style={{marginTop: 26}} />
              </View>
              <Text style={styles.titleText}>{strings.registration}</Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AssignQrCodeStack' as never)}>
            <Surface elevation={4} style={styles.surface}>
              <View style={styles.titleWrapper}>
                <IconButton icon={'qrcode-plus'} iconColor={colors.primary} size={iconSize} style={{marginTop: 26}} />
              </View>
              <Text style={styles.titleText}>{strings.assignQrCode}</Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TemplatesStack' as never)}>
            <Surface elevation={4} style={styles.surface}>
              <View style={styles.titleWrapper}>
                <IconButton
                  icon={'map-marker-outline'}
                  iconColor={colors.primary}
                  size={iconSize}
                  style={{marginTop: 26}}
                />
              </View>
              <Text style={styles.titleText}>{strings.blocks}</Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HandOverHarvestStack' as never)}>
            <Surface elevation={4} style={styles.surface}>
              <View style={styles.titleWrapper}>
                <IconButton
                  icon={'bucket-outline'}
                  iconColor={colors.primary}
                  size={iconSize}
                  style={{marginTop: 26}}
                />
              </View>
              <Text style={styles.titleText}>{strings.hangOverHarvest}</Text>
            </Surface>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('GetQrCodeInfoStack' as never)}>
            <Surface elevation={4} style={styles.surface}>
              <View style={styles.titleWrapper}>
                <IconButton icon={'qrcode'} iconColor={colors.primary} size={iconSize} style={{marginTop: 26}} />
              </View>
              <Text style={styles.titleText}>{strings.qrCodeInfo}</Text>
            </Surface>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export {Home};
